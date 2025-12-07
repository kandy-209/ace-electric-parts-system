#!/bin/bash

# Automated GitHub and Vercel connection script

set -e

echo "🚀 Automated GitHub & Vercel Setup"
echo "===================================="
echo ""

# Get GitHub username
echo "📋 Checking Git configuration..."
GIT_USER=$(git config user.name 2>/dev/null || echo "")
GIT_EMAIL=$(git config user.email 2>/dev/null || echo "")

echo "Git user: $GIT_USER"
echo "Git email: $GIT_EMAIL"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "✅ GitHub remote already configured:"
    echo "   $CURRENT_REMOTE"
    echo ""
    
    read -p "Push to existing remote? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 Pushing to GitHub..."
        git push -u origin main || git push -u origin master
        echo "✅ Code pushed to GitHub!"
    fi
else
    echo "📦 Setting up GitHub..."
    echo ""
    echo "To complete GitHub setup, you need to:"
    echo "1. Create a repository at: https://github.com/new"
    echo "2. Name it: ace-electric-parts-system"
    echo "3. Then run the commands shown below"
    echo ""
    
    if [ ! -z "$GIT_USER" ]; then
        echo "Based on your Git config, your GitHub username might be: $GIT_USER"
        echo ""
        echo "Quick command (replace YOUR_USERNAME with your actual GitHub username):"
        echo ""
        echo "  git remote add origin https://github.com/YOUR_USERNAME/ace-electric-parts-system.git"
        echo "  git push -u origin main"
        echo ""
        
        read -p "Do you want to set up GitHub remote now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter your GitHub username: " GITHUB_USER
            if [ ! -z "$GITHUB_USER" ]; then
                echo ""
                echo "📦 Adding remote..."
                git remote add origin "https://github.com/$GITHUB_USER/ace-electric-parts-system.git" || \
                    git remote set-url origin "https://github.com/$GITHUB_USER/ace-electric-parts-system.git"
                
                echo "📤 Pushing code..."
                git push -u origin main || git push -u origin master
                
                if [ $? -eq 0 ]; then
                    echo "✅ Successfully pushed to GitHub!"
                    echo "   Repository: https://github.com/$GITHUB_USER/ace-electric-parts-system"
                else
                    echo "⚠️  Push failed. Make sure:"
                    echo "   1. Repository exists on GitHub"
                    echo "   2. You have access to push"
                    echo "   3. You're authenticated (git credential or SSH key)"
                fi
            fi
        fi
    fi
fi

echo ""
echo "🔗 Setting up Vercel..."
echo ""

# Check if .vercel directory exists (already linked)
if [ -d ".vercel" ]; then
    echo "✅ Vercel project already linked"
    echo ""
    read -p "Deploy to Vercel now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying to Vercel..."
        npx vercel@latest --prod --yes
    fi
else
    echo "📦 Linking to Vercel..."
    echo "This will open your browser for authentication..."
    echo ""
    read -p "Continue with Vercel setup? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔐 Authenticating with Vercel (browser will open)..."
        npx vercel@latest link --yes
        
        echo ""
        read -p "Deploy to production now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🚀 Deploying to Vercel production..."
            npx vercel@latest --prod --yes
        fi
    else
        echo "You can set up Vercel later by running: npx vercel@latest link"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add environment variables in Vercel Dashboard"
echo "2. Run database migrations in Supabase"
echo "3. Test your deployment!"

