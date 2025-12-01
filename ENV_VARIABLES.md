# Environment Variables Reference

Complete guide to all environment variables needed for InventoryPredictor.

---

## Backend Environment Variables

Copy this to `backend/.env`:

```bash
# ============================================
# DATABASE (Supabase PostgreSQL)
# ============================================
# Get from: Supabase Project Settings → Database → Connection String
# Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres

# Supabase Project URL
# Get from: Supabase Project Settings → API → Project URL
SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co

# Supabase Service Role Key (KEEP SECRET!)
# Get from: Supabase Project Settings → API → service_role (secret)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# REDIS (Job Queue)
# ============================================
# Development: Use local Redis via Docker
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Production: Use Redis Cloud or similar
# REDIS_HOST=redis-12345.c1.us-east-1-1.ec2.cloud.redislabs.com
# REDIS_PORT=12345
# REDIS_PASSWORD=your_redis_password

# Alternative: Full Redis URL (overwrites above)
# REDIS_URL=redis://default:password@host:port

# ============================================
# OPENAI API
# ============================================
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Set organization ID if you're part of multiple orgs
# OPENAI_ORG_ID=org-xxxxxxxxxxxxx

# ============================================
# SERVER CONFIG
# ============================================
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# Options: development, production, test
# NODE_ENV=production

# ============================================
# AUTHENTICATION & SECURITY
# ============================================
# Generate with: openssl rand -base64 32
JWT_SECRET=change-this-to-a-random-string-in-production

# CORS allowed origins (comma-separated for multiple)
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# ============================================
# PAYMENT GATEWAYS (Optional)
# ============================================
# Razorpay: Get from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# ============================================
# EMAIL (Optional - for PO sending)
# ============================================
# Gmail SMTP (use app password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SendGrid (Alternative)
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
# SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# ============================================
# ERROR TRACKING (Optional)
# ============================================
# Sentry: Get from https://sentry.io/settings/projects/
SENTRY_DSN=https://xxxxxxxxxxxxx@o000000.ingest.sentry.io/0000000

# ============================================
# LOGGING
# ============================================
# Options: trace, debug, info, warn, error, fatal
LOG_LEVEL=info

# ============================================
# RATE LIMITING
# ============================================
# Maximum requests per time window
RATE_LIMIT_MAX=100

# Time window in minutes
RATE_LIMIT_WINDOW=15

# ============================================
# FORECAST CONFIGURATION
# ============================================
# Default forecast horizon (days)
DEFAULT_FORECAST_HORIZON=30

# Maximum SKUs per batch forecast request
MAX_BATCH_FORECAST_SIZE=50

# ============================================
# WORKER CONFIGURATION
# ============================================
# Number of concurrent forecast jobs
FORECAST_WORKER_CONCURRENCY=3

# Forecast job retry attempts
FORECAST_JOB_ATTEMPTS=3

# ============================================
# TESTING (Optional)
# ============================================
# Separate database for tests
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/inventory_test

# Use mock OpenAI in tests (true/false)
MOCK_OPENAI=false
```

---

## Frontend Environment Variables

Copy this to `frontend/.env.local`:

```bash
# ============================================
# SUPABASE (Database & Auth)
# ============================================
# Get from: Supabase Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# BACKEND API
# ============================================
# Development
NEXT_PUBLIC_API_URL=http://localhost:4000

# Production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# ============================================
# PAYMENT GATEWAYS
# ============================================
# Razorpay (Public Key - safe to expose)
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxxx

# ============================================
# ANALYTICS (Optional)
# ============================================
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics (auto-enabled on Vercel)
# No config needed

# ============================================
# FEATURE FLAGS (Optional)
# ============================================
# Enable/disable features
NEXT_PUBLIC_ENABLE_FORECASTING=true
NEXT_PUBLIC_ENABLE_PO_GENERATION=true
NEXT_PUBLIC_ENABLE_MULTI_WAREHOUSE=false

# ============================================
# BRANDING (Optional)
# ============================================
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourcompany.com
```

---

## Docker Compose Environment

