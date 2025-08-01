# Custom Domain Setup Guide

This guide will help you set up your custom domain `bizmodelai.com` after your app is successfully deployed on Render.

## Prerequisites

1. ✅ Your app is successfully deployed on Render
2. ✅ Your app is working at `https://your-app-name.onrender.com`
3. ✅ You own the domain `bizmodelai.com`

## Step 1: Purchase Domain (if not already owned)

1. Go to a domain registrar (Namecheap, GoDaddy, Google Domains, etc.)
2. Purchase `bizmodelai.com`
3. Wait for domain to be active (usually 24-48 hours)

## Step 2: Configure DNS Records

In your domain registrar's DNS settings, add these records:

### A Record:
- **Name**: `@` (or leave blank)
- **Value**: `76.76.19.19`
- **TTL**: 3600 (or default)

### CNAME Record:
- **Name**: `www`
- **Value**: `your-app-name.onrender.com`
- **TTL**: 3600 (or default)

## Step 3: Add Custom Domain in Render

1. Go to your web service in Render Dashboard
2. Click on "Settings" tab
3. Scroll down to "Custom Domains" section
4. Click "Add Custom Domain"
5. Enter: `bizmodelai.com`
6. Click "Add Domain"

## Step 4: Update Environment Variables

Once the domain is active, update your environment variables:

1. In Render Dashboard, go to your web service
2. Click "Environment" tab
3. Update `FRONTEND_URL` to: `https://bizmodelai.com`
4. Save changes
5. Redeploy your service

## Step 5: Update External Service Webhooks

Update your payment provider webhooks:

### Stripe:
1. Go to Stripe Dashboard → Webhooks
2. Update webhook URL to: `https://bizmodelai.com/api/stripe/webhook`

### PayPal:
1. Go to PayPal Developer Dashboard → Webhooks
2. Update webhook URL to: `https://bizmodelai.com/api/paypal/webhook`

## Step 6: Test Everything

1. Visit `https://bizmodelai.com`
2. Test all functionality:
   - Quiz taking
   - Payment processing
   - Email sending
   - PDF generation
3. Verify webhooks are working

## Troubleshooting

### Domain Not Working:
- Check DNS propagation (can take up to 48 hours)
- Verify DNS records are correct
- Check domain status in Render Dashboard

### SSL Certificate Issues:
- Render automatically provides SSL certificates
- Wait 24-48 hours for certificate to be issued
- Check certificate status in Render Dashboard

### Webhook Failures:
- Verify webhook URLs are updated
- Check webhook logs in Stripe/PayPal dashboards
- Test webhook endpoints manually

## Important Notes

- DNS changes can take 24-48 hours to propagate globally
- Keep your Render URL as backup during transition
- Test thoroughly before switching completely
- Consider setting up redirects from old URL to new domain

## Support

- Render Custom Domains: https://render.com/docs/custom-domains
- Your domain registrar's support
- Render Community: https://community.render.com 