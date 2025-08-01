# Render Deployment Guide

This guide will help you deploy the Business Model Finder application to Render.

## Prerequisites

1. A Render account (free tier available)
2. A PostgreSQL database (Render provides this)
3. Environment variables configured

## Step 1: Prepare Your Repository

Ensure your repository is ready for deployment:

1. **Remove Vercel dependencies** (already done):
   - Removed `@vercel/analytics` and `@vercel/speed-insights`
   - Removed `vercel.json`
   - Removed all Vercel API routes

2. **Verify configuration files**:
   - `render.yaml` - Render deployment configuration
   - `package.json` - Contains build and start scripts
   - `server/index.ts` - Main server entry point

## Step 2: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:

### Basic Settings
- **Name**: `business-model-finder`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (root of repository)

### Build & Deploy Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Starter` (free tier)

## Step 3: Configure Environment Variables

Add these environment variables in the Render dashboard:

### Required Variables
```
NODE_ENV=production
DATABASE_URL=your_supabase_connection_string
SESSION_SECRET=your_session_secret_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
ADMIN_SECRET=your_admin_secret_key
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=https://your-app-name.onrender.com
```

### Optional Variables
```
PORT=10000
```

## Step 4: Set Up PostgreSQL Database

1. In Render dashboard, create a new PostgreSQL database
2. Copy the connection string
3. Add it as `DATABASE_URL` environment variable
4. Run database migrations:
   ```bash
   npx prisma db push
   ```

## Step 5: Configure Custom Domain (Optional)

1. In your web service settings, go to "Settings" → "Custom Domains"
2. Add your domain
3. Configure DNS records as instructed by Render

## Step 6: Deploy

1. Push your changes to GitHub
2. Render will automatically deploy
3. Monitor the build logs for any issues

## Step 7: Post-Deployment Verification

After deployment, verify these endpoints work:

1. **Health Check**: `https://your-app.onrender.com/api/health`
2. **Admin Health**: `https://your-app.onrender.com/api/admin/health`
3. **Frontend**: `https://your-app.onrender.com/`
4. **Authentication**: Test login/signup flows

## Configuration Details

### render.yaml
The `render.yaml` file contains the deployment configuration:
```yaml
services:
  - type: web
    name: business-model-finder
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /api/health
    autoDeploy: true
```

### Package.json Scripts
- `build`: Builds the client and compiles TypeScript
- `start`: Starts the production server using tsx

### Server Configuration
- Uses Express.js with session-based authentication
- Serves static files from `client/dist`
- Handles API routes and SPA routing
- Configured for production with secure cookies

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Database Connection**:
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from Render
   - Run migrations if needed

3. **Environment Variables**:
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify sensitive variables are marked as "sync: false"

4. **Port Issues**:
   - Render uses port 10000 by default
   - Ensure your app listens on `process.env.PORT`

### Performance Optimization

1. **Database Connection Pooling**:
   - Configure Prisma connection pooling for production
   - Monitor database performance

2. **Static File Caching**:
   - Configure appropriate cache headers
   - Use CDN for static assets if needed

3. **Session Storage**:
   - Consider using Redis for session storage in production
   - Current setup uses MemoryStore (fine for starter plan)

## Monitoring and Maintenance

1. **Health Checks**: Monitor `/api/health` endpoint
2. **Logs**: Check Render logs for errors
3. **Database**: Monitor database performance and connections
4. **Uptime**: Set up uptime monitoring

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configured for production domains
3. **Session Security**: Secure cookies in production
4. **Rate Limiting**: Implement rate limiting for API endpoints

## Scaling

When you need to scale:

1. **Upgrade Plan**: Move from Starter to Standard plan
2. **Database**: Consider dedicated PostgreSQL instance
3. **Caching**: Add Redis for session storage and caching
4. **CDN**: Use CDN for static assets

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com/
- Application Issues: Check logs and health endpoints 