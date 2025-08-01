# Manual Deployment Checklist for Render

Since terminal commands aren't working, follow this manual checklist to deploy your application.

## Pre-Deployment Checklist

### ✅ Files to Verify (Check these exist in your project):
- [ ] `render.yaml` - Deployment configuration
- [ ] `Dockerfile` - Container configuration  
- [ ] `.dockerignore` - Files to exclude from build
- [ ] `package.json` - Main package file
- [ ] `client/package.json` - Client package file
- [ ] `prisma/schema.prisma` - Database schema
- [ ] `server/index.ts` - Main server file

### ✅ Git Repository Setup:
- [ ] Code is pushed to GitHub/GitLab
- [ ] Repository is public or connected to Render
- [ ] All files are committed and pushed

## Step-by-Step Deployment

### 1. Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub/GitLab account
- [ ] Verify email address

### 2. Create PostgreSQL Database
- [ ] In Render Dashboard, click "New +"
- [ ] Select "PostgreSQL"
- [ ] Configure:
  - **Name**: `business-model-finder-db`
  - **Database**: `businessmodelfinder`
  - **User**: `businessmodelfinder`
  - **Plan**: Starter (Free)
- [ ] Click "Create Database"
- [ ] **Copy the connection string** (you'll need this later)

### 3. Create Web Service
- [ ] In Render Dashboard, click "New +"
- [ ] Select "Web Service"
- [ ] Connect your Git repository
- [ ] Configure:
  - **Name**: `business-model-finder`
  - **Environment**: `Node`
  - **Build Command**: `npm install && cd client && npm install && cd .. && npm run build`
  - **Start Command**: `npm start`
  - **Plan**: Starter (Free)

### 4. Configure Environment Variables
In your web service settings, add these variables:

#### Required Variables:
- [ ] `DATABASE_URL` = [Your PostgreSQL connection string from Step 2]
- [ ] `SESSION_SECRET` = [Generate a random string]
- [ ] `JWT_SECRET` = [Generate a random string]
- [ ] `FRONTEND_URL` = `https://your-app-name.onrender.com` (replace with your actual Render URL)
- [ ] `NODE_ENV` = `production`

#### External Service API Keys:
- [ ] `STRIPE_SECRET_KEY` = [Your Stripe secret key]
- [ ] `STRIPE_PUBLISHABLE_KEY` = [Your Stripe publishable key]
- [ ] `STRIPE_WEBHOOK_SECRET` = [Your Stripe webhook secret]
- [ ] `PAYPAL_CLIENT_ID` = [Your PayPal client ID]
- [ ] `PAYPAL_CLIENT_SECRET` = [Your PayPal client secret]
- [ ] `OPENAI_API_KEY` = [Your OpenAI API key]
- [ ] `RESEND_API_KEY` = [Your Resend API key]
- [ ] `ADMIN_SECRET` = [Generate a random admin secret]

### 5. Deploy and Test
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check build logs for any errors
- [ ] Visit your app URL to test functionality

### 6. Database Migration
After successful deployment:
- [ ] Go to your web service in Render Dashboard
- [ ] Click on "Shell" tab
- [ ] Run: `npx prisma generate`
- [ ] Run: `npx prisma db push`

### 7. Update External Services
- [ ] Update Stripe webhook URL to: `https://your-app-name.onrender.com/api/stripe/webhook`
- [ ] Update PayPal webhook URL to: `https://your-app-name.onrender.com/api/paypal/webhook`

## Troubleshooting

### Build Failures:
- [ ] Check build logs in Render Dashboard
- [ ] Verify all dependencies are in package.json
- [ ] Ensure TypeScript compilation works locally

### Database Issues:
- [ ] Verify DATABASE_URL is correct
- [ ] Check database connection in logs
- [ ] Ensure Prisma schema is valid

### Environment Variables:
- [ ] Double-check all required variables are set
- [ ] Verify API keys are correct
- [ ] Check for typos in variable names

## Security Notes
- [ ] Never commit API keys to repository
- [ ] Use environment variables for all secrets
- [ ] Regularly rotate your secrets
- [ ] Enable HTTPS (automatic on Render)

## Cost Optimization
- [ ] Use free tier for development
- [ ] Monitor usage in Render Dashboard
- [ ] Upgrade only when needed

## Support Resources
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Your app logs: Available in Render Dashboard 