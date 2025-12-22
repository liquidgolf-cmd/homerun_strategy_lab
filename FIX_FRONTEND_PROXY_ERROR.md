# Fix: Frontend Proxy Error (ECONNREFUSED)

The error `http proxy error: /api/modules/session` with `ECONNREFUSED` means the frontend can't connect to the backend server.

## The Problem

Your frontend is running on port 3002 and trying to proxy API requests to `http://localhost:3000`, but the backend isn't running on port 3000.

## Solution: Start the Backend Server

You need **TWO terminals running**:

### Terminal 1: Backend (must be running!)

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab/backend"
npm run dev
```

**Should see:**
```
Server running on http://localhost:3000
API available at http://localhost:3000/api
```

### Terminal 2: Frontend (already running)

Your frontend is already running on port 3002. That's fine!

## Verify Backend is Running

Test if backend is responding:

```bash
curl http://localhost:3000/api/health
```

Should return: `{"status":"ok"}`

If you get a connection error, the backend isn't running.

## Quick Checklist

- [ ] Backend terminal shows "Server running on http://localhost:3000"
- [ ] `curl http://localhost:3000/api/health` returns `{"status":"ok"}`
- [ ] Frontend terminal shows Vite running (already done ✓)
- [ ] No more `ECONNREFUSED` errors in frontend terminal

## Once Both Are Running

1. Open browser to: http://localhost:3002 (your frontend)
2. Try signing in with Google
3. The proxy errors should stop once backend is running

The frontend will proxy `/api/*` requests to `http://localhost:3000/api/*` automatically.



