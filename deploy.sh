#!/bin/bash

echo "🚀 BizModelAI Deployment Script"
echo "================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Test build locally first
echo "🔨 Testing build locally..."
cd client && yarn build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi
cd ..

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your database (Supabase)"
echo "3. Set up email service (Resend)"
echo "4. Configure Stripe webhooks"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
