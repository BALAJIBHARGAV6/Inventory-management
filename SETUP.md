# 🚀 Quick Setup Guide

Get InventoryPredictor running in under 10 minutes!

---

## Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Docker Desktop running
- [ ] Supabase account created
- [ ] OpenAI API key obtained

---

## Step-by-Step Setup

### 1️⃣ Clone and Install (2 min)

```bash
# Clone the repository
git clone <your-repo-url>
cd inventory-management

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 2️⃣ Set Up Supabase (3 min)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for project initialization (~2 minutes)
3. Copy your project credentials:
   - Go to **Project Settings** → **API**
   - Note: `Project URL`, `anon public key`, `service_role key`

4. Run the database schema:
   ```bash
   cd backend
   
   # Option A: Push schema directly
   pnpm prisma db push
   
   # Option B: Run SQL migration manually
   # Copy content from supabase/migrations/001_initial_schema.sql
   # Paste into Supabase SQL Editor and run
   ```

### 3️⃣ Configure Environment Variables (2 min)

**Backend (`backend/.env`):**
```bash
# Copy example file
cp .env.example .env

# Edit .env and add:
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT].supabase.co:5432/postgres
SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
SUPABASE_SERVICE_KEY=[YOUR_SERVICE_ROLE_KEY]

OPENAI_API_KEY=sk-proj-[YOUR_OPENAI_KEY]

REDIS_HOST=localhost
REDIS_PORT=6379

PORT=4000
NODE_ENV=development
JWT_SECRET=change-this-to-a-random-string
```

**Frontend (`frontend/.env.local`):**
```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4️⃣ Start Services (3 min)

**Option A: Docker Compose (Recommended)**

```bash
# From project root
docker-compose up -d

# Check if services are running
docker-compose ps
```

**Option B: Manual Start**

```bash
# Terminal 1: Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# Terminal 2: Start Backend
cd backend
pnpm prisma generate
pnpm dev

# Terminal 3: Start Worker
cd backend
pnpm worker:forecast

# Terminal 4: Start Frontend
cd frontend
pnpm dev
```

### 5️⃣ Seed Sample Data (Optional, 1 min)

```bash
cd backend
tsx ../scripts/seed-database.ts
```

This creates:
- 10 products with variants
- 3 suppliers
- 180 days of historical sales data

---

## ✅ Verify Setup

### Backend Health Check

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

### Get Sample Products

```bash
curl http://localhost:4000/api/products
```

### Generate First Forecast

```bash
curl -X POST http://localhost:4000/api/forecast/generate \
  -H "Content-Type: application/json" \
  -d '{
    "skus": ["TEE-BLK-M-001"],
    "horizon_days": 30
  }'
```

### Access Frontend

Open browser: `http://localhost:3000`

---

## 🎯 Next Steps

1. **Explore the Admin Dashboard** (coming soon in frontend)
2. **Test AI Features**:
   - Generate forecasts for different SKUs
   - Create draft purchase orders
   - View AI recommendations
3. **Customize for Your Business**:
   - Add your products
   - Configure supplier information
   - Adjust reorder thresholds

---

## 🐛 Common Issues

### "Prisma Client not found"
```bash
cd backend
pnpm prisma generate
```

### "Redis connection failed"
- Ensure Docker is running
- Check if Redis container is up: `docker ps`
- Restart Redis: `docker run -d -p 6379:6379 redis:7-alpine`

### "OpenAI API Error"
- Verify your API key is correct
- Check you have GPT-4 access
- Ensure you have credits in your OpenAI account

### "Database connection error"
- Double-check DATABASE_URL in `.env`
- Ensure Supabase project is active
- Verify password and project ID are correct

### Port Already in Use
```bash
# Kill process on port 4000
npx kill-port 4000

# Kill process on port 3000
npx kill-port 3000
```

---

## 📚 Documentation

- **Full README**: [`README.md`](README.md)
- **API Reference**: [`API_REFERENCE.md`](API_REFERENCE.md)
- **Database Schema**: [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

---

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Review logs:
  - Backend: Check terminal where `pnpm dev` is running
  - Docker: `docker-compose logs -f backend`

---

**Setup complete! 🎉 Start building your AI-powered inventory system!**
