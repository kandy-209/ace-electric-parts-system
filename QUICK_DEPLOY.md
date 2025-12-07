# Quick Deploy Guide

## Option 1: One-Command Setup (Recommended)

```bash
npm run setup
```

This will guide you through:
1. Setting up GitHub remote
2. Linking to Vercel
3. Deploying to production

## Option 2: Manual GitHub Setup (No CLI Needed)

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `ace-electric-parts-system`
3. Choose **Private** or **Public**
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

### Step 2: Connect Local Repo to GitHub

GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/lemonbear/Desktop/ace-electric-parts-system

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ace-electric-parts-system.git

# Push code
git push -u origin main
```

## Option 3: Vercel Setup (No CLI Needed)

### Via Vercel Dashboard:

1. Go to: https://vercel.com/new
2. Click **Import Git Repository**
3. Connect your GitHub account
4. Select your `ace-electric-parts-system` repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
6. Add Environment Variables:
   - Copy all from `.env.local`
7. Click **Deploy**

Vercel will automatically:
- Detect Next.js
- Install dependencies
- Build the project
- Deploy to production

## Option 4: Using npx (No Global Installs)

```bash
# Link to Vercel
npx vercel@latest link

# Deploy
npx vercel@latest --prod
```

## After Deployment

1. **Add Environment Variables** in Vercel Dashboard
2. **Run Database Migrations** in Supabase Dashboard
3. **Test the deployment** at your Vercel URL

## Quick Commands

```bash
# Verify setup
npm run verify:setup

# Test database
npm run test:db

# Setup GitHub + Vercel
npm run setup

# Deploy to Vercel (after linking)
npx vercel@latest --prod
```

