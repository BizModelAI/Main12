# 🚀 Vercel Deployment Guide for BizModelAI

## Pre-Deployment Checklist ✅

### 1. **Environment Variables Setup**
Copy these to your Vercel Dashboard → Project Settings → Environment Variables:

```env
# Required
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
FRONTEND_URL=https://your-domain.vercel.app

# Optional but recommended
OPENAI_API_KEY=sk-your-openai-api-key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
RESEND_API_KEY=your_resend_api_key

# Client-side variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 2. **Build Configuration**
- ✅ `vercel.json` configured for Node.js 20.x
- ✅ Frontend builds to `client/dist`
- ✅ API routes in `/api` directory
- ✅ Proper memory allocation for AI routes

### 3. **Database Setup**
- ✅ Prisma schema ready
- ✅ Neon PostgreSQL recommended
- ✅ Auto-expiration for quiz data implemented

## Deployment Steps

### 1. **Connect Repository**
```bash
# Install Vercel CLI (if needed)
npm i -g vercel

# Deploy from project root
vercel
```

### 2. **Configure Build Settings**
- Framework Preset: **Other**
- Build Command: `cd client && yarn install && yarn build`
- Output Directory: `client/dist`
- Install Command: `yarn install`

### 3. **Set Environment Variables**
In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.vercel` template
3. Set for Production, Preview, and Development

### 4. **Database Migration**
After first deployment, run:
```bash
# Connect to production
vercel env pull .env.production
npx prisma db push
```

## Post-Deployment Verification

### ✅ Check These URLs:
- `https://your-domain.vercel.app` - Homepage loads
- `https://your-domain.vercel.app/api/health` - API working
- `https://your-domain.vercel.app/quiz` - Quiz functionality
- `https://your-domain.vercel.app/results` - Results page

### ✅ Test Core Features:
1. **Quiz Flow**: Take quiz → Get results
2. **Email Capture**: Provide email → Temporary user created
3. **Payment Flow**: Pay for report → Access unlocked
4. **User Accounts**: Login → Dashboard access

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check Node.js version (20.x required)
- Verify all dependencies installed
- Check for TypeScript errors

**API Routes Fail:**
- Verify environment variables set
- Check database connection
- Monitor function logs in Vercel

**Database Connection:**
- Ensure `DATABASE_URL` format correct
- Check SSL mode requirements
- Verify firewall settings

### Performance Optimization:
- ✅ AI routes have 1024MB memory
- ✅ Standard routes have 512MB memory
- ✅ Prisma connection pooling enabled
- ✅ Client-side caching implemented

## Support

For deployment issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API routes individually
4. Monitor database connections

**Ready to Deploy!** 🎉
