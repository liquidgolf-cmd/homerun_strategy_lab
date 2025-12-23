# How to Start the Backend Server

## The Problem

The **backend server is not running**, which is why you're getting 500 errors.

## Solution: Start Both Servers

### Option 1: Start Both Together (Recommended)

From the **project root** directory:

```bash
npm run dev
```

This starts:
- ✅ Backend on http://localhost:3000
- ✅ Frontend on http://localhost:3001

### Option 2: Start Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:3001/
```

## Verify It's Working

1. **Check backend health:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Open the app:**
   - Go to http://localhost:3001
   - Try creating a session

## If Backend Won't Start

### Error: "Cannot find module"
```bash
cd backend
npm install
npm run dev
```

### Error: "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then start again
cd backend
npm run dev
```

### Error: Database errors
The database will auto-create on first run. Make sure `backend/data/` directory can be written to.

## Keep Both Servers Running

**Important:** Both servers must be running for the app to work:
- ✅ Backend: Handles API requests (creates sessions, saves data)
- ✅ Frontend: Serves the React app (the UI you see)

If you stop either server, refresh your browser - you'll get errors.




