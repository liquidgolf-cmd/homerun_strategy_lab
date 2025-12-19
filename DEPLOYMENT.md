# Deployment Guide

This guide covers deploying the Homeruns Strategy Lab application to various platforms.

## Prerequisites

1. Ensure you have all environment variables set:
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `NODE_ENV=production` - Set to production
   - `PORT` - Port number (defaults to 3000)

## Deployment Options

### Option 1: Railway (Recommended for Full-Stack)

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize project: `railway init`
4. Set environment variables:
   ```bash
   railway variables set ANTHROPIC_API_KEY=your_key_here
   railway variables set NODE_ENV=production
   ```
5. Deploy: `railway up`

**Note**: Railway automatically detects the `railway.json` configuration.

### Option 2: Render

1. Go to https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && node dist/server.js`
   - **Environment**: Node
5. Add environment variables in Render dashboard:
   - `ANTHROPIC_API_KEY`
   - `NODE_ENV=production`
   - `PORT=3000`
6. Deploy

**Note**: For Render, you may want to use PostgreSQL instead of SQLite. Update `DATABASE_URL` environment variable if using PostgreSQL.

### Option 3: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t homeruns-strategy-lab .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e ANTHROPIC_API_KEY=your_key_here \
     -e NODE_ENV=production \
     -v $(pwd)/backend/data:/app/backend/data \
     homeruns-strategy-lab
   ```

3. Deploy to any Docker-compatible platform (DigitalOcean, AWS ECS, Google Cloud Run, etc.)

### Option 4: Separate Frontend/Backend Deployment

#### Frontend (Vercel/Netlify)

1. **Build frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npm i -g vercel
   cd frontend
   vercel
   ```
   
   Update `frontend/src/services/api.ts` to point to your backend URL:
   ```typescript
   baseURL: 'https://your-backend-url.com/api'
   ```

3. **Deploy to Netlify**:
   - Connect GitHub repo
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.com`

#### Backend (Railway/Render/Fly.io)

Follow Option 1 or 2 above for backend deployment.

## Database Considerations

### SQLite (Default)
- Works for single-instance deployments
- Data stored in `backend/data/db.sqlite`
- **Note**: Not suitable for multi-instance deployments

### PostgreSQL (Recommended for Production)
1. Update backend to use PostgreSQL:
   ```bash
   npm install pg
   ```
2. Update `backend/src/db/schema.ts` to use PostgreSQL connection
3. Set `DATABASE_URL` environment variable

## Environment Variables

Required environment variables:

- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
- `NODE_ENV` - Set to `production` for production deployments
- `PORT` - Port number (defaults to 3000)
- `DATABASE_URL` - Optional, for PostgreSQL (defaults to SQLite)

## Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test API endpoints at `/api/health`
- [ ] Test module flow end-to-end
- [ ] Verify Anthropic API integration works
- [ ] Check database persistence
- [ ] Set up SSL/HTTPS (usually automatic on most platforms)
- [ ] Configure CORS if needed (currently allows all origins)

## Troubleshooting

### Database Issues
- Ensure `backend/data` directory has write permissions
- For SQLite: Check that the database file is being created
- For PostgreSQL: Verify connection string format

### API Errors
- Check Anthropic API key is valid
- Verify API rate limits haven't been exceeded
- Check server logs for detailed error messages

### Frontend Not Loading
- Verify build completed successfully
- Check that static files are being served correctly
- Verify API base URL is correct

