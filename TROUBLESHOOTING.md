# Troubleshooting 404 Errors

## Common 404 Issues and Solutions

### 1. Backend Not Running

**Symptom**: All API calls return 404

**Solution**:
```bash
cd backend
npm install
npm run dev
```

The backend should start on `http://localhost:3000`

### 2. Frontend API Calls Failing

**Symptom**: Frontend shows errors in browser console about API calls

**Check**:
- Is backend running on port 3000?
- Check browser console for actual error messages
- Verify proxy is configured in `vite.config.ts`

### 3. React Router Routes Not Working in Production

**Symptom**: Direct URLs (like `/module/1`) return 404 in production

**Solution**: The catch-all route in `server.ts` should handle this. Verify it's set up correctly:
- API routes (`/api/*`) should come first
- Static file serving should come after API routes
- Catch-all route (`*`) should serve `index.html` for all non-API routes

### 4. Module Routes Returning 404

**Symptom**: Clicking on modules shows 404

**Check**:
- Is the session created? Check localStorage for 'session' key
- Check browser console for API errors
- Verify the module number is valid (0-4)

### 5. API Endpoint Not Found

**Symptom**: Specific API endpoints return 404

**Check the endpoint exists**:
- `/api/health` - Health check
- `/api/modules/session` - POST to create session
- `/api/modules/session/:sessionId` - GET session
- `/api/modules/session/:sessionId/module/:moduleNumber` - GET/POST module response
- `/api/ai/chat` - POST for AI chat
- `/api/ai/audit-review` - POST to generate audit review
- `/api/documents/session/:sessionId/generate` - POST to generate final documents

### 6. Development vs Production

**Development**:
- Frontend runs on port 3001 with proxy to backend on 3000
- Vite handles routing via proxy

**Production**:
- Single server serves both frontend and backend
- Backend serves static files from `backend/public/`
- All non-API routes serve `index.html` for React Router

## Quick Diagnostics

### Test Backend Health:
```bash
curl http://localhost:3000/api/health
```
Should return: `{"status":"ok"}`

### Test API in Browser:
Open browser console and run:
```javascript
fetch('/api/health').then(r => r.json()).then(console.log)
```

### Check Server Logs:
Look at the backend terminal for error messages when making requests.

### Check Browser Console:
Open DevTools (F12) → Console tab to see JavaScript errors and network failures.

## Common Fixes

### Fix 1: Clear Browser Cache
```bash
# Or use browser DevTools → Application → Clear Storage
```

### Fix 2: Rebuild Everything
```bash
# Frontend
cd frontend
rm -rf node_modules dist
npm install
npm run build

# Backend  
cd ../backend
rm -rf node_modules dist
npm install
npm run build
```

### Fix 3: Check Environment Variables
Ensure `.env` file exists in backend directory:
```
ANTHROPIC_API_KEY=your_key_here
NODE_ENV=development
PORT=3000
```

### Fix 4: Verify Database Initialization
The database should auto-create on first run. Check `backend/data/db.sqlite` exists.

## Still Having Issues?

1. Check the exact URL giving the 404
2. Check browser console for errors
3. Check backend terminal for errors
4. Verify both frontend and backend are running
5. Try accessing `/api/health` directly in browser




