# 🚀 BizModelAI - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Required Environment Variables
Set these in your Vercel dashboard or via CLI:

```bash
# AI & Content Generation
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://...
NEON_DATABASE_URL=postgresql://...

# Email Service
RESEND_API_KEY=re_...

# Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal (Optional)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Application
NODE_ENV=production
```

### 2. External Services Setup

#### **Database (Neon - Free)**
1. Go to [neon.tech](https://neon.tech)
2. Create free PostgreSQL database
3. Copy connection string to `DATABASE_URL`

#### **Email Service (Resend - Free)**
1. Go to [resend.com](https://resend.com)
2. Get free API key (3,000 emails/month)
3. Add to `RESEND_API_KEY`

#### **Payments (Stripe - Free)**
1. Go to [stripe.com](https://stripe.com)
2. Get publishable and secret keys
3. Set up webhook endpoint: `https://yourapp.vercel.app/api/stripe/webhook`

## 🚀 Deployment Options

### Option A: GitHub + Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

### Option B: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add DATABASE_URL
   # ... add all required variables
   ```

## 🔧 Post-Deployment Setup

### 1. Test Your Deployment
- Visit your Vercel URL
- Test the quiz functionality
- Verify payments work
- Check email delivery

### 2. Configure Custom Domain (Optional)
- In Vercel dashboard: Settings → Domains
- Add your custom domain
- Update DNS records

### 3. Monitor Usage
- Check Vercel dashboard for function usage
- Monitor API quotas (OpenAI, Stripe, etc.)

## 🏆 Free Tier Limits

**Vercel Hobby Plan:**
- 100GB bandwidth/month
- 100GB-hrs serverless execution
- 1M function invocations
- Should be plenty for starting out!

**If you exceed limits:**
- Upgrade to Vercel Pro ($20/month)
- Or optimize heavy functions

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails**: Check client dependencies in `client/package.json`
2. **API errors**: Verify environment variables are set
3. **Database connection**: Ensure `DATABASE_URL` is correct
4. **Payment issues**: Check Stripe webhook URL and secrets

### Debug Commands:
```bash
# Check build locally
cd client && yarn build

# Test API locally
cd client && yarn dev

# Check environment variables
vercel env ls
```

## 📞 Need Help?
If you encounter issues, check:
1. Vercel deployment logs
2. Browser console errors
3. API endpoint responses

Your BizModelAI app is ready to launch! 🎉
