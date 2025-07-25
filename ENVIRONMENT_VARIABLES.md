# 🔧 Environment Variables for bizmodelai.com

## Required Environment Variables

Set these in your **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

### 🔐 **Authentication & Security**
```env
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
```
**How to generate**: Run `openssl rand -base64 32` or use any random 32+ character string

### 🌐 **URLs & CORS**
```env
FRONTEND_URL=https://bizmodelai.com
```
**Production**: `https://bizmodelai.com`  
**Development**: `http://localhost:5173`

### 🗄️ **Database**
```env
DATABASE_URL=your_neon_database_connection_string
```
**Format**: `postgresql://username:password@host:port/database?sslmode=require`

### 🤖 **AI Services**
```env
OPENAI_API_KEY=sk-your-openai-api-key
```
**Get from**: [OpenAI Platform](https://platform.openai.com/api-keys)

### 💳 **Payment Processing**
```env
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key  
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```
**Get from**: [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

### 📧 **Email (Optional)**
```env
RESEND_API_KEY=re_your_resend_api_key
```
**Get from**: [Resend Dashboard](https://resend.com/api-keys)

### 👑 **Admin (Optional)**
```env
ADMIN_API_KEY=your_admin_access_key
```
**Generate**: Any secure random string for admin access

## Environment Setup Instructions

### For Vercel Deployment:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add each variable with scope set to **Production** and **Preview**

### For Local Development:
Create a `.env` file in your project root:
```env
# Copy all the variables above with your local values
DATABASE_URL=your_local_database_url
JWT_SECRET=your-local-jwt-secret
FRONTEND_URL=http://localhost:5173
# ... etc
```

## Variable Validation

The app automatically validates required environment variables:
- ✅ **Required**: `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`
- ⚠️ **Optional**: Missing optional vars will show warnings but won't break the app

## Security Notes

- ❌ **Never** commit `.env` files to git
- ✅ **Always** use different secrets for production vs development
- ✅ **Rotate** secrets regularly for security
- ✅ **Use** strong, random values for all secrets

## Quick Setup Commands

Generate secure secrets:
```bash
# JWT Secret (32+ characters)
openssl rand -base64 32

# Admin API Key  
openssl rand -hex 16

# Any random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
