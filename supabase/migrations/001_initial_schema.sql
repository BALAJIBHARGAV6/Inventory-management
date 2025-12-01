-- InventoryPredictor Database Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    brand TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);

-- Product variants (size, color, etc.)
CREATE TABLE variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    attributes JSONB,
    price_inr NUMERIC(12, 2) NOT NULL,
    compare_at_price_inr NUMERIC(12, 2),
    cost_price_inr NUMERIC(12, 2),
    weight_grams INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_sku ON variants(sku);
CREATE INDEX idx_variants_product ON variants(product_id);

-- Inventory levels
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL REFERENCES variants(sku) ON DELETE CASCADE,
    location TEXT DEFAULT 'main_warehouse',
    qty_available INTEGER DEFAULT 0 CHECK (qty_available >= 0),
    qty_reserved INTEGER DEFAULT 0 CHECK (qty_reserved >= 0),
    safety_stock INTEGER DEFAULT 10,
    reorder_point INTEGER DEFAULT 20,
    lead_time_days INTEGER DEFAULT 7,
    last_restocked_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sku, location)
);

CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_low_stock ON inventory(qty_available) 
    WHERE qty_available < reorder_point;

-- Sales transactions
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL,
    sku TEXT NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    price_inr NUMERIC(12, 2) NOT NULL,
    discount_inr NUMERIC(12, 2) DEFAULT 0,
    sold_at TIMESTAMPTZ NOT NULL,
    customer_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sales_sku_date ON sales(sku, sold_at DESC);
CREATE INDEX idx_sales_order ON sales(order_id);

-- AI-generated forecasts
CREATE TABLE forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL,
    horizon_days INTEGER NOT NULL CHECK (horizon_days IN (30, 60, 90)),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    predictions JSONB NOT NULL,
    accuracy_metrics JSONB,
    ai_explanation TEXT,
    model_version TEXT DEFAULT 'gpt-4-turbo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forecasts_sku_horizon ON forecasts(sku, horizon_days, generated_at DESC);

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    payment_terms TEXT,
    lead_time_days INTEGER DEFAULT 14,
    rating NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier price lists
CREATE TABLE supplier_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    unit_price_inr NUMERIC(12, 2) NOT NULL,
    moq INTEGER DEFAULT 1,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_supplier_prices_sku ON supplier_prices(sku, supplier_id);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number TEXT UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    status TEXT DEFAULT 'draft' CHECK (
        status IN ('draft', 'pending_approval', 'approved', 'sent', 'received', 'cancelled')
    ),
    line_items JSONB NOT NULL,
    total_amount_inr NUMERIC(12, 2) NOT NULL,
    expected_delivery_date DATE,
    ai_reasoning TEXT,
    draft_email_subject TEXT,
    draft_email_body TEXT,
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);

-- Inventory audit log
CREATE TABLE inventory_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL,
    change_type TEXT NOT NULL,
    qty_change INTEGER NOT NULL,
    qty_before INTEGER NOT NULL,
    qty_after INTEGER NOT NULL,
    reference_id TEXT,
    reason TEXT,
    changed_by UUID,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_sku_date ON inventory_audit_log(sku, changed_at DESC);

-- Admin settings
CREATE TABLE admin_settings (
    user_id UUID PRIMARY KEY,
    low_stock_alert_enabled BOOLEAN DEFAULT true,
    forecast_email_frequency TEXT DEFAULT 'weekly',
    notification_channels JSONB DEFAULT '["email"]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Public products read" ON products
    FOR SELECT USING (is_active = true);

-- Admin full access inventory
CREATE POLICY "Admin full access inventory" ON inventory
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
