// Type definitions for InventoryPredictor Backend

// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  brand?: string;
  category_id?: string;
  stock_quantity: number;
  reorder_level: number;
  images?: string[];
  thumbnail?: string;
  rating: number;
  review_count: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  total: number;
  shipping_address: ShippingAddress;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}

// API Request Types
export interface CreateOrderRequest {
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: ShippingAddress;
}

export interface UpdateStockRequest {
  qtyChange: number;
}

export interface GenerateForecastRequest {
  horizon_days: 30 | 60 | 90;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  total?: number;
}

// Inventory Types
export interface InventoryStats {
  total: number;
  lowStock: number;
  outOfStock: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  slug: string;
  stock_quantity: number;
  reorder_level: number;
  price: number;
  category_id?: string;
  thumbnail?: string;
  brand?: string;
}

// Forecast Types
export interface ForecastResult {
  forecasts: ProductForecast[];
  summary: string;
  recommendations: string[];
}

export interface ProductForecast {
  product_name: string;
  predicted_demand: number;
  restock_needed: boolean;
  urgency: 'low' | 'medium' | 'high';
}

export interface ReorderRecommendation {
  product_id: string;
  product_name: string;
  current_stock: number;
  recommended_order: number;
  urgency: 'low' | 'medium' | 'high';
  reasoning: string;
}

export interface SalesAnalytics {
  period_days: number;
  total_orders: number;
  total_revenue: number;
  total_items_sold: number;
  average_order_value: number;
}

// JWT Payload
export interface JwtPayload {
  id: string;
  email: string;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}
