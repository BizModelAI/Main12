# Render Deployment Checklist

## Pre-Deployment Setup

### ✅ 1. Environment Variables Setup
- [ ] Set up Supabase database
- [ ] Get Supabase connection details
- [ ] Generate secure secrets
- [ ] Get API keys for all services
- [ ] Configure Render environment variables

### ✅ 2. Required Environment Variables
Run `npm run validate-env` to check all variables are set:

**Basic Configuration:**
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`

**Database (Supabase):**
- [ ] `DATABASE_URL` (use pooler endpoint)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

**Security:**
- [ ] `SESSION_SECRET` (32+ char random string)
- [ ] `JWT_SECRET` (32+ char random string)
- [ ] `ADMIN_SECRET` (random secret)

**Frontend:**
- [ ] `FRONTEND_URL=https://[YOUR-APP-NAME].onrender.com`

**APIs:**
- [ ] `OPENAI_API_KEY`

**Payment Processing:**
- [ ] `STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_CLIENT_SECRET`
- [ ] `PAYPAL_MODE=sandbox`

**Email:**
- [ ] `RESEND_API_KEY`

**Optional:**
- [ ] `LOG_LEVEL=info`
- [ ] `RATE_LIMIT_WINDOW_MS=60000`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`
- [ ] `CORS_ORIGINS=https://[YOUR-APP-NAME].onrender.com,https://bizmodelai.com`

## Render Dashboard Setup

### ✅ 3. Create Web Service
1. [ ] Go to [dashboard.render.com](https://dashboard.render.com)
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect your GitHub repository
4. [ ] Configure the service:
   - **Name**: `bizmodelai` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose appropriate plan

### ✅ 4. Set Environment Variables in Render
1. [ ] Go to your web service
2. [ ] Click "Environment" tab
3. [ ] Add each environment variable from the list above
4. [ ] Use the exact keys and values from your `.env` file
5. [ ] Make sure to replace all placeholders with actual values

### ✅ 5. Database Setup
1. [ ] Create PostgreSQL database in Render (if not using Supabase)
2. [ ] Or ensure Supabase database is properly configured
3. [ ] Test database connection
4. [ ] Run database migrations if needed

## Deployment Process

### ✅ 6. Initial Deployment
1. [ ] Push your code to GitHub
2. [ ] Render will automatically start building
3. [ ] Monitor the build logs for any errors
4. [ ] Wait for deployment to complete
5. [ ] Check if the service is running

### ✅ 7. Post-Deployment Verification
1. [ ] Visit your app URL: `https://[YOUR-APP-NAME].onrender.com`
2. [ ] Test basic functionality:
   - [ ] Home page loads
   - [ ] Quiz starts
   - [ ] AI analysis works
   - [ ] Payment processing works
   - [ ] Email sending works
3. [ ] Check server logs for any errors
4. [ ] Verify all API endpoints are working

### ✅ 8. Domain Setup (Optional)
1. [ ] Add custom domain in Render dashboard
2. [ ] Update DNS settings
3. [ ] Update `FRONTEND_URL` and `CORS_ORIGINS` with new domain
4. [ ] Test with custom domain

## Testing Checklist

### ✅ 9. Functional Testing
- [ ] **Quiz Flow**: Complete a quiz and verify AI analysis
- [ ] **Authentication**: Test login/register functionality
- [ ] **Payment**: Test Stripe and PayPal payments
- [ ] **Email**: Verify email sending works
- [ ] **Admin**: Test admin panel access
- [ ] **PDF Generation**: Test report generation
- [ ] **Mobile**: Test on mobile devices

### ✅ 10. Performance Testing
- [ ] **Load Time**: Check initial page load speed
- [ ] **API Response**: Verify API response times
- [ ] **Database**: Check database connection performance
- [ ] **Memory Usage**: Monitor memory consumption
- [ ] **Error Handling**: Test error scenarios

## Security Checklist

### ✅ 11. Security Verification
- [ ] **HTTPS**: Verify HTTPS is enabled
- [ ] **CORS**: Check CORS is properly configured
- [ ] **Secrets**: Verify no secrets are exposed in logs
- [ ] **Rate Limiting**: Test rate limiting functionality
- [ ] **Input Validation**: Test input validation
- [ ] **SQL Injection**: Verify database queries are safe

## Monitoring Setup

### ✅ 12. Monitoring Configuration
- [ ] **Logs**: Check Render logs are accessible
- [ ] **Metrics**: Monitor CPU and memory usage
- [ ] **Uptime**: Set up uptime monitoring
- [ ] **Alerts**: Configure alerts for failures
- [ ] **Backup**: Ensure database backups are enabled

## Production Readiness

### ✅ 13. Production Checklist
- [ ] **Environment**: All variables set to production values
- [ ] **Payments**: Switch to production payment keys
- [ ] **Email**: Configure production email settings
- [ ] **Domain**: Set up production domain
- [ ] **SSL**: Verify SSL certificate is active
- [ ] **Backup**: Test backup and restore procedures

## Troubleshooting

### ✅ 14. Common Issues
- [ ] **Build Failures**: Check build logs and dependencies
- [ ] **Runtime Errors**: Check server logs and environment variables
- [ ] **Database Issues**: Verify database connection and credentials
- [ ] **CORS Errors**: Check CORS configuration
- [ ] **Payment Issues**: Verify payment provider configuration
- [ ] **Email Issues**: Check email service configuration

## Commands Reference

### Useful Commands:
```bash
# Validate environment variables
npm run validate-env

# Check TypeScript compilation
npm run check:ts

# Build the application
npm run build

# Test the application locally
npm run dev:full

# Check for TypeScript errors
npm run check
```

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Documentation](https://developer.paypal.com/docs)
- [OpenAI Documentation](https://platform.openai.com/docs)

## Final Verification

### ✅ 15. Go-Live Checklist
- [ ] All tests pass
- [ ] Performance is acceptable
- [ ] Security measures are in place
- [ ] Monitoring is configured
- [ ] Backup procedures are tested
- [ ] Documentation is updated
- [ ] Team is trained on deployment process

---

**🎉 Congratulations! Your application is now deployed on Render!**

Remember to:
- Monitor your application regularly
- Keep dependencies updated
- Review logs for any issues
- Test functionality after any changes
- Maintain security best practices 