# Automatic GitHub & Vercel Setup

## Quick Setup

I've created an automated setup script. Run:

```bash
npm run setup:github-vercel
```

Or manually:

```bash
./scripts/setup-github-vercel.sh
```

## What It Does

1. **Installs GitHub CLI** (if not installed)
2. **Installs Vercel CLI** (if not installed)
3. **Authenticates with GitHub** (opens browser)
4. **Creates GitHub repository** and pushes code
5. **Authenticates with Vercel** (opens browser)
6. **Links project to Vercel**
7. **Optionally deploys** to production

## Manual Alternative

### GitHub Setup

```bash
# Install GitHub CLI (if needed)
brew install gh

# Authenticate
gh auth login

# Create repo and push
gh repo create ace-electric-parts-system --private --source=. --remote=origin --push
```

### Vercel Setup

```bash
# Install Vercel CLI (if needed)
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy
vercel --prod
```

## Environment Variables

After deploying to Vercel, add environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env.local`

