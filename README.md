# Homerun Strategy Lab - MVP

A simplified MVP version of the Homerun Strategy Lab online course featuring **Module 0: Current Reality** only. Built with Vercel serverless functions for easy deployment.

## Features (MVP)

- ✅ Module 0: Current Reality (At Bat)
- ✅ Dual input methods: AI chat interface or manual forms
- ✅ Automatic audit review document generation
- ✅ Google OAuth authentication via Supabase Auth
- 🚧 Modules 1-4 (coming soon)
- 🚧 Final overview document and 90-day action plan (coming after all modules)

## Architecture

- **Frontend**: React + TypeScript + Vite (deployed to Vercel)
- **Backend**: Vercel Serverless Functions (API routes in `/api` folder)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **AI**: Anthropic Claude API

**All deployed to Vercel** - no separate backend server needed!

## Setup

### Prerequisites

1. **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
2. **Anthropic API Key**: Get your API key from [console.anthropic.com](https://console.anthropic.com)
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

### 1. Supabase Setup

1. Create a new Supabase project
2. Enable Google OAuth provider:
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Add redirect URLs: `http://localhost:5173` (for dev) and your production URL
3. Run the MVP database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase/schema-mvp.sql`
   - Execute the SQL
4. Get your project credentials:
   - Project URL (Settings → API → Project URL)
   - Anon Key (Settings → API → anon public key)
   - Service Role Key (Settings → API → service_role secret key) - **Keep this secret!**

### 2. Local Development

#### Install Dependencies

```bash
npm run install:all
```

#### Set Environment Variables

Create `frontend/.env`:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For local API development, create `.env.local` in the root (used by Vercel CLI):
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

#### Run Development Server

Using Vercel CLI (recommended - runs frontend + API):
```bash
npm install -g vercel
vercel dev
```

Or frontend only (API won't work):
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- API routes at http://localhost:5173/api/*

### 3. Deploy to Vercel

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `ANTHROPIC_API_KEY`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. Update Supabase redirect URLs:
   - Add your Vercel deployment URL to Supabase Auth → URL Configuration → Redirect URLs

## Project Structure

```
homeruns-strategy-lab/
├── api/                      # Vercel serverless functions
│   ├── auth/
│   │   └── verify.ts        # JWT verification helper
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client and DB functions
│   │   └── anthropic.ts     # Anthropic AI service
│   ├── modules/
│   │   ├── session.ts       # GET /api/modules/session
│   │   └── module0.ts       # GET/POST /api/modules/module0
│   ├── ai/
│   │   ├── chat.ts          # POST /api/ai/chat
│   │   └── audit.ts         # POST /api/ai/audit
│   └── health.ts            # GET /api/health
├── frontend/                 # React frontend
│   └── src/
│       ├── components/      # React components
│       ├── services/
│       │   └── api.ts       # API client
│       └── ...
├── supabase/
│   └── schema-mvp.sql       # Database schema (Module 0 only)
└── vercel.json              # Vercel configuration
```

## API Endpoints

All endpoints require authentication (Bearer token in Authorization header).

- `GET /api/health` - Health check
- `GET /api/modules/session` - Get or create user session
- `GET /api/modules/module0` - Get Module 0 response
- `POST /api/modules/module0` - Save Module 0 response (AI or Form data)
- `POST /api/ai/chat` - AI chat interaction
- `POST /api/ai/audit` - Generate audit review for Module 0

## Environment Variables

### Vercel Environment Variables (Serverless Functions)

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server-side operations)
- `ANTHROPIC_API_KEY` - Anthropic API key
- `ANTHROPIC_CHAT_MODEL` - (Optional) Anthropic model for chat. Default: `claude-sonnet-4-20250514` (recommended). Options: `claude-sonnet-4-20250514`, `claude-haiku-4-5-20251001`
- `ANTHROPIC_AUDIT_MODEL` - (Optional) Anthropic model for audit reviews. Default: `claude-sonnet-4-20250514` (recommended). Options: `claude-sonnet-4-20250514`, `claude-haiku-4-5-20251001`

### Frontend Environment Variables (Build-time)

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key

## Next Steps (Future)

After MVP is working:
1. Add Modules 1-4
2. Add final documents generation (combined overview + 90-day action plan)
3. Add more features as needed

## Troubleshooting

### Local Development

- **API routes not working**: Make sure you're using `vercel dev` instead of `npm run dev`
- **Auth errors**: Check that Supabase redirect URLs include `http://localhost:5173`
- **Database errors**: Verify you've run `supabase/schema-mvp.sql` in Supabase SQL Editor

### Vercel Deployment

- **Function errors**: Check Vercel logs in the dashboard
- **Env vars not working**: Make sure they're set in Vercel dashboard (not just `.env` file)
- **CORS errors**: Shouldn't happen with Vercel (same domain), but check Supabase CORS settings

## License

ISC
