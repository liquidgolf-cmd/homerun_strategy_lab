# Quick Fix for 404 Errors

## Most Common Issue: Backend Not Running

If you're seeing 404 errors, the backend is likely not running.

### Fix:

```bash
# Terminal 1 - Start Backend
cd backend
npm install  # if not done already
npm run dev

# Terminal 2 - Start Frontend  
cd frontend
npm install  # if not done already
npm run dev
```

Then open: `http://localhost:3001`

## Other Common Issues

### Issue: API calls returning 404

**Check**: Is backend running on port 3000?
```bash
curl http://localhost:3000/api/health
```

Should return: `{"status":"ok"}`

### Issue: React Router routes not working

This happens in production. The fix is already in `server.ts` - make sure API routes come before the catch-all route.

### Issue: Module page showing 404

**Check**: 
1. Is session created? (Check browser localStorage)
2. Is the module number valid? (0-4)
3. Check browser console for errors

## Still Getting 404?

Run the diagnostic script:
```bash
./test-api.sh
```

Or manually check:
1. Backend running? → `curl http://localhost:3000/api/health`
2. Frontend running? → Open `http://localhost:3001`
3. Check browser console (F12) for errors
4. Check backend terminal for errors




