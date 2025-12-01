# ✅ InventoryPredictor - Deployment Checklist

Use this checklist to ensure everything is configured correctly before deploying to production.

---

## 🔧 Pre-Deployment Setup

### External Services Setup

- [ ] **Supabase Account**
  - [ ] Project created
  - [ ] Database connection string copied
  - [ ] `anon` key copied
  - [ ] `service_role` key copied (KEEP SECRET!)
  - [ ] IP allowlist configured (or disabled for testing)

- [ ] **OpenAI Account**
  - [ ] API key generated
  - [ ] GPT-4 access verified
  - [ ] Billing configured
  - [ ] Usage limits set

- [ ] **Redis**
  - [ ] Local Redis running (development)
  - [ ] Redis Cloud account (production)
  - [ ] Connection URL noted

- [ ] **Razorpay** (Optional)
  - [ ] Account created
  - [ ] Test keys obtained
  - [ ] KYC completed (for live mode)

- [ ] **GitHub Repository**
  - [ ] Repository created
  - [ ] Code pushed to main branch

---

## 📝 Configuration Files

### Backend

- [ ] `backend/.env` created (from `.env.example`)
- [ ] All required variables set:
  - [ ] `DATABASE_URL`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `OPENAI_API_KEY`
  - [ ] `JWT_SECRET` (use `openssl rand -base64 32`)
  - [ ] `REDIS_HOST` and `REDIS_PORT`
- [ ] Optional variables configured:
  - [ ] `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
  - [ ] `SMTP_*` for email
  - [ ] `SENTRY_DSN` for error tracking

### Frontend

- [ ] `frontend/.env.local` created (from `.env.local.example`)
- [ ] Required variables set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_API_URL`
- [ ] Optional variables:
  - [ ] `NEXT_PUBLIC_RAZORPAY_KEY`
  - [ ] `NEXT_PUBLIC_GA_ID`

---

## 🗄️ Database Setup

- [ ] **Schema Deployment**
  - [ ] Prisma schema reviewed
  - [ ] Migration file reviewed (`supabase/migrations/001_initial_schema.sql`)
  - [ ] Schema pushed to Supabase:
    ```bash
    cd backend
    pnpm prisma db push
    ```
  - [ ] Prisma Client generated:
    ```bash
    pnpm prisma generate
    ```

- [ ] **Database Verification**
  - [ ] Open Supabase Dashboard → Table Editor
  - [ ] Verify all 11 tables exist:
    - [ ] `products`
    - [ ] `variants`
    - [ ] `inventory`
    - [ ] `sales`
    - [ ] `forecasts`
    - [ ] `suppliers`
    - [ ] `supplier_prices`
    - [ ] `purchase_orders`
    - [ ] `inventory_audit_log`
    - [ ] `admin_settings`
  - [ ] Check indexes are created
  - [ ] Verify RLS policies are enabled

- [ ] **Sample Data** (Optional for testing)
  - [ ] Seed script executed:
    ```bash
    tsx ../scripts/seed-database.ts
    ```
  - [ ] Verify products exist in Supabase

---

## 🚀 Local Development Testing

### Backend Tests

- [ ] Dependencies installed:
  ```bash
  cd backend && pnpm install
  ```

- [ ] Server starts successfully:
  ```bash
  pnpm dev
  ```

- [ ] Health check passes:
  ```bash
  curl http://localhost:4000/health
  ```

- [ ] Test product endpoint:
  ```bash
  curl http://localhost:4000/api/products
  ```

- [ ] Test inventory endpoint:
  ```bash
  curl http://localhost:4000/api/inventory
  ```

- [ ] Test forecast generation:
  ```bash
  curl -X POST http://localhost:4000/api/forecast/generate \
    -H "Content-Type: application/json" \
    -d '{"skus": ["TEE-BLK-M-001"], "horizon_days": 30}'
  ```

### Worker Tests

- [ ] Forecast worker starts:
  ```bash
  pnpm worker:forecast
  ```

- [ ] Worker connects to Redis
- [ ] Worker processes test forecast job

### Frontend Tests

- [ ] Dependencies installed:
  ```bash
  cd frontend && pnpm install
  ```

- [ ] Development server starts:
  ```bash
  pnpm dev
  ```

- [ ] Frontend accessible at `http://localhost:3000`
- [ ] No console errors
- [ ] Supabase client connects successfully

---

## 🐳 Docker Testing

- [ ] Docker Desktop installed and running

- [ ] Docker Compose builds successfully:
  ```bash
  docker-compose build
  ```

- [ ] Services start:
  ```bash
  docker-compose up -d
  ```

- [ ] Check service health:
  ```bash
  docker-compose ps
  ```

- [ ] Backend container healthy
- [ ] Redis container healthy
- [ ] Worker container healthy

- [ ] Test API through Docker:
  ```bash
  curl http://localhost:4000/health
  ```

---

## 📊 Feature Validation

### Inventory Management

- [ ] Get inventory by SKU works
- [ ] AI recommendations appear in response
- [ ] Update inventory works
- [ ] Low stock alerts work

### Forecasting

- [ ] Forecast generation completes (may take 30-60 seconds)
- [ ] Forecast retrieved successfully
- [ ] AI explanation is present and readable
- [ ] Predictions array has correct length (30/60/90 days)

### Purchase Orders

- [ ] Draft PO generation works
- [ ] AI reasoning is included
- [ ] Email draft is professional
- [ ] Line items calculated correctly
- [ ] PO approval workflow functions

### Suppliers

