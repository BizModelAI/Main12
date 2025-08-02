# Render Environment Variables Setup Guide

## Overview
This guide shows you exactly how to set up environment variables in Render for your BizModelAI application.

## Required Environment Variables

### 1. Basic Configuration
```
NODE_ENV=production
PORT=3001
```

### 2. Database (Supabase)
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

### 3. Session & Security
```
SESSION_SECRET=[GENERATE-RANDOM-32-CHAR-STRING]
JWT_SECRET=[GENERATE-RANDOM-32-CHAR-STRING]
ADMIN_SECRET=[GENERATE-RANDOM-SECRET-FOR-ADMIN-ACCESS]
```

### 4. Frontend URL
```
FRONTEND_URL=https://[YOUR-APP-NAME].onrender.com
```

### 5. OpenAI API
```
OPENAI_API_KEY=sk-[YOUR-OPENAI-API-KEY]
```

### 6. Stripe Payment Processing
```
STRIPE_PUBLISHABLE_KEY=pk_test_[YOUR-STRIPE-PUBLISHABLE-KEY]
STRIPE_SECRET_KEY=sk_test_[YOUR-STRIPE-SECRET-KEY]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR-STRIPE-WEBHOOK-SECRET]
```

### 7. PayPal Payment Processing
```
PAYPAL_CLIENT_ID=[YOUR-PAYPAL-CLIENT-ID]
PAYPAL_CLIENT_SECRET=[YOUR-PAYPAL-CLIENT-SECRET]
PAYPAL_MODE=sandbox
```

### 8. Email Service (Resend)
```
RESEND_API_KEY=re_[YOUR-RESEND-API-KEY]
```

### 9. Render-Specific (Auto-set)
```
RENDER=true
RENDER_EXTERNAL_URL=https://[YOUR-APP-NAME].onrender.com
RENDER_INSTANCE_ID=[AUTO-SET-BY-RENDER]
```

### 10. Optional Configurations
```
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGINS=https://[YOUR-APP-NAME].onrender.com,https://bizmodelai.com
```

## How to Set Environment Variables in Render

### Step 1: Go to Your Render Dashboard
1. Log in to [dashboard.render.com](https://dashboard.render.com)
2. Select your web service

### Step 2: Navigate to Environment Variables
1. Click on your web service
2. Go to the "Environment" tab
3. Click "Add Environment Variable"

### Step 3: Add Each Variable
Add each variable from the list above. Here's the exact format:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | `postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `SUPABASE_URL` | `https://[YOUR-PROJECT-ID].supabase.co` |
| `SUPABASE_ANON_KEY` | `[YOUR-ANON-KEY]` |
| `SUPABASE_SERVICE_ROLE_KEY` | `[YOUR-SERVICE-ROLE-KEY]` |
| `SESSION_SECRET` | `[GENERATE-RANDOM-32-CHAR-STRING]` |
| `JWT_SECRET` | `[GENERATE-RANDOM-32-CHAR-STRING]` |
| `ADMIN_SECRET` | `[GENERATE-RANDOM-SECRET-FOR-ADMIN-ACCESS]` |
| `FRONTEND_URL` | `https://[YOUR-APP-NAME].onrender.com` |
| `OPENAI_API_KEY` | `sk-[YOUR-OPENAI-API-KEY]` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_[YOUR-STRIPE-PUBLISHABLE-KEY]` |
| `STRIPE_SECRET_KEY` | `sk_test_[YOUR-STRIPE-SECRET-KEY]` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_[YOUR-STRIPE-WEBHOOK-SECRET]` |
| `PAYPAL_CLIENT_ID` | `[YOUR-PAYPAL-CLIENT-ID]` |
| `PAYPAL_CLIENT_SECRET` | `[YOUR-PAYPAL-CLIENT-SECRET]` |
| `PAYPAL_MODE` | `sandbox` |
| `RESEND_API_KEY` | `re_[YOUR-RESEND-API-KEY]` |
| `LOG_LEVEL` | `info` |
| `RATE_LIMIT_WINDOW_MS` | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |
| `CORS_ORIGINS` | `https://[YOUR-APP-NAME].onrender.com,https://bizmodelai.com` |

## Generating Secure Secrets

### For SESSION_SECRET and JWT_SECRET:
```bash
# Generate a random 32-character string
openssl rand -base64 32
```

### For ADMIN_SECRET:
```bash
# Generate a random secret
openssl rand -hex 16
```

## Important Notes

1. **Replace Placeholders**: Replace all `[YOUR-*]` placeholders with your actual values
2. **Keep Secrets Secure**: Never commit these values to your repository
3. **Test in Sandbox**: Use sandbox/test keys for Stripe and PayPal initially
4. **Update URLs**: Replace `[YOUR-APP-NAME]` with your actual Render app name
5. **Database URL**: Use the pooler URL from Supabase for better performance

## Validation Script

After setting up your environment variables, you can validate them by running:

```bash
# This will check if all required variables are set
node scripts/validate-env.js
```

## Troubleshooting

### Common Issues:
1. **Database Connection**: Make sure your `DATABASE_URL` uses the pooler endpoint
2. **CORS Errors**: Ensure `CORS_ORIGINS` includes your Render app URL
3. **Session Issues**: Verify `SESSION_SECRET` is set and unique
4. **Payment Failures**: Check that Stripe/PayPal keys are correct and in the right mode

### Render-Specific Issues:
1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Runtime Errors**: Verify environment variables are set correctly
3. **Database Timeouts**: Use the pooler URL for better connection handling

## Next Steps

1. Set up your Supabase database
2. Configure your payment providers (Stripe/PayPal)
3. Set up your email service (Resend)
4. Deploy to Render
5. Test all functionality
6. Switch to production keys when ready 