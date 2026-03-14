# Deployment Guide

## Overview

This guide covers deploying the Task Management Application to production using Vercel.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Backend tests passing
- [ ] Frontend tests passing
- [ ] Security review completed
- [ ] README updated
- [ ] API documentation complete
- [ ] Git repository initialized

## Backend Deployment to Vercel (Optional)

### Option 1: Deploy Express Backend to Vercel

**Note**: Since Vercel primarily supports Next.js and serverless functions, you can:
1. Convert Express to Next.js API routes, OR
2. Deploy to Render, Railway, or Heroku instead

### Option 2: Deploy to Render (Recommended for Express)

1. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Sign up and create new account

2. **Connect GitHub Repository**
   - Link your GitHub account
   - Select your repository

3. **Create New Web Service**
   - Name: `task-management-api`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

4. **Configure Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task_management
   JWT_SECRET=your_production_secret_key_change_this
   JWT_EXPIRE=7d
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ENCRYPTION_KEY=your_32_char_encryption_key_here
   ```

5. **Deploy**
   - Click Deploy
   - Render will build and deploy automatically

6. **Note Backend URL**
   - You'll get a URL like: `https://task-management-api.onrender.com`

### Option 3: Deploy to Railway

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Environment Variables**
   - Add all variables from `.env`
   - Railway will auto-detect Node.js

4. **Deploy**
   - Railway auto-deploys on push

## Frontend Deployment to Vercel

### Deploy Next.js Frontend to Vercel

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Import Project"
   - Select your GitHub repository
   - Choose the `frontend` directory as root

3. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```

4. **Deploy**
   - Click Deploy
   - Vercel will automatically build and deploy

5. **Custom Domain (Optional)**
   - Go to Project Settings
   - Add Custom Domain
   - Update DNS records with Vercel

### Update backend CORS for production

In `backend/.env`:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## MongoDB Atlas Setup

### Create MongoDB Cluster

1. **Create Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up free

2. **Create Cluster**
   - Choose AWS, US region
   - Select Shared tier (free)
   - Name it: `task-management`

3. **Create Database**
   - Database name: `task_management`
   - Collections: Will be created automatically

4. **Get Connection String**
   - Go to Cluster > Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` and `<user>`

5. **Add IP to Whitelist**
   - Network Access > Add IP Address
   - Add `0.0.0.0/0` for simplicity (or specific IPs)

**Connection String Format**:
```
mongodb+srv://username:password@cluster.mongodb.net/task_management?retryWrites=true&w=majority
```

## Production Environment Variables

### Backend (.env)

```ini
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task_management?retryWrites=true&w=majority

# JWT
JWT_SECRET=use_a_strong_random_string_at_least_32_chars
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Encryption
ENCRYPTION_KEY=a_random_string_32_characters_long
```

### Frontend (.env.production.local)

```ini
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

## SSL/TLS Certificate

- Vercel automatically provides free SSL certificates
- Railway and Render also handle HTTPS automatically
- No additional configuration needed

## Database Backups

1. **Enable Automated Backups in MongoDB Atlas**
   - Cluster > Backup
   - Enable continuous backups
   - Set retention to 7 days

2. **Manual Backups**
   ```bash
   mongodump --uri "mongodb+srv://username:password@cluster.mongodb.net/task_management"
   ```

## Monitoring & Logging

### Vercel
- Built-in analytics and performance monitoring
- Real-time logs in dashboard

### Render/Railway
- Built-in log viewing
- Performance metrics

### MongoDB Atlas
- Query profiler
- Performance analyzer
- Alerts

## Scaling Considerations

### Current Architecture
- Single Express server
- MongoDB shared tier
- Frontend on Vercel CDN

### For Increased Traffic
1. **Backend**:
   - Upgrade to Render's Standard tier
   - Add Node.js clustering
   - Implement caching (Redis)

2. **Database**:
   - Upgrade MongoDB to M2 tier
   - Add read replicas

3. **Frontend**:
   - Already scaled with Vercel
   - Use image optimization
   - Enable incremental static generation

## Security in Production

### HTTPS
- ✅ Automatic with Vercel, Render, Railway
- ✅ HTTP-only cookies over HTTPS only

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use platform's environment management
- ✅ Rotate secrets regularly

### CORS
- ✅ Configured for production domain
- ✅ Credentials enabled

### Rate Limiting
- Consider adding rate limiting middleware to backend:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Security Headers
- Consider adding helmet.js for security headers:
```javascript
import helmet from 'helmet';

app.use(helmet());
```

## Continuous Integration/Deployment

### GitHub Actions Setup

1. **Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          git push heroku main
          
      - name: Deploy Frontend
        run: |
          npm run build
```

## Troubleshooting

### Backend Not Responding
1. Check MongoDB connection string
2. Verify environment variables
3. Check Render/Railway logs
4. Verify IP whitelist in MongoDB Atlas

### CORS Errors on Frontend
1. Verify `FRONTEND_URL` in backend `.env`
2. Check origin header in requests
3. Clear browser cache

### Authentication Not Working
1. Verify JWT_SECRET is set
2. Check cookie settings (Secure flag for HTTPS)
3. Verify frontend API URL matches backend

### Database Connection Timeout
1. Check MongoDB Atlas IP whitelist
2. Verify connection string
3. Ensure MongoDB cluster is running

## Rollback Procedure

### Vercel
- Deployments > Select previous deployment > Redeploy

### Render
- Manual: Push to different branch and deploy

### MongoDB
- Automated backups available for restore

## Post-Deployment

1. **Test All Features**
   - User registration and login
   - Task CRUD operations
   - Pagination and filtering
   - Search functionality

2. **Performance Check**
   - Test load times
   - Check API response times
   - Monitor database queries

3. **Security Verification**
   - Test unauthorized access
   - Verify HTTPS
   - Check cookie security headers

4. **Monitor Logs**
   - Check for errors
   - Monitor API usage
   - Track performance

## Support & Troubleshooting

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://railway.app/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

**Deployment Date**: _____________
**Backend URL**: _____________
**Frontend URL**: _____________
**Status**: Pending / Deployed ✓
