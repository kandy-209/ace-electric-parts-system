#!/bin/bash

# Simple setup script that uses npx (no global installs needed)

echo "🚀 Setting up GitHub and Vercel connection..."
echo ""

# Step 1: Check current remote
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote already configured:"
    git remote -v
    echo ""
    read -p "Use existing remote? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "To change remote, run: git remote set-url origin NEW_URL"
        exit 0
    fi
else
    echo "📦 No GitHub remote configured yet."
    echo ""
    echo "To set up GitHub repository:"
    echo "1. Go to: https://github.com/new"
    echo "2. Create a new repository: ace-electric-parts-system"
    echo "3. Copy the repository URL"
    echo "4. Run: git remote add origin YOUR_REPO_URL"
    echo "5. Run: git push -u origin main"
    echo ""
    read -p "Do you want to set up GitHub remote now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter GitHub repository URL: " REPO_URL
        if [ ! -z "$REPO_URL" ]; then
            git remote add origin "$REPO_URL"
            echo "✅ Remote added!"
            echo "Pushing code..."
            git push -u origin main
        fi
    fi
fi

# Step 2: Vercel setup using npx
echo ""
echo "🔐 Setting up Vercel..."
echo "This will open a browser for authentication..."
echo ""
read -p "Continue with Vercel setup? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Linking to Vercel (using npx, no global install needed)..."
    npx vercel@latest link
    
    echo ""
    read -p "Deploy to Vercel production now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying to Vercel..."
        npx vercel@latest --prod
    else
        echo "You can deploy later with: npx vercel@latest --prod"
    fi
fi

echo ""
echo "✅ Setup complete!"

