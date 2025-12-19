# Fix for Vercel Deployment Error

## The Problem

The build is failing because `better-sqlite3` requires C++20 compilation, but Vercel's default Node 24 build environment doesn't have it configured.

Error: `error: #error "C++20 or later required."`

## Solution

Updated `vercel.json` to:
1. Use Node 18 (compatible with better-sqlite3)
2. Configure proper build commands
3. Set up correct routing

## Alternative Solutions

### Option 1: Use PostgreSQL (Recommended for Production)

SQLite isn't ideal for serverless/Vercel. Consider switching to PostgreSQL:

1. Add PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Update `backend/src/db/schema.ts` to use `pg` instead of `better-sqlite3`
3. Update environment variables

### Option 2: Use a Different Platform

- **Railway**: Better for SQLite (persistent storage)
- **Render**: Supports SQLite with persistent disks
- **Fly.io**: Good for Docker deployments with SQLite

### Option 3: Use a Managed SQLite Service

- Turso (libSQL)
- Cloudflare D1
- SQLiteCloud

## Current Fix

The `vercel.json` has been updated to use Node 18. This should allow the build to succeed.

However, **SQLite on Vercel is still problematic** because:
- Vercel is serverless (no persistent file system)
- Each function invocation gets a fresh environment
- SQLite database file won't persist

**Recommendation**: Switch to PostgreSQL or deploy to Railway/Render for proper SQLite support.

