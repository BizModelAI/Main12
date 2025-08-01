# Render Deployment Guide

This guide will help you deploy your Business Model Finder application to Render.

## Prerequisites

1. A Render account (free tier available)
2. Your application code pushed to a Git repository (GitHub, GitLab, etc.)
3. API keys for external services (Stripe, PayPal, OpenAI, Resend)

## Step 1: Prepare Your Repository

Make sure your repository contains:
- `render.yaml` - Deployment configuration
- `Dockerfile` - Container configuration
- `.dockerignore` - Files to exclude from build
- All your application code

## Step 2: Set Up Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "PostgreSQL"
3. Configure:
   - **Name**: `business-model-finder-db`
   - **Database**: `businessmodelfinder`
   - **User**: `businessmodelfinder`
   - **Plan**: Starter (Free)
4. Click "Create Database"
5. Note the connection string for later use

## Step 3: Deploy Web Service

1. In Render Dashboard, click "New +" and select "Web Service"
2. Connect your Git repository
3. Configure the service:
   - **Name**: `business-model-finder`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (Free)

## Step 4: Configure Environment Variables

In your web service settings, add these environment variables:

### Required Variables (set these manually):
- `DATABASE_URL`: Your PostgreSQL connection string from Step 2
- `SESSION_SECRET`: A random string for session encryption
- `JWT_SECRET`: A random string for JWT token signing
- `FRONTEND_URL`: Your Render URL (e.g., `https://your-app-name.onrender.com`)

### External Service API Keys:
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `PAYPAL_CLIENT_ID`: Your PayPal client ID
- `PAYPAL_CLIENT_SECRET`: Your PayPal client secret
- `OPENAI_API_KEY`: Your OpenAI API key
- `RESEND_API_KEY`: Your Resend API key

## Step 5: Database Migration

After deployment, you'll need to run Prisma migrations:

1. Go to your web service in Render Dashboard
2. Click on "Shell" tab
3. Run these commands:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Step 6: Update External Service Webhooks

Update your Stripe and PayPal webhook URLs to point to your new Render domain:
- Stripe: `https://your-app-name.onrender.com/api/stripe/webhook`
- PayPal: `https://your-app-name.onrender.com/api/paypal/webhook`

## Step 7: Test Your Deployment

1. Visit your app at `https://your-app-name.onrender.com`
2. Test the main functionality
3. Check that payments work correctly
4. Verify database operations

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs in Render Dashboard
2. **Database Connection**: Verify DATABASE_URL is correct
3. **Environment Variables**: Ensure all required variables are set
4. **Port Issues**: Make sure your app listens on `process.env.PORT`

### Logs and Debugging:

- View logs in Render Dashboard under your service
- Use the Shell tab to run commands directly
- Check the "Events" tab for deployment history

## Cost Optimization

- Use the free tier for development/testing
- Upgrade to paid plans only when needed
- Monitor usage in Render Dashboard

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Regularly rotate your secrets
- Enable HTTPS (automatic on Render)

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Your app logs: Available in Render Dashboard 