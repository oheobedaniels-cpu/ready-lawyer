# Ready Lawyer Frontend - Deployment Guide

## 🚀 Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- Node.js 18+ installed locally

### Quick Deploy to Vercel

1. **Connect Repository**
   ```bash
   # Clone the repository
   git clone <your-repo-url>
   cd ready-lawyer-new/frontend
   
   # Install dependencies
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file with:
   ```env
   VITE_APP_TITLE=Ready Lawyer
   VITE_APP_DESCRIPTION=Legal Services Platform on Avalanche C-Chain
   VITE_MAIN_CONTRACT_ADDRESS=0x7113C79e62FC58886325314dF173d6A55fC85902
   VITE_AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
   VITE_AVALANCHE_TESTNET_RPC=https://api.avax-test.network/ext/bc/C/rpc
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   
   # Follow the prompts and deploy
   ```

### Vercel Dashboard Configuration

1. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Environment Variables** (in Vercel Dashboard)
   ```
   VITE_APP_TITLE=Ready Lawyer
   VITE_APP_DESCRIPTION=Legal Services Platform on Avalanche C-Chain
   VITE_MAIN_CONTRACT_ADDRESS=0x7113C79e62FC58886325314dF173d6A55fC85902
   VITE_AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
   VITE_AVALANCHE_TESTNET_RPC=https://api.avax-test.network/ext/bc/C/rpc
   ```

3. **Domain Configuration**
   - Add custom domain if needed
   - Configure SSL certificates

## 🌐 Other Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

### AWS S3 + CloudFront
1. Build the project: `npm run build`
2. Upload `dist` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Build Optimization

### Production Build
```bash
# Optimized production build
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### Environment-Specific Builds
```bash
# Development
npm run dev

# Staging
npm run build:staging

# Production
npm run build:production
```

## 📱 Performance Optimization

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev @rollup/plugin-visualizer

# Analyze bundle
npm run build:analyze
```

### Image Optimization
- Use WebP format for images
- Implement lazy loading
- Optimize image sizes

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable system
- Validate environment variables at runtime

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https: wss:;">
```

### HTTPS Enforcement
- Force HTTPS in production
- Configure HSTS headers
- Use secure cookies

## 📊 Monitoring & Analytics

### Performance Monitoring
- Vercel Analytics
- Web Vitals tracking
- Error monitoring (Sentry)

### User Analytics
- Google Analytics 4
- Privacy-compliant tracking
- Performance metrics

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf node_modules package-lock.json
   npm install
   
   # Check Node.js version
   node --version
   ```

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable naming (VITE_ prefix)
   - Restart deployment after changes

3. **Routing Issues**
   - Ensure `vercel.json` is configured
   - Check SPA fallback configuration
   - Verify build output directory

### Support
- Check Vercel documentation
- Review build logs
- Test locally before deploying

## 🔄 Continuous Deployment

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Automatic Deployments
- Enable auto-deploy on push to main
- Configure preview deployments for PRs
- Set up staging environment

## 📈 Post-Deployment

### Health Checks
- Verify all routes work
- Test wallet connections
- Check contract interactions
- Validate responsive design

### Performance Testing
- Lighthouse audits
- Core Web Vitals
- Mobile performance
- Load testing

### User Testing
- Cross-browser testing
- Mobile device testing
- Accessibility testing
- User acceptance testing

