# 🚀 InventoryPredictor

> **AI-Powered E-Commerce Platform with Intelligent Inventory Forecasting**

An end-to-end inventory management system built for the Indian e-commerce market, featuring OpenAI-powered demand forecasting, automated purchase order generation, and real-time inventory tracking.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [AI Features](#-ai-features)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Functionality
- **🛒 E-Commerce Storefront**: Product catalog with Indian Rupee (₹) pricing
- **📊 Real-Time Inventory Tracking**: Live stock levels across multiple warehouses
- **🤖 AI-Powered Forecasting**: 30/60/90-day demand predictions using OpenAI GPT-4
- **📝 Automated Purchase Orders**: AI-generated PO drafts with reasoning and supplier recommendations
- **📈 Analytics Dashboard**: Comprehensive inventory insights and forecast visualization
- **⚠️ Smart Alerts**: Automated low-stock notifications with reorder suggestions

### Indian Market Localization
- ₹ INR currency formatting
- Indian address formats (PIN code, state, city)
- Payment gateway integration (Razorpay/UPI ready)
- Indian business communication style

### AI Capabilities
- **Demand Forecasting**: Analyzes historical sales patterns, seasonality, and trends
- **Natural Language Explanations**: Plain-English reasoning for every forecast
- **Smart Reordering**: Context-aware purchase quantity recommendations
- **Supplier Selection**: AI-driven supplier recommendations based on pricing and lead times

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Fastify (high-performance REST API)
- **Database**: Supabase (Managed PostgreSQL)
- **ORM**: Prisma
- **Queue**: BullMQ + Redis
- **AI**: OpenAI API (GPT-4 Turbo)

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Auth**: Supabase Auth

### DevOps
- **Containerization**: Docker + Docker Compose
- **Backend Deployment**: Render/Railway
- **Frontend Deployment**: Vercel
- **CI/CD**: GitHub Actions

---

## 📁 Project Structure

```
inventory-management/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, OpenAI configuration
│   │   ├── services/        # Business logic (inventory, forecast, PO, OpenAI)
│   │   ├── routes/          # API endpoints
│   │   ├── jobs/            # BullMQ workers (forecast generation, notifications)
│   │   ├── types/           # TypeScript type definitions
│   │   └── server.ts        # Fastify server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (storefront)/   # Public e-commerce pages
│   │   └── admin/          # Admin dashboard
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── admin/          # Admin-specific components
│   ├── lib/                # Utility functions, Supabase client
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── scripts/
│   └── seed-database.ts    # Sample data generation
│
├── docker-compose.yml
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20 or higher ([Download](https://nodejs.org/))
- **pnpm**: Package manager ([Install](https://pnpm.io/installation))
- **Docker**: For containerized services ([Download](https://www.docker.com/))
- **Git**: Version control ([Download](https://git-scm.com/))

### External Services

You'll need accounts for:

1. **Supabase** (Database & Auth): [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note your `Project URL` and `anon/public key`
   - Get the `service_role key` from Project Settings → API

2. **OpenAI** (AI Forecasting): [https://platform.openai.com](https://platform.openai.com)
   - Create an API key
   - Ensure you have GPT-4 Turbo access

3. **Redis Cloud** (Optional for production): [https://redis.com/try-free](https://redis.com/try-free)
   - Or use local Redis via Docker

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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

For questions or issues:

- **GitHub Issues**: [Open an issue](https://github.com/your-username/inventory-predictor/issues)
- **Email**: support@yourcompany.com
- **Documentation**: Check the `/docs` folder for detailed guides

---

## 🙏 Acknowledgments

- [Vercel Commerce](https://github.com/vercel/commerce) for the e-commerce template
- [OpenAI](https://openai.com/) for GPT-4 AI capabilities
- [Supabase](https://supabase.com/) for the excellent PostgreSQL backend
- The open-source community for amazing tools and libraries

---

**Built with ❤️ for the Indian E-Commerce Market**
