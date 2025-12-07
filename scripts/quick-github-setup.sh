#!/bin/bash

# Quick GitHub setup helper

echo "🔗 Quick GitHub Setup"
echo "===================="
echo ""

# Check if remote exists
if git remote get-url origin &> /dev/null; then
    REMOTE_URL=$(git remote get-url origin)
    echo "✅ Remote already configured: $REMOTE_URL"
    echo ""
    echo "Pushing code..."
    git push -u origin main 2>&1 || git push -u origin master 2>&1
    exit 0
fi

echo "To set up GitHub:"
echo ""
echo "Option 1: Via GitHub Web Interface"
echo "  1. Go to: https://github.com/new"
echo "  2. Create repo: ace-electric-parts-system"
echo "  3. Run: git remote add origin https://github.com/YOUR_USERNAME/ace-electric-parts-system.git"
echo "  4. Run: git push -u origin main"
echo ""

read -p "Or enter your GitHub username to set it up now: " GITHUB_USER

if [ ! -z "$GITHUB_USER" ]; then
    echo ""
    echo "📦 Adding remote..."
    git remote add origin "https://github.com/$GITHUB_USER/ace-electric-parts-system.git" 2>/dev/null || \
        git remote set-url origin "https://github.com/$GITHUB_USER/ace-electric-parts-system.git"
    
    echo "📤 Attempting to push..."
    echo ""
    echo "Note: You may need to create the repository on GitHub first."
    echo "If push fails, create the repo at: https://github.com/new"
    echo ""
    
    git push -u origin main 2>&1 || git push -u origin master 2>&1
fi

