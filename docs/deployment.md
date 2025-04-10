# Deployment Documentation

## Overview
This document outlines the deployment process and configuration for the Neema application. The application is built using Vite and can be deployed to various platforms.

## Build Process

### 1. Production Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### 2. Environment Configuration
```env
# .env.production
VITE_API_URL=https://api.neema.com
VITE_CLERK_PUBLISHABLE_KEY=your_production_key
```

## Deployment Options

### 1. Vercel Deployment
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api-server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## CI/CD Pipeline

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

### 2. Environment Variables
```bash
# Required environment variables
VITE_API_URL=https://api.neema.com
VITE_CLERK_PUBLISHABLE_KEY=your_key
```

## Performance Optimization

### 1. Build Optimization
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-*'],
        },
      },
    },
  },
})
```

### 2. Caching Configuration
```typescript
// src/lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    },
  },
})
```

## Monitoring and Analytics

### 1. Error Tracking
```typescript
// src/lib/error-tracking.ts
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})
```

### 2. Performance Monitoring
```typescript
// src/lib/performance-monitoring.ts
import { getCLS, getFID, getLCP } from 'web-vitals'

function sendToAnalytics({ name, delta, id }) {
  // Send to analytics service
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getLCP(sendToAnalytics)
```

## Security Considerations

### 1. Security Headers
```nginx
# nginx.conf
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
```

### 2. CORS Configuration
```typescript
// src/lib/api-client.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})
```

## Backup and Recovery

### 1. Database Backup
```bash
# Backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --out "$BACKUP_DIR/$DATE"
```

### 2. Recovery Process
```bash
# Recovery script
#!/bin/bash
BACKUP_DIR="/backups"
LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -1)
mongorestore "$BACKUP_DIR/$LATEST_BACKUP"
```

## Best Practices

### 1. Deployment
- Use environment-specific configurations
- Implement proper error handling
- Set up monitoring and alerts
- Regular security audits

### 2. Performance
- Implement proper caching
- Optimize assets
- Use CDN for static content
- Monitor performance metrics

### 3. Security
- Keep dependencies updated
- Implement proper authentication
- Use HTTPS
- Regular security scans

## Future Enhancements

### 1. Planned Features
- Automated deployment pipeline
- Enhanced monitoring
- Better error tracking
- Performance optimization

### 2. Improvements
- Better backup strategy
- Enhanced security measures
- Improved monitoring
- Better scaling options 