# Deployment Guide

## 🚀 Professional E-commerce Inventory Management System

This guide will help you deploy the complete inventory management system with AI forecasting to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway account (for backend)
- Supabase account (for database)

## 🗄️ Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down your `Project URL` and `anon public key`

2. **Run Database Schema**
   ```sql
   -- Copy and run the entire database-schema.sql file in Supabase SQL editor
   ```

3. **Insert Sample Data**
   ```sql
   -- Run the sample data inserts from database-schema.sql
   ```

## 🔧 Backend Deployment (Railway)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Complete inventory management system with order approval"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Add environment variables:
     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_SERVICE_KEY=your_supabase_anon_key
     JWT_SECRET=your-super-secret-jwt-key-min-32-chars
     PORT=4000
     NODE_ENV=production
     CORS_ORIGIN=https://your-vercel-app.vercel.app
     ```

3. **Configure Railway**
   - Set start command: `npm start`
   - Set health check path: `/health`
   - Note down your Railway app URL

## 🌐 Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
     ```

2. **Configure Domain**
   - Set up custom domain (optional)
   - Update CORS_ORIGIN in Railway with your Vercel URL

## ✅ Post-Deployment Checklist

### Backend Health Check
```bash
curl https://your-railway-app.railway.app/health
```
Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-12-05T...",
  "database": "configured",
  "environment": "production"
}
```

### Test API Endpoints
```bash
# Test inventory stats
curl https://your-railway-app.railway.app/api/inventory/stats

# Test products
curl https://your-railway-app.railway.app/api/products

# Test orders
curl https://your-railway-app.railway.app/api/orders/admin/all
```

### Frontend Verification
1. Visit your Vercel URL
2. Check admin dashboard: `/admin`
3. Test all tabs: Dashboard, Products, Inventory, Orders, AI Forecasting
4. Verify real data loading from Supabase

## 🔐 Security Configuration

### Environment Variables
- **Never commit** `.env` files to GitHub
- Use strong JWT secrets (32+ characters)
- Rotate API keys regularly

### CORS Configuration
- Set specific origins, avoid wildcards in production
- Update CORS_ORIGIN when changing domains

### Database Security
- Use Row Level Security (RLS) in Supabase
- Create proper user roles and permissions
- Enable API rate limiting

## 📊 Features Deployed

### ✅ Admin Dashboard
- **Real-time Inventory**: Live stock levels and values
- **Order Management**: Approve/reject orders with inventory updates
- **AI Forecasting**: 30/60/90 day predictions with Indian market intelligence
- **Product Management**: Add, edit, update products
- **Analytics**: Comprehensive business insights

### ✅ Order System
- **Customer Orders**: Place orders from frontend
- **Admin Approval**: Review and approve orders
- **Inventory Updates**: Automatic stock reduction on approval
- **Status Tracking**: Real-time order status updates

### ✅ AI Features
- **Demand Forecasting**: Seasonal and festival-based predictions
- **Product Recommendations**: AI-suggested products for Indian market
- **Market Intelligence**: Economic trends and consumer behavior
- **Inventory Optimization**: Smart restock recommendations

## 🎯 Production URLs

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Admin Dashboard**: `https://your-app.vercel.app/admin`
- **Backend API**: `https://your-backend.railway.app`
- **Database**: Supabase hosted PostgreSQL

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ORIGIN in Railway environment
   - Ensure it matches your Vercel URL exactly

2. **Database Connection**
   - Verify Supabase URL and key in Railway
   - Check database schema is properly created

3. **Build Failures**
   - Check TypeScript errors in Railway logs
   - Ensure all dependencies are in package.json

4. **API Not Loading**
   - Verify NEXT_PUBLIC_API_URL in Vercel
   - Check Railway app is running with `/health` endpoint

### Support
- Check Railway logs for backend issues
- Check Vercel function logs for frontend issues
- Monitor Supabase dashboard for database performance

## 🎉 Success!

Your professional e-commerce inventory management system is now live with:
- ✅ Real-time inventory tracking
- ✅ AI-powered forecasting
- ✅ Order management with approval workflow
- ✅ Indian market intelligence
- ✅ Professional admin dashboard
- ✅ Scalable cloud infrastructure

**Admin Dashboard**: `https://your-app.vercel.app/admin`