Copy this to `.env` in project root (for docker-compose.yml):

```bash
# These will be passed to containers via docker-compose.yml
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

OPENAI_API_KEY=sk-proj-xxxxx

JWT_SECRET=your-secret-key

# Redis is managed by Docker Compose
# No need to set REDIS_HOST, handled by service name
```

---

## Environment Setup by Deployment Platform

### Vercel (Frontend)

In Vercel Dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxx (for production)
```

### Render (Backend)

In Render Dashboard → Service → Environment:

```
DATABASE_URL (Secret)
SUPABASE_URL
SUPABASE_SERVICE_KEY (Secret)
REDIS_URL (Auto-generated from Redis service)
OPENAI_API_KEY (Secret)
JWT_SECRET (Secret)
NODE_ENV=production
PORT=4000
```

### Railway (Backend Alternative)

Railway automatically exposes service URLs as environment variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
OPENAI_API_KEY=[Add manually as secret]
```

---

## Security Best Practices

### ✅ DO:
- Use `.env` files locally (already in .gitignore)
- Use platform-specific secret managers in production
- Rotate secrets regularly (especially JWT_SECRET, API keys)
- Use service role keys only in backend (never frontend)
- Enable Supabase RLS policies

### ❌ DON'T:
- Commit `.env` files to Git
- Share service_role keys publicly
- Use development keys in production
- Store secrets in frontend code
- Use same DATABASE_URL for dev/prod

---

## How to Get Each Credential

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create project → Wait ~2 minutes
3. Go to Project Settings → API
4. Copy: URL, anon key, service_role key
5. Go to Database → Connection String → URI
6. Copy connection string

### OpenAI
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name it (e.g., "inventory-predictor-prod")
4. Copy key immediately (shown only once!)
5. Verify you have GPT-4 access in Playground

### Razorpay
1. Sign up at [razorpay.com](https://razorpay.com)
2. Complete KYC for live mode
3. Go to Dashboard → Settings → API Keys
4. Test Mode: Use `rzp_test_...`
5. Live Mode: Generate live keys after KYC

### Redis Cloud (Production)
1. Go to [redis.com/try-free](https://redis.com/try-free)
2. Create free database
3. Copy connection URL
4. Format: `redis://default:password@host:port`

### Gmail SMTP (For emails)
1. Enable 2-Factor Authentication
2. Go to Google Account → Security
3. App Passwords → Generate new
4. Use generated password in `SMTP_PASSWORD`

---

## Validation Script

Create `backend/scripts/validate-env.ts`:

```typescript
import dotenv from 'dotenv';
dotenv.config();

const required = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'OPENAI_API_KEY',
  'JWT_SECRET',
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

Run: `tsx backend/scripts/validate-env.ts`

---

## Quick Reference

| Variable | Required | Location | Secret |
|----------|----------|----------|--------|
| `DATABASE_URL` | ✅ | Backend | ✅ |
| `SUPABASE_URL` | ✅ | Both | ❌ |
| `SUPABASE_SERVICE_KEY` | ✅ | Backend | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Frontend | ❌ |
| `OPENAI_API_KEY` | ✅ | Backend | ✅ |
| `JWT_SECRET` | ✅ | Backend | ✅ |
| `REDIS_HOST` | ✅ | Backend | ❌ |
| `RAZORPAY_KEY_ID` | ❌ | Backend | ✅ |
| `SMTP_PASSWORD` | ❌ | Backend | ✅ |

**Note**: Variables starting with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets there!

---

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` format
- Verify Supabase project is active
- Check IP allowlist in Supabase (disable if testing)

### "OpenAI API error: 401"
- Verify API key is correct
- Check you have credits in OpenAI account
- Confirm key has GPT-4 access

### "Redis connection failed"
- Check Redis is running: `docker ps | grep redis`
- Verify `REDIS_HOST` and `REDIS_PORT`
- Check firewall rules (production)

### "CORS error"
- Add frontend URL to `CORS_ORIGIN`
- Check `NEXT_PUBLIC_API_URL` matches backend URL
