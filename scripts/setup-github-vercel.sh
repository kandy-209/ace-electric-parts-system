#!/bin/bash

# Script to automatically set up GitHub and Vercel

echo "🚀 Setting up GitHub and Vercel connection..."
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "📦 Installing GitHub CLI..."
    if command -v brew &> /dev/null; then
        brew install gh
    else
        echo "Please install GitHub CLI manually: https://cli.github.com/"
        exit 1
    fi
fi

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Authenticate GitHub
echo ""
echo "🔐 Authenticating with GitHub..."
echo "You'll need to log in to GitHub in your browser..."
gh auth login

# Check GitHub auth status
if gh auth status &> /dev/null; then
    echo "✅ GitHub authenticated!"
    
    # Get GitHub username
    GITHUB_USER=$(gh api user --jq .login)
    echo "GitHub username: $GITHUB_USER"
    
    # Create repository
    echo ""
    echo "📦 Creating GitHub repository..."
    REPO_NAME="ace-electric-parts-system"
    gh repo create $REPO_NAME --private --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository created and pushed to GitHub!"
        echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
    else
        echo "⚠️  Repository might already exist or there was an error"
    fi
else
    echo "❌ GitHub authentication failed"
    exit 1
fi

# Authenticate Vercel
echo ""
echo "🔐 Authenticating with Vercel..."
echo "You'll need to log in to Vercel..."
vercel login

# Link to Vercel project
echo ""
echo "📦 Linking to Vercel..."
vercel link

# Deploy to Vercel
echo ""
read -p "Deploy to Vercel now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo "You can deploy later with: vercel --prod"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "GitHub: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "Vercel: Check your Vercel dashboard"

