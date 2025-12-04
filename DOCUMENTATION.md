# InventoryPredictor - AI-Powered E-Commerce Platform

## Complete Project Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Pages](#frontend-pages)
8. [AI Forecasting System](#ai-forecasting-system)
9. [Setup & Installation](#setup--installation)
10. [Deployment Guide](#deployment-guide)

---

## Project Overview

**InventoryPredictor** is a full-stack e-commerce platform similar to Amazon/Flipkart with an integrated AI-powered inventory management system. The platform enables:

- **Customers**: Browse products, add to cart, place orders, manage profiles
- **Admins**: Monitor inventory, view AI-generated demand forecasts, manage orders
- **AI System**: Predicts product demand 30-90 days ahead using Groq LLM

### Key Features

| Feature | Description |
|---------|-------------|
| Product Catalog | Browse products by categories with search & filters |
| User Authentication | Email/password signup and login via Supabase Auth |
| Shopping Cart | Add/remove items, persistent cart |
| Order Management | Place orders, track status, order history |
| Inventory Dashboard | Real-time stock levels, low-stock alerts |
| AI Forecasting | 30/60/90 day demand predictions using Groq |
| Sales Analytics | Revenue tracking, order statistics |

---

## Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React Framework (App Router) | 14.x |
| React | UI Library | 18.x |
| TailwindCSS | Styling | 3.x |
| Lucide React | Icons | Latest |
| Supabase JS | Database Client | 2.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ |
| Fastify | Web Framework | 4.x |
| TypeScript | Type Safety | 5.x |
| Supabase | Database & Auth | - |
| Groq SDK | AI/LLM Integration | 0.5.x |

### Database
| Technology | Purpose |
|------------|---------|
| Supabase (PostgreSQL) | Primary Database |
| Row Level Security (RLS) | Data Protection |

### AI/ML
| Technology | Purpose |
|------------|---------|
| Groq | LLM API Provider |
| LLaMA 3.1 70B | AI Model for Predictions |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (Next.js + React)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Homepage │  │ Products │  │  Admin   │  │ Profile  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                    (Fastify + TypeScript)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   Auth   │  │ Products │  │  Orders  │  │ Forecast │        │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                          │                                       │
│  ┌───────────────────────┴───────────────────────┐              │
│  │              Services Layer                    │              │
│  │  ┌─────────────────┐  ┌─────────────────┐     │              │
│  │  │ Inventory Svc   │  │    AI Service   │     │              │
│  │  └─────────────────┘  └─────────────────┘     │              │
│  └───────────────────────────────────────────────┘              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌──────────────────┐           ┌──────────────────┐
│     SUPABASE     │           │      GROQ        │
│   (PostgreSQL)   │           │   (LLaMA 3.1)    │
│                  │           │                  │
│  - profiles      │           │  - Demand        │
│  - products      │           │    Forecasting   │
│  - orders        │           │  - Reorder       │
│  - categories    │           │    Recommendations│
│  - analytics     │           │                  │
└──────────────────┘           └──────────────────┘
```

---

## Project Structure

```
inventory-management/
├── frontend/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router Pages
│   │   │   ├── homepage/       # Landing Page
│   │   │   ├── product-listing/# Products Grid
│   │   │   ├── product-detail/ # Single Product
│   │   │   ├── cart/           # Shopping Cart
│   │   │   ├── checkout/       # Checkout Flow
│   │   │   ├── login/          # Auth Page
│   │   │   ├── profile/        # User Profile
│   │   │   ├── admin/          # Admin Dashboard
│   │   │   └── order-confirmation/
│   │   ├── components/         # Reusable Components
│   │   │   ├── common/         # Header, Footer
│   │   │   └── ui/             # UI Components
│   │   ├── contexts/           # React Contexts
│   │   │   ├── AuthContext.jsx # Auth State
│   │   │   ├── CartContext.jsx # Cart State
│   │   │   └── ThemeContext.jsx# Theme State
│   │   └── lib/
│   │       └── supabase.js     # Supabase Client & Helpers
│   ├── supabase/
│   │   ├── schema.sql          # Database Schema
│   │   └── seed.sql            # Sample Data
│   └── package.json
│
├── backend/                     # Fastify Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts     # Supabase Client
│   │   │   └── groq.ts         # Groq AI Client
│   │   ├── routes/
│   │   │   ├── auth.route.ts   # Authentication
│   │   │   ├── products.route.ts# Product CRUD
│   │   │   ├── orders.route.ts # Order Management
│   │   │   ├── inventory.route.ts# Stock Management
│   │   │   └── forecast.route.ts # AI Predictions
│   │   ├── services/
│   │   │   ├── inventory.service.ts
│   │   │   └── ai.service.ts   # Groq Integration
│   │   └── server.ts           # Entry Point
│   ├── package.json
│   └── tsconfig.json
│
└── DOCUMENTATION.md            # This File
```

---

## Database Schema

### Tables Overview

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `categories` | Product categories |
| `products` | Product catalog |
| `cart_items` | Shopping cart |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `sales_analytics` | Daily sales data |
| `inventory_predictions` | AI forecasts |

### Entity Relationship

```
profiles (1) ──────< (N) orders
    │                    │
    │                    └──< (N) order_items >── (1) products
    │                                                   │
    └──────< (N) cart_items >────────────────────────────┘
                                                        │
categories (1) ────────────────────────< (N) products ──┘
                                              │
                    sales_analytics >─────────┘
                                              │
                inventory_predictions >───────┘
```

### Key Fields

**products**
- `id`, `name`, `slug`, `description`
- `price`, `original_price` (for discounts)
- `stock_quantity`, `reorder_level`
- `category_id`, `brand`
- `thumbnail`, `images[]`
- `rating`, `review_count`
- `is_active`, `is_featured`

**orders**
- `id`, `order_number`, `user_id`
- `status`: pending | confirmed | shipped | delivered | cancelled
- `subtotal`, `total`
- `shipping_address` (JSONB)

---

## API Documentation

### Base URL
```
Development: http://localhost:4000/api
```

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/profile` | Update profile |

### Product Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| GET | `/products/:id` | Get product by ID |
| GET | `/products/categories/all` | List categories |
| POST | `/products` | Create product (admin) |
| PUT | `/products/:id` | Update product |
| PATCH | `/products/:id/stock` | Update stock |

### Order Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders/:id` | Get order details |
| GET | `/orders/user/:userId` | Get user's orders |
| PATCH | `/orders/:id/status` | Update status |

### Inventory Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inventory` | List inventory |
| GET | `/inventory/stats` | Get stats summary |
| GET | `/inventory/alerts/low-stock` | Low stock items |
| GET | `/inventory/:id` | Get product inventory |
| PUT | `/inventory/:id/stock` | Update stock |

### AI Forecast Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/forecast/generate` | Generate AI forecast |
| GET | `/forecast/recommendations` | Get reorder recommendations |
| GET | `/forecast/analytics` | Get sales analytics |
| GET | `/forecast/predictions` | Get prediction history |

---

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/homepage` | Home | Hero, featured products, categories |
| `/product-listing` | Products | Grid with filters & search |
| `/product-detail/[id]` | Product | Full product details |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Address & payment |
| `/login` | Auth | Login/Signup |
| `/profile` | Profile | User details & orders |
| `/admin` | Dashboard | Inventory & AI predictions |
| `/order-confirmation` | Orders | Order tracking |

---

## AI Forecasting System

### How It Works

1. **Data Collection**: Sales analytics and product data from Supabase
2. **AI Processing**: Groq's LLaMA 3.1 70B analyzes patterns
3. **Prediction Output**: Demand forecasts for 30/60/90 days
4. **Recommendations**: Reorder quantities and urgency levels

### Forecast Request
```json
POST /api/forecast/generate
{
  "horizon_days": 30  // 30, 60, or 90
}
```

### Forecast Response
```json
{
  "forecast": {
    "forecasts": [
      {
        "product_name": "iPhone 15 Pro",
        "predicted_demand": 45,
        "restock_needed": true,
        "urgency": "medium"
      }
    ],
    "summary": "30-day forecast for 19 products",
    "recommendations": [
      "Review low-stock items immediately",
      "Consider bulk ordering for high-demand products"
    ]
  },
  "generated_at": "2024-12-04T11:00:00Z"
}
```

### Recommendation Urgency Levels
- **high**: Stock < 5 units
- **medium**: Stock < 10 units
- **low**: Stock adequate

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Groq API key

### 1. Clone Repository
```bash
git clone <repository-url>
cd inventory-management
```

### 2. Setup Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Go to SQL Editor
4. Run `frontend/supabase/schema.sql`
5. Run `frontend/supabase/seed.sql`

### 3. Configure Environment

**Frontend** - Update `frontend/src/lib/supabase.js`:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

**Backend** - Update `backend/src/config/database.ts`:
```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseServiceKey = 'YOUR_SERVICE_KEY';
```

**Backend** - Update `backend/src/config/groq.ts`:
```typescript
const apiKey = 'YOUR_GROQ_API_KEY';
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Runs on http://localhost:4000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## Deployment Guide

### Backend (Node.js Hosting)
Options: Railway, Render, Fly.io, DigitalOcean

```bash
cd backend
npm run build
npm start
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy .next folder
```

### Environment Variables (Production)

**Backend:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `GROQ_API_KEY`
- `JWT_SECRET`
- `CORS_ORIGIN`

**Frontend:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`

---

## Workflow Summary

### Customer Journey
```
Browse Products → Add to Cart → Login/Signup → Checkout → Order Confirmation
```

### Admin Workflow
```
View Dashboard → Check Low Stock → Generate AI Forecast → Review Recommendations → Update Inventory
```

### Data Flow
```
Frontend (React) 
    ↓ API Calls
Backend (Fastify)
    ↓ Queries
Supabase (PostgreSQL)
    ↓ Data
AI Service (Groq)
    ↓ Predictions
Admin Dashboard
```

---

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Security Features

1. **Authentication**: Supabase Auth with JWT
2. **Row Level Security**: Database-level access control
3. **Rate Limiting**: Fastify rate limiter
4. **CORS**: Configured for frontend origin
5. **Helmet**: Security headers
6. **Input Validation**: Zod schemas

---

## Support

For issues or questions, please create a GitHub issue.

**Last Updated**: December 2024
