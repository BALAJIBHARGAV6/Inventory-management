# InventoryPredictor - Developer Quick Reference

## 🚀 Start Everything (3 Commands)

```bash
# Terminal 1: Backend API
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: View logs
docker-compose logs -f
```

**URLs:**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/health

---

## 📁 Project Structure

```
inventory-management/
├── backend/              # Fastify API (Port 3001)
│   ├── src/
│   │   ├── routes/       # 5 route files (35+ endpoints)
│   │   ├── services/     # 4 service classes
│   │   ├── jobs/         # BullMQ workers
│   │   └── server.ts     # Main entry point
│   ├── prisma/           # Database schema
│   └── scripts/          # Seed data
├── frontend/             # Next.js 15 (Port 3000)
│   ├── app/              # Pages (App Router)
│   │   └── admin/        # Admin dashboard
│   ├── components/       # React components
│   └── lib/              # Utilities & API client
├── supabase/             # Database migrations
├── docker-compose.yml    # Full stack setup
└── *.md                  # Documentation (7 files)
```

---

## 🔑 Environment Variables (Copy & Edit)

### Backend (`.env`)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_KEY="eyJxxx"
OPENAI_API_KEY="sk-xxx"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-random-secret"
PORT=3001
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="xxx"
```

---

## 🛠️ Common Tasks

### Database

```bash
# Migrate database
cd backend && npm run migrate

# Seed sample data (10 products, 3000+ sales)
npm run seed

# Reset database
npm run migrate:reset
```

### Testing

```bash
# Backend: Test API endpoint
curl http://localhost:3001/api/inventory

# Frontend: Check build
cd frontend && npm run build

# TypeScript check
npm run type-check
```

### Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 📡 API Quick Reference

### Inventory Endpoints

```bash
# Get all inventory
GET /api/inventory

# Get by SKU (with AI recommendations)
GET /api/inventory/:sku

# Update inventory
PUT /api/inventory/:sku
Body: { "quantity": 50, "reason": "Manual adjustment", "type": "ADJUSTMENT" }

# Get audit log
GET /api/inventory/:sku/audit
```

### Forecast Endpoints

```bash
# Generate forecast (GPT-4)
POST /api/forecasts/generate
Body: { "sku": "TSHIRT-001-M-BLK", "periodDays": 30 }

# Get forecast
GET /api/forecasts/:sku?periodDays=30

# Recent forecasts
GET /api/forecasts/recent?limit=10

# Check accuracy
GET /api/forecasts/:sku/accuracy
```

### Purchase Order Endpoints

```bash
# List POs
GET /api/purchase-orders?status=DRAFT

# Generate AI draft
POST /api/purchase-orders/generate
Body: { "supplierId": "xxx", "skus": ["TSHIRT-001", "JEANS-002"] }

# Approve PO
POST /api/purchase-orders/:id/approve

# Receive PO
POST /api/purchase-orders/:id/receive
Body: { "actualQuantities": { "TSHIRT-001": 100 }, "receivedDate": "2024-01-15" }
```

---

## 🎨 Frontend Components

### Admin Components

```tsx
// Inventory table with filters
import InventoryTable from '@/components/admin/inventory-table';
<InventoryTable />

// Demand forecast chart (Recharts)
import ForecastChart from '@/components/admin/forecast-chart';
<ForecastChart sku="TSHIRT-001-M-BLK" periodDays={30} />
```

### Customer Components

```tsx
// Indian address form
import AddressForm from '@/components/address-form';
<AddressForm 
  onSubmit={(address) => console.log(address)}
  submitLabel="Deliver Here"
/>
```

### Utilities

```tsx
// Currency formatting
import { formatPrice } from '@/lib/utils';
formatPrice(1234.56);  // "₹1,234.56"

// Address validation
import { validateAddress } from '@/lib/address';
const { valid, errors } = validateAddress(address);

// API client
import { inventoryApi } from '@/lib/api';
const inventory = await inventoryApi.getAll({ lowStock: true });
```

---

## 🐛 Debugging

### Check Services

```bash
# Backend running?
curl http://localhost:3001/health

# Frontend running?
curl http://localhost:3000

# PostgreSQL connected?
docker-compose exec postgres psql -U postgres -d inventory -c "SELECT COUNT(*) FROM products;"

# Redis connected?
docker-compose exec redis redis-cli PING
```

### View Logs

```bash
# Backend logs
cd backend && npm run dev | grep ERROR

# Docker logs
docker-compose logs -f --tail=100

# Database logs
docker-compose logs postgres
```

### Common Errors

**Port already in use:**
```bash
# Kill process on port 3001
npx kill-port 3001

