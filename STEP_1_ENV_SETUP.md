# Step 1: Environment Variables Setup

## What You Need

Before we can run the application, we need to set up environment variables.

## Quick Start

### 1. Create `.env.local` file

```bash
cp .env.example .env.local
```

### 2. Fill in your credentials

Open `.env.local` and fill in:

#### A. Supabase (REQUIRED)

1. Go to https://supabase.com and sign in
2. Create a new project (or use existing)
3. Go to: **Project Settings → API**
4. Copy these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### B. OpenAI (REQUIRED)

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy to:

```bash
OPENAI_API_KEY=sk-xxxxx...
```

### 3. Verify Setup

Run this command to verify everything is set up:

```bash
npm run verify:setup
```

## What's Next?

Once Step 1 is complete, we'll move to:
- **Step 2**: Run database migrations
- **Step 3**: Test database connection

## Need Help?

- Supabase setup: https://supabase.com/docs/guides/getting-started
- OpenAI API: https://platform.openai.com/docs/quickstart

