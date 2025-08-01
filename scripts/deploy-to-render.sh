#!/bin/bash

# Render Deployment Script
# This script helps prepare and deploy your application to Render

echo "🚀 Preparing for Render deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required files exist
echo "📋 Checking required files..."
required_files=("render.yaml" "Dockerfile" ".dockerignore")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: $file not found. Please create this file before deploying."
        exit 1
    fi
    echo "✅ $file found"
done

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Consider committing them before deployment."
    echo "   Run 'git add . && git commit -m \"Prepare for deployment\"' to commit changes."
fi

echo ""
echo "✅ Pre-deployment checks completed!"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to GitHub/GitLab:"
echo "   git add ."
echo "   git commit -m \"Prepare for Render deployment\""
echo "   git push origin main"
echo ""
echo "2. Go to https://dashboard.render.com"
echo "3. Create a new PostgreSQL database"
echo "4. Create a new Web Service and connect your repository"
echo "5. Configure environment variables (see render-deploy-guide.md)"
echo "6. Deploy!"
echo ""
echo "📖 For detailed instructions, see render-deploy-guide.md" 