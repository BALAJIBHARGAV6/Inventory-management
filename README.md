<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Fastify-4.0-white?style=for-the-badge&logo=fastify" alt="Fastify" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.1-FF6B35?style=for-the-badge" alt="Groq AI" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
</p>

<h1 align="center">🚀 InventoryPredictor</h1>

<p align="center">
  <strong>AI-Powered Inventory Management System with E-Commerce Platform</strong>
</p>

<p align="center">
  <em>B.Tech Final Year Project 2025-26</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-team">Team</a>
</p>

---

## 📋 Overview

**InventoryPredictor** is a comprehensive full-stack inventory management system that combines a modern e-commerce platform with AI-powered demand forecasting. Built for the Indian market, it helps businesses manage inventory efficiently by predicting future demand patterns, automating reorder processes, and providing real-time analytics.

### 🎯 Key Highlights

- **AI-Powered Forecasting** - Predict demand using Groq's LLaMA 3.1 70B model
- **Real-time Inventory Tracking** - Monitor stock levels with automated alerts
- **E-Commerce Platform** - Full-featured online shopping experience
- **Analytics Dashboard** - Comprehensive sales and inventory insights
- **Mobile Responsive** - Optimized for all device sizes

---

## 🌐 Demo

### Live URLs
| Platform | URL |
|----------|-----|
| **Frontend** | [https://inventory-management-ecommerce.vercel.app](https://inventory-management-ecommerce.vercel.app) |
| **Backend API** | [https://inventory-management-production-4d6b.up.railway.app](https://inventory-management-production-4d6b.up.railway.app) |

### Demo Pages
| Page | Description |
|------|-------------|
| 🏠 `/homepage` | Landing page with featured products |
| 🛍️ `/product-listing` | Browse all products with filters |
| 📦 `/product-details/[id]` | Detailed product view |
| 🛒 `/shopping-cart` | Shopping cart management |
| 👤 `/profile` | User profile & order history |
| ℹ️ `/about` | About the project & team |
| 📊 `/admin` | Admin dashboard with AI forecasting |

---

## 🎯 Quick Start

```bash
# Backend (Terminal 1)
cd backend && npm install && npm run dev
# Runs on http://localhost:4000

# Frontend (Terminal 2)  
cd frontend && npm install && npm run dev
# Runs on http://localhost:3000
```

**Demo Pages:**
- 🏠 Homepage: http://localhost:3000/homepage
- 🛍️ Products: http://localhost:3000/product-listing
- 📊 Admin Dashboard: http://localhost:3000/admin
- 👤 Login: http://localhost:3000/login

---

## ✨ Features

### E-Commerce Storefront
- **🛒 Product Catalog**: Browse by categories with search & filters
- **🛍️ Shopping Cart**: Persistent cart with quantity management
- **👤 User Accounts**: Registration, login, profile management
- **📦 Order Management**: Place orders, track status, view history
- **💳 Checkout Flow**: Address capture and order confirmation

### Admin Dashboard
- **📊 Inventory Stats**: Total products, low stock, out of stock counts
- **📈 Sales Analytics**: Revenue, orders, items sold metrics
- **🤖 AI Forecasting**: Generate 30/60/90 day demand predictions
- **⚠️ Low Stock Alerts**: Automatic identification of items needing restock
- **💡 AI Recommendations**: Smart reorder quantity suggestions

### AI Capabilities (Powered by Groq)
- **Demand Forecasting**: Predicts future product demand using LLaMA 3.1 70B
- **Reorder Recommendations**: Urgency-based suggestions (high/medium/low)
- **Pattern Analysis**: Identifies trends from sales history

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 | React framework with App Router |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Backend** | Fastify | High-performance Node.js API |
| **Language** | TypeScript | Type-safe JavaScript |
| **Database** | Supabase | Managed PostgreSQL + Auth |
| **AI/ML** | Groq (LLaMA 3.1 70B) | Demand forecasting |
| **Icons** | Lucide React | Beautiful icons |

---

## 📁 Project Structure

```
inventory-management/
├── backend/                    # Fastify API Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts    # Supabase client
│   │   │   └── groq.ts        # Groq AI client
│   │   ├── routes/
│   │   │   ├── auth.route.ts  # User authentication
│   │   │   ├── products.route.ts
│   │   │   ├── orders.route.ts
│   │   │   ├── inventory.route.ts
│   │   │   └── forecast.route.ts  # AI predictions
│   │   ├── services/
│   │   │   ├── ai.service.ts      # Groq integration
│   │   │   └── inventory.service.ts
│   │   └── server.ts          # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   │   ├── homepage/
│   │   │   ├── product-listing/
│   │   │   ├── product-detail/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── login/
│   │   │   ├── profile/
│   │   │   ├── admin/         # Admin Dashboard
│   │   │   └── order-confirmation/
│   │   ├── components/
│   │   │   ├── common/        # Header, Footer
│   │   │   └── ui/            # Reusable components
│   │   ├── contexts/          # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   └── lib/
│   │       └── supabase.js    # Supabase client
│   ├── supabase/
│   │   ├── schema.sql         # Database schema
│   │   └── seed.sql           # Sample data
│   └── package.json
│
├── DOCUMENTATION.md           # Detailed documentation
└── README.md
```

---

## 📦 Prerequisites

- **Node.js**: v18 or higher
- **npm**: Package manager
- **Git**: Version control

### External Services Required

| Service | Purpose | Sign Up |
|---------|---------|---------|
| Supabase | Database & Auth | [supabase.com](https://supabase.com) |
| Groq | AI Predictions | [groq.com](https://console.groq.com) |

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd inventory-management
```

### 2. Install Backend Dependencies

```bash
cd backend
pnpm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
pnpm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Redis (local development)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Server
PORT=4000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional: Error Tracking
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Payment Gateway (Optional)
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
```

---

## 🏃 Running the Application

### Option 1: Docker Compose (Recommended)

Start all services with one command:

```bash
# From project root
docker-compose up -d
```

This starts:
- Redis (port 6379)
- Backend API (port 4000)
- Forecast Worker (background)

Access the backend at: `http://localhost:4000/health`

### Option 2: Manual Setup

#### 1. Start Redis

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

#### 2. Set Up Database

```bash
cd backend

# Push Prisma schema to Supabase
pnpm prisma db push

# Or run migrations
pnpm prisma migrate dev

# Generate Prisma Client
pnpm prisma generate
```

#### 3. Seed Sample Data

```bash
# Generate sample products, sales, and suppliers
tsx scripts/seed-database.ts
```

#### 4. Start Backend

```bash
cd backend

# Development mode (with hot reload)
pnpm dev

# Production mode
pnpm build
pnpm start
```

#### 5. Start Forecast Worker

In a new terminal:

```bash
cd backend
pnpm worker:forecast
```

#### 6. Start Frontend

```bash
cd frontend
pnpm dev
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health**: http://localhost:4000/health

---

## 📚 API Documentation

### Base URL

```
http://localhost:4000/api
```

### Authentication

Most endpoints require authentication. Include the JWT token in headers:

```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Products

```http
GET    /api/products              # List products
GET    /api/products/:id          # Get product details
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Soft delete
```

#### Inventory

```http
GET    /api/inventory             # List all inventory
GET    /api/inventory/:sku        # Get inventory for SKU (with AI recommendations)
PUT    /api/inventory/:sku        # Update stock levels
POST   /api/inventory/adjust      # Manual adjustment
GET    /api/inventory/alerts/low-stock  # Get low-stock items
```

**Example Response** (`GET /api/inventory/TEE-BLK-M-001`):

```json
{
  "sku": "TEE-BLK-M-001",
  "qty_available": 15,
  "qty_reserved": 5,
  "safety_stock": 20,
  "reorder_point": 30,
  "status": "low_stock",
  "aiRecommendation": {
    "should_reorder": true,
    "suggested_qty": 100,
    "reasoning": "Current stock (15) is below reorder point (30). Based on 30-day forecast of 85 units and 7-day lead time, recommend ordering 100 units.",
    "urgency": "high"
  }
}
```

#### Forecasting

```http
POST   /api/forecast/generate     # Generate forecast for SKU(s)
GET    /api/forecast/:sku         # Get latest forecast
GET    /api/forecast/:sku/history # Historical accuracy
```

**Generate Forecast Request**:

```json
{
  "skus": ["TEE-BLK-M-001", "JEAN-BLU-32-001"],
  "horizon_days": 30,
  "force_refresh": false
}
```

**Forecast Response**:

```json
{
  "sku": "TEE-BLK-M-001",
  "horizon_days": 30,
  "generated_at": "2025-12-01T08:00:00Z",
  "predictions": [
    {"date": "2025-12-02", "predicted_qty": 3, "confidence_lower": 2, "confidence_upper": 5},
    {"date": "2025-12-03", "predicted_qty": 2, "confidence_lower": 1, "confidence_upper": 4}
  ],
  "summary": {
    "total_predicted": 85,
    "daily_average": 2.8,
    "peak_day": "2025-12-25",
    "peak_qty": 12
  },
  "ai_explanation": "Demand expected to increase by 15% due to seasonal trends..."
}
```

#### Purchase Orders

```http
POST   /api/po/draft              # AI-generate draft PO
GET    /api/po                    # List all POs
GET    /api/po/:id                # Get PO details
POST   /api/po/:id/approve        # Approve PO
POST   /api/po/:id/send           # Mark as sent
POST   /api/po/:id/receive        # Receive and update inventory
PUT    /api/po/:id                # Update PO
DELETE /api/po/:id                # Cancel PO
```

**Generate PO Request**:

```json
{
  "skus": ["TEE-BLK-M-001", "JEAN-BLU-32-001"],
  "supplier_id": "uuid-supplier-id",
  "reason": "weekly_reorder",
  "notes": "Urgent - festival season"
}
```

**PO Draft Response** (AI-generated):

```json
{
  "po_number": "PO-2025-0042",
  "status": "draft",
  "line_items": [
    {
      "sku": "TEE-BLK-M-001",
      "qty": 100,
      "unit_price_inr": 250,
      "total_inr": 25000
    }
  ],
  "total_amount_inr": 65000,
  "ai_reasoning": "Reorder analysis: TEE-BLK-M-001 (100 units) - Current stock: 15 units (below reorder point of 30)...",
  "draft_email_subject": "Purchase Order PO-2025-0042 - Urgent Restock Request",
  "draft_email_body": "Dear Supplier, Please process the following purchase order..."
}
```

#### Suppliers

```http
GET    /api/suppliers             # List suppliers
POST   /api/suppliers             # Create supplier
PUT    /api/suppliers/:id         # Update supplier
GET    /api/suppliers/:id/prices  # Get price list
POST   /api/suppliers/:id/prices  # Update prices
```

---

## 🗄️ Database Schema

### Key Tables

#### `products`
- Core product information (name, category, brand, images)
- One-to-many relationship with variants

#### `variants`
- Product variations (size, color, etc.)
- Pricing information (price_inr, compare_at_price_inr, cost_price_inr)

#### `inventory`
- Real-time stock levels (qty_available, qty_reserved)
- Reorder thresholds (safety_stock, reorder_point)
- Lead time tracking

#### `sales`
- Historical sales transactions
- Source of truth for forecasting
- Links to orders and customers

#### `forecasts`
- AI-generated demand predictions
- Stores predictions as JSONB array
- Includes accuracy metrics and AI explanations

#### `purchase_orders`
- PO lifecycle (draft → approved → sent → received)
- AI-generated reasoning and email drafts
- Links to suppliers and line items

#### `suppliers`
- Supplier contact information
- Payment terms and lead times
- Rating system

#### `inventory_audit_log`
- Complete audit trail of all inventory changes
- Tracks adjustments, restocks, sales, returns

### Full Schema

See [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) for the complete database schema with indexes, triggers, and Row Level Security (RLS) policies.

---

## 🤖 AI Features

### 1. Demand Forecasting

**How It Works:**
1. System retrieves last 90 days of sales history for a SKU
2. Data is sent to OpenAI GPT-4 with context (current stock, safety levels, lead times)
3. AI analyzes patterns, seasonality, and trends
4. Returns day-by-day predictions with confidence intervals
5. Generates plain-English explanation of forecast reasoning

**Forecast Accuracy:**
- Target: MAPE (Mean Absolute Percentage Error) < 25%
- Tracked per SKU and updated as actual sales data becomes available
- Confidence levels: High (MAPE < 20%), Medium (20-35%), Low (>35%)

### 2. Intelligent Reordering

AI considers:
- Current stock levels vs. reorder point
- Forecasted demand for next 30-90 days
- Supplier lead times
- Safety stock requirements
- Historical velocity trends

**Example Reasoning:**
> "Current stock (15 units) is below reorder point (30). Based on 30-day forecast of 85 units and 7-day lead time, recommend ordering 100 units to maintain safety stock buffer through peak season."

### 3. Automated Purchase Orders

**PO Generation Process:**
1. Select SKUs needing reorder (manual or automatic based on alerts)
2. Choose supplier (AI recommends best option based on pricing and lead time)
3. AI calculates optimal order quantities for each SKU
4. Generates professional email draft with Indian business formatting
5. Provides detailed reasoning for quantities

**AI-Generated Email Example:**
```
Subject: Purchase Order PO-2025-0042 - Urgent Restock Request

Dear TextileCorp Procurement Team,

Please process the following purchase order for urgent restocking:

PO Number: PO-2025-0042
Requested Delivery Date: December 15, 2025

Items:
- Classic Black T-Shirt (M) | SKU: TEE-BLK-M-001 | Qty: 100 | ₹250/unit | Total: ₹25,000

Total Order Value: ₹25,000 (Twenty-Five Thousand Rupees)

Payment Terms: Net 30 as per our agreement.

Please confirm order acceptance at your earliest convenience.

Best regards,
[Your Company] Procurement
```

### 4. Inventory Insights

Get natural language explanations for any inventory situation:
- Stock status assessment (healthy/low/critical)
- Risk analysis (days until stockout)
- Recommended actions with reasoning

---

## 🚢 Deployment

### Backend (Render/Railway)

#### Render Deployment

1. **Create `render.yaml`:**

```yaml
services:
  - type: web
    name: inventory-backend
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: REDIS_URL
        fromService:
          type: redis
          name: inventory-redis
          property: connectionString

  - type: worker
    name: inventory-worker
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm run worker:forecast
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: REDIS_URL
        fromService:
          type: redis
          name: inventory-redis
          property: connectionString

  - type: redis
    name: inventory-redis
    plan: starter
```

2. **Connect to GitHub** and deploy

#### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

### Frontend (Vercel)

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import in Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variables from `.env.local.example`
   - Deploy!

### Database (Supabase)

Already managed! Just run migrations:

```bash
cd backend
pnpm prisma db push
```

---

## 🧪 Testing

### Run Unit Tests

```bash
cd backend
pnpm test
```

### Run Integration Tests

```bash
pnpm test:integration
```

### Test API Endpoints

Use the provided Postman collection or curl:

```bash
# Health check
curl http://localhost:4000/health

# Get inventory with AI recommendations
curl http://localhost:4000/api/inventory/TEE-BLK-M-001

# Generate forecast
curl -X POST http://localhost:4000/api/forecast/generate \
  -H "Content-Type: application/json" \
  -d '{"skus": ["TEE-BLK-M-001"], "horizon_days": 30}'
```

---

## 📊 Success Metrics

Track these KPIs to measure system effectiveness:

- **Forecast Accuracy**: MAPE < 25% (target)
- **Inventory Turnover**: Days to sell through stock
- **Stockout Rate**: % of time SKUs are out of stock
- **Order-to-Inventory Latency**: Time from order to inventory update (target: < 60s)
- **PO Processing Time**: Time from draft to approval (target: < 24 hours)
- **Reorder Hit Rate**: % of AI recommendations that prevent stockouts

---

## 👥 Team

<table>
  <tr>
    <td align="center"><strong>Pragathi</strong><br/><em>Full Stack Development</em></td>
    <td align="center"><strong>Meghana</strong><br/><em>Frontend Development</em></td>
    <td align="center"><strong>Sravani</strong><br/><em>Backend Development</em></td>
    <td align="center"><strong>Prem Sai</strong><br/><em>Database & API</em></td>
    <td align="center"><strong>Ajay</strong><br/><em>UI/UX Design</em></td>
  </tr>
</table>

---

## 📄 License

This project is developed as a **B.Tech Final Year Project** for academic purposes.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Groq](https://groq.com/) - AI Inference Platform
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Vercel](https://vercel.com/) - Frontend Hosting
- [Railway](https://railway.app/) - Backend Hosting

---

<p align="center">
  <strong>Built with ❤️ as a B.Tech Final Year Project 2025-26</strong>
</p>

<p align="center">
  <a href="https://inventory-management-ecommerce.vercel.app">View Live Demo</a> •
  <a href="https://github.com/BALAJIBHARGAV6/Inventory-management">GitHub Repository</a>
</p>
