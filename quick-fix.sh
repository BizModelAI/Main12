#!/bin/bash

echo "🔧 Quick Fix for GitHub Conflicts"
echo "================================="

echo "⚠️  This will reset your repository and force push the current code"
echo "⚠️  Only use this if you're sure you want to overwrite the remote repository"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing conflicting files..."
    
    # Remove problematic lock files
    rm -f yarn.lock package-lock.json
    
    # Regenerate lock file
    echo "📦 Regenerating dependencies..."
    yarn install
    
    # Add all files
    echo "📝 Adding files to git..."
    git add .
    
    # Commit
    echo "💾 Committing changes..."
    git commit -m "Fix: Resolve conflicts and regenerate lock files for deployment"
    
    # Force push to overwrite remote conflicts
    echo "🚀 Force pushing to GitHub..."
    git push --force-with-lease origin main
    
    echo "✅ Done! Check GitHub - conflicts should be resolved."
    echo "🚀 Vercel deployment should start automatically."
else
    echo "❌ Operation cancelled."
fi
