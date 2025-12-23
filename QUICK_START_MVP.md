# Quick Start Guide - MVP

## What Changed?

The application has been completely refactored to a **Vercel-only MVP**:

✅ **Simplified Architecture**:
- No more Railway backend - everything runs on Vercel
- Vercel Serverless Functions handle API routes
- Module 0 only (Current Reality)
- Simplified database schema

✅ **Easier Deployment**:
- Single platform (Vercel)
- No environment variable coordination between platforms
- Faster iteration with serverless functions

## Setup Steps

### 1. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for:
- Root package.json
- Frontend (frontend/)
- API (api/)

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a project
2. Enable Google OAuth in Authentication → Providers
3. Run the MVP schema:
   - Go to SQL Editor
   - Copy/paste `supabase/schema-mvp.sql`
   - Execute

### 3. Configure Environment Variables

#### For Local Development

Create `frontend/.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Create `.env.local` (in root, for Vercel CLI):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-key
```

#### For Vercel Deployment

Add these in Vercel Dashboard → Settings → Environment Variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4. Run Locally

**Option 1: Using Vercel CLI (Recommended)**
```bash
npm install -g vercel
vercel dev
```

This runs both frontend and API routes locally.

**Option 2: Frontend Only (for UI development)**
```bash
npm run dev
```

Note: API routes won't work with this option.

### 5. Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Testing

1. Visit http://localhost:5173 (or your Vercel URL)
2. Click "Sign in with Google"
3. Complete Module 0: Current Reality
4. Generate audit review
5. Review the generated document

## API Endpoints

All endpoints are at `/api/*`:

- `GET /api/health` - Health check
- `GET /api/modules/session` - Get/create user session
- `GET /api/modules/module0` - Get Module 0 data
- `POST /api/modules/module0` - Save Module 0 data
- `POST /api/ai/chat` - AI chat interaction
- `POST /api/ai/audit` - Generate audit review

## What's Next?

After Module 0 MVP is working well:
1. Add Modules 1-4
2. Add final documents generation
3. Add more features as needed

## Troubleshooting

**"Module not found" errors in API functions:**
- Make sure you've run `npm install` in the `api/` directory
- Check that `api/package.json` has all dependencies

**"SUPABASE_URL not set" errors:**
- Check `.env.local` file exists in root directory
- For Vercel, check environment variables are set in dashboard

**API routes return 404:**
- Make sure you're using `vercel dev` not just `npm run dev`
- Check `vercel.json` configuration

**Auth errors:**
- Verify Supabase redirect URLs include your local/dev URLs
- Check that Google OAuth is enabled in Supabase


