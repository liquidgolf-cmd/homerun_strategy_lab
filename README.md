# Homeruns Strategy Lab

A standalone web application for delivering the Homeruns Strategy Lab online course with 5 modules, featuring AI-guided interviews and manual workbook options.

## Features

- 5 sequential modules (0-4) covering the HomeRun methodology
- Dual input methods: AI chat interface or manual forms
- Automatic audit review document generation for each module
- Final overview document and 90-day action plan generation
- Google OAuth authentication via Supabase Auth
- Loam Strategy branding

## Setup

### Prerequisites

1. **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
2. **Anthropic API Key**: Get your API key from [console.anthropic.com](https://console.anthropic.com)

### 1. Supabase Setup

1. Create a new Supabase project
2. Enable Google OAuth provider:
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Add redirect URLs: `http://localhost:5173` (for dev) and your production URL
3. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase_schema.sql`
   - Execute the SQL
4. Get your project credentials:
   - Project URL (Settings → API → Project URL)
   - Anon Key (Settings → API → anon public key)
   - Service Role Key (Settings → API → service_role secret key) - **Keep this secret!**

### 2. Environment Variables

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add:
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - ANTHROPIC_API_KEY
```

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env and add:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

### 3. Install Dependencies

```bash
npm run install:all
```

### 4. Run Development Servers

```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3000
- Frontend on http://localhost:5173

### 5. Access the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign in with Google"
3. Complete the Google OAuth flow
4. You'll be redirected back and can start the course

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your backend API URL)
4. Deploy

### Backend (Railway/Render/Similar)

1. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `NODE_ENV=production`
   - `PORT` (auto-set by platform)
2. Deploy backend
3. Update `VITE_API_URL` in Vercel to point to your backend

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth (Google OAuth)
- AI: Anthropic Claude API
- Deployment: Vercel (Frontend) + Railway/Render (Backend)

