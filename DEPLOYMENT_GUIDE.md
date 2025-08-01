# Deployment Guide for Render

## Overview
This guide covers deploying the Business Model Finder application to Render.

## Prerequisites
- Render account
- Database (PostgreSQL recommended)
- Environment variables configured

## Environment Variables Required

Set these environment variables in your Render dashboard:

### Required Variables
- `DATABASE_URL` - Supabase connection string
- `SESSION_SECRET` - Secret key for session management
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `ADMIN_SECRET` - Secret for admin access
- `RESEND_API_KEY` - Resend API key for emails

### Optional Variables
- `NODE_ENV` - Set to "production" (default)
- `FRONTEND_URL` - Set to your Render URL (auto-configured)
- `JWT_SECRET` - JWT secret (if using JWT auth)

## Deployment Steps

### 1. Connect Repository
1. Connect your GitHub repository to Render
2. Select the repository containing this project

### 2. Configure Service
- **Service Type**: Web Service
- **Environment**: Node
- **Plan**: Starter (or higher for production)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

### 3. Set Environment Variables
Add all required environment variables in the Render dashboard.

### 4. Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any issues

## Build Process

The build process:
1. Installs dependencies (`npm install`)
2. Builds the frontend (`cd client && yarn build`)
3. Compiles TypeScript (`tsc`)
4. Creates production-ready files in `dist/` directory

## Production Configuration

### Session Security
- Secure cookies enabled in production
- SameSite set to 'strict' in production
- HTTP-only cookies enabled

### CORS Configuration
- Allows requests from production domain
- Credentials enabled for authenticated requests
- Proper origin validation

### Static File Serving
- Frontend built files served from `/client/dist`
- SPA routing handled by catch-all route
- API routes served from `/api/*`

## Health Checks

The application provides health check endpoints:
- `/api/health` - Basic health check
- `/api/admin/health` - Admin health check with database stats

## Monitoring

### Logs
- Application logs available in Render dashboard
- Error tracking and monitoring recommended

### Performance
- Monitor response times
- Check database connection health
- Monitor API usage

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript compilation errors
   - Verify all dependencies are installed
   - Check for missing environment variables

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check database is accessible from Render
   - Ensure database migrations are run

3. **Session Issues**
   - Verify SESSION_SECRET is set
   - Check cookie settings in production
   - Ensure CORS is properly configured

4. **API Errors**
   - Check environment variables
   - Verify external API keys (OpenAI, Stripe)
   - Monitor rate limits

### Debug Commands

```bash
# Check TypeScript compilation
npm run check

# Build locally to test
npm run build

# Test production build
npm start
```

## Post-Deployment

### Database Setup
1. Run Prisma migrations: `npx prisma migrate deploy`
2. Generate Prisma client: `npx prisma generate`

### Testing
1. Test health check endpoint
2. Verify authentication flow
3. Test payment integration
4. Check email functionality

### Security
1. Verify HTTPS is enabled
2. Check security headers
3. Validate CORS settings
4. Test session security

## Support

For issues:
1. Check Render logs
2. Verify environment variables
3. Test locally with production settings
4. Contact support if needed