# Kill process on port 3000
npx kill-port 3000
```

**Database connection failed:**
```bash
# Check DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
docker-compose exec postgres psql -U postgres
```

**OpenAI API error:**
```bash
# Check API key
echo $OPENAI_API_KEY

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## 📊 Sample Data

### 10 Products Created by Seed Script

1. **T-Shirts** (5 variants: S-XXL in Black/White)
2. **Jeans** (6 variants: 28-38 in Blue/Black)
3. **Jackets** (4 variants: M-XL in Black/Navy)
4. **Sneakers** (5 variants: 7-11 in White/Black)
5. **Hoodies** (5 variants: S-XXL in Grey/Black)
6. **Shorts** (4 variants: S-XL in Khaki/Navy)
7. **Caps** (2 variants: One Size in Black/Red)
8. **Socks** (2 variants: One Size in White/Black)
9. **Backpacks** (2 variants: One Size in Black/Grey)
10. **Watches** (2 variants: One Size in Silver/Gold)

**Total Variants**: 30+  
**Total Sales Records**: 3000+ (180 days)  
**Suppliers**: 3 (Textile Mills, Denim Co, Fashion Fabrics)

---

## 🧪 Testing Workflow

### 1. Test Backend API

```bash
# Health check
curl http://localhost:3001/health

# Get inventory
curl http://localhost:3001/api/inventory | jq

# Generate forecast
curl -X POST http://localhost:3001/api/forecasts/generate \
  -H "Content-Type: application/json" \
  -d '{"sku":"TSHIRT-001-M-BLK","periodDays":30}' | jq
```

### 2. Test Admin Dashboard

```
1. Visit http://localhost:3000/admin
2. Click "Inventory" → Should show inventory table
3. Click filter "Low Stock" → Should filter items
4. Click "View Details" on any item → Should show AI recommendation
```

### 3. Test E-commerce Flow

```
1. Visit http://localhost:3000
2. Browse products
3. Add to cart
4. Go to checkout
5. Fill Indian address form
6. Test Razorpay (test mode)
```

---

## 🚀 Deployment Commands

### Backend (Render/Railway)

```bash
# Build
npm run build

# Start production
npm start

# Check deployment
curl https://your-app.onrender.com/health
```

### Frontend (Vercel)

```bash
# Deploy to Vercel
npx vercel --prod

# Or push to GitHub (auto-deploy)
git push origin main
```

### Database (Supabase)

```bash
# Run migrations on production
npx prisma migrate deploy

# Seed production data
npm run seed
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project overview (500+ lines) |
| `SETUP.md` | Quick start guide (10 minutes) |
| `API_REFERENCE.md` | All 35+ endpoints documented |
| `ENV_VARIABLES.md` | Environment variable guide |
| `DEPLOYMENT_CHECKLIST.md` | Production deployment steps |
| `ROADMAP.md` | Future development phases |
| `COMPLETE_SUMMARY.md` | Full implementation summary |
| `FRONTEND_SUMMARY.md` | Frontend component guide |

---

## 🎯 What's Missing (For MVP)

Priority tasks to launch:

1. [ ] **Authentication**: Supabase Auth integration (1 day)
2. [ ] **Payments**: Razorpay webhook + order confirmation (1 day)
3. [ ] **Forecast Page**: Admin forecasting UI (0.5 day)
4. [ ] **PO Pages**: List, create, view PO flows (1 day)
5. [ ] **Storefront**: Product listing + cart pages (2 days)
6. [ ] **Testing**: Unit + E2E tests (2 days)

**Total to MVP**: ~7-8 days

---

## 💡 Pro Tips

1. **Use Docker Compose**: Easiest way to run full stack
2. **Check `.env` files**: Most errors are missing env vars
3. **Read API_REFERENCE.md**: All endpoints documented with examples
4. **Use `--legacy-peer-deps`**: For npm installs in frontend
5. **OpenAI costs**: ~$0.01 per forecast (use caching in prod)
6. **Seed database first**: Most demo features need sample data
7. **Check TypeScript**: Run `npm run type-check` before committing

---

## 📞 Getting Help

**Stuck?** Check these in order:

1. This quick reference card
2. `README.md` for architecture
3. `SETUP.md` for installation
4. `API_REFERENCE.md` for endpoints
5. GitHub issues
6. Email: admin@inventorypredictor.com

---

## ⚡ Most Used Commands

```bash
# Start everything
docker-compose up -d

# Backend dev
cd backend && npm run dev

# Frontend dev
cd frontend && npm run dev

# View logs
docker-compose logs -f

# Reset database
cd backend && npm run migrate:reset && npm run seed

# Test API
curl http://localhost:3001/api/inventory | jq

# Deploy
git push origin main  # Auto-deploys on Vercel
```

---

**Bookmark this file for daily development!**

Last updated: 2024-01-15