- [ ] Supplier creation works
- [ ] Price list management works
- [ ] Supplier retrieval includes prices

---

## 🚢 Production Deployment

### Backend Deployment (Render/Railway)

- [ ] **Render Setup**
  - [ ] Account created
  - [ ] New Web Service created
  - [ ] GitHub repo connected
  - [ ] Environment variables added
  - [ ] Redis service created and linked
  - [ ] Worker service created
  - [ ] Health check endpoint configured (`/health`)

- [ ] **Render Verification**
  - [ ] Build completes successfully
  - [ ] Service shows "Live" status
  - [ ] Health check passes
  - [ ] Logs show no errors
  - [ ] Test API call works:
    ```bash
    curl https://your-app.onrender.com/health
    ```

### Frontend Deployment (Vercel)

- [ ] **Vercel Setup**
  - [ ] Account created/logged in
  - [ ] Project imported from GitHub
  - [ ] Root directory set to `frontend`
  - [ ] Framework preset: Next.js
  - [ ] Environment variables added:
    - [ ] `NEXT_PUBLIC_SUPABASE_URL`
    - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - [ ] `NEXT_PUBLIC_API_URL` (Render backend URL)

- [ ] **Vercel Verification**
  - [ ] Build succeeds
  - [ ] Site is live
  - [ ] No deployment errors
  - [ ] Frontend loads correctly
  - [ ] API calls to backend work

### DNS & Domain (Optional)

- [ ] Custom domain purchased
- [ ] DNS records configured:
  - [ ] A/CNAME record for frontend → Vercel
  - [ ] A/CNAME record for `api.` → Render
- [ ] SSL certificates provisioned (automatic on Vercel/Render)
- [ ] Test with custom domains

---

## 🔒 Security Checklist

- [ ] **Environment Variables**
  - [ ] All secrets are kept secret (not in git)
  - [ ] Production uses different keys than development
  - [ ] `JWT_SECRET` is strong and unique
  - [ ] `SUPABASE_SERVICE_KEY` never exposed to frontend

- [ ] **Database Security**
  - [ ] RLS policies enabled on sensitive tables
  - [ ] Only admin users can modify inventory
  - [ ] Public can only read active products
  - [ ] Connection uses SSL

- [ ] **API Security**
  - [ ] Rate limiting enabled
  - [ ] CORS configured correctly
  - [ ] Helmet middleware active
  - [ ] JWT authentication for admin routes

- [ ] **Error Handling**
  - [ ] Errors don't leak sensitive info
  - [ ] Sentry configured for error tracking
  - [ ] Logs don't contain secrets

---

## 📈 Monitoring Setup

- [ ] **Error Tracking**
  - [ ] Sentry account created
  - [ ] `SENTRY_DSN` configured
  - [ ] Test error sent to verify

- [ ] **Performance**
  - [ ] Vercel Analytics enabled (automatic)
  - [ ] Render metrics dashboard reviewed

- [ ] **Uptime Monitoring** (Optional)
  - [ ] UptimeRobot account created
  - [ ] Health check monitor configured
  - [ ] Alert email set up

---

## 🧪 Post-Deployment Testing

### Smoke Tests

- [ ] Home page loads
- [ ] Product listing works
- [ ] Admin dashboard accessible (after building it)
- [ ] API health check responds
- [ ] OpenAI integration works (generate test forecast)

### End-to-End Scenarios

- [ ] **Scenario 1: View Low Stock**
  1. [ ] Access inventory endpoint
  2. [ ] Filter for low stock items
  3. [ ] AI recommendations appear

- [ ] **Scenario 2: Generate Forecast**
  1. [ ] Call forecast generation for SKU
  2. [ ] Wait for completion
  3. [ ] Retrieve forecast
  4. [ ] Verify predictions and explanation

- [ ] **Scenario 3: Create Purchase Order**
  1. [ ] Generate draft PO for low-stock items
  2. [ ] Review AI reasoning
  3. [ ] Approve PO
  4. [ ] Mark as sent
  5. [ ] Receive and verify inventory update

---

## 📊 Performance Baseline

Record these metrics for comparison:

- [ ] API response time (P95): ______ ms
- [ ] Forecast generation time: ______ seconds
- [ ] Database query time: ______ ms
- [ ] Memory usage (backend): ______ MB
- [ ] OpenAI API latency: ______ seconds

---

## 📚 Documentation Review

- [ ] README.md is up to date
- [ ] API_REFERENCE.md reviewed
- [ ] SETUP.md tested by following steps
- [ ] ENV_VARIABLES.md has all variables
- [ ] ROADMAP.md reflects priorities

---

## 🎉 Go Live!

- [ ] All checklist items above completed
- [ ] Team trained on system
- [ ] Support channels ready
- [ ] Backup plan in place
- [ ] Celebrate! 🚀

---

## 🐛 Rollback Plan

If something goes wrong:

1. **Revert frontend**: Vercel Dashboard → Deployments → Previous Version → Redeploy
2. **Revert backend**: Render Dashboard → Service → Rollback to Previous Deploy
3. **Database**: Restore from Supabase backup (Settings → Database → Point-in-time Recovery)
4. **Notify users** if service was down

---

## 📞 Support Contacts

Document these before going live:

- **Supabase Support**: support@supabase.com
- **Render Support**: support@render.com
- **OpenAI Support**: help.openai.com
- **Team Lead**: __________________
- **On-Call Engineer**: __________________

---

**Last Updated**: December 2025

**Deployment Date**: __________________

**Deployed By**: __________________
