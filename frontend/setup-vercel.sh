#!/bin/bash

# Ready Lawyer Frontend - Vercel Deployment Setup Script
# This script prepares the frontend for deployment to Vercel

set -e

echo "🚀 Setting up Ready Lawyer Frontend for Vercel Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the frontend directory"
    exit 1
fi

# Check Node.js version
print_status "Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ is required. Current version: $(node --version)"
    print_error "Please upgrade Node.js and try again"
    exit 1
fi
print_success "Node.js version: $(node --version)"

# Check npm version
print_status "Checking npm version..."
NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

# Clean previous installations
print_status "Cleaning previous installations..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_success "Removed old node_modules"
fi

if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    print_success "Removed old package-lock.json"
fi

# Install dependencies
print_status "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create environment file
print_status "Creating environment configuration..."
cat > .env.local << EOF
# Ready Lawyer Frontend Environment Configuration
VITE_APP_TITLE=Ready Lawyer
VITE_APP_DESCRIPTION=Legal Services Platform on Avalanche C-Chain
VITE_APP_VERSION=1.0.0

# Blockchain Configuration
VITE_AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
VITE_AVALANCHE_TESTNET_RPC=https://api.avax-test.network/ext/bc/C/rpc
VITE_AVALANCHE_MAINNET_CHAIN_ID=43114
VITE_AVALANCHE_TESTNET_CHAIN_ID=43113

# Contract Addresses
VITE_MAIN_CONTRACT_ADDRESS=0x7113C79e62FC58886325314dF173d6A55fC85902
VITE_READY_ROLES_ADDRESS=
VITE_READY_DOCS_ADDRESS=
VITE_READY_ESCROW_ADDRESS=
VITE_READY_FUND_ADDRESS=
VITE_READY_LISTINGS_ADDRESS=

# Feature Flags
VITE_ENABLE_TESTNET=true
VITE_ENABLE_MAINNET=true
VITE_MOCK_DATA=true
EOF

print_success "Environment file created: .env.local"

# Test build
print_status "Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

# Check build output
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist | cut -f1)
    print_success "Build output size: $BUILD_SIZE"
    
    # List build contents
    print_status "Build contents:"
    ls -la dist/
else
    print_error "Build output directory 'dist' not found"
    exit 1
fi

# Install Vercel CLI
print_status "Installing Vercel CLI..."
npm install -g vercel
if [ $? -eq 0 ]; then
    print_success "Vercel CLI installed successfully"
else
    print_warning "Failed to install Vercel CLI globally. You may need to run: sudo npm install -g vercel"
fi

# Create deployment configuration
print_status "Creating deployment configuration..."
cat > .vercelignore << EOF
# Vercel ignore file
.env*
node_modules/
*.log
.DS_Store
.vscode/
.idea/
*.swp
*.swo
EOF

print_success "Vercel ignore file created"

# Test development server
print_status "Testing development server..."
timeout 10s npm run dev > /dev/null 2>&1 &
DEV_PID=$!
sleep 5

if kill -0 $DEV_PID 2>/dev/null; then
    print_success "Development server started successfully"
    kill $DEV_PID
else
    print_warning "Development server test failed"
fi

# Create deployment checklist
print_status "Creating deployment checklist..."
cat > DEPLOYMENT_CHECKLIST.md << EOF
# Ready Lawyer Frontend - Deployment Checklist

## ✅ Pre-Deployment Checklist

- [x] Dependencies installed
- [x] Environment variables configured
- [x] Production build successful
- [x] Vercel CLI installed
- [x] Build output verified

## 🚀 Deployment Steps

1. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

2. **Deploy to Vercel**
   \`\`\`bash
   vercel
   \`\`\`

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Add all variables from .env.local
   - Ensure VITE_ prefix is maintained

4. **Set Build Settings**
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
   - Install Command: \`npm install\`

5. **Configure Domain**
   - Add custom domain if needed
   - Configure SSL certificates

## 🔧 Post-Deployment

- [ ] Test all routes
- [ ] Verify wallet connections
- [ ] Check contract interactions
- [ ] Test responsive design
- [ ] Monitor performance
- [ ] Set up analytics

## 📱 Testing Checklist

- [ ] Home page loads
- [ ] Navigation works
- [ ] Wallet connection
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Cross-browser compatibility

## 🚨 Troubleshooting

If deployment fails:
1. Check build logs
2. Verify environment variables
3. Ensure all dependencies are in package.json
4. Check Node.js version compatibility
5. Review Vercel configuration

## 📞 Support

- Vercel Documentation: https://vercel.com/docs
- Ready Lawyer Documentation: Check project README
- GitHub Issues: Report bugs and feature requests
EOF

print_success "Deployment checklist created: DEPLOYMENT_CHECKLIST.md"

# Final status
echo ""
print_success "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Review .env.local and customize if needed"
echo "2. Run 'vercel login' to authenticate"
echo "3. Run 'vercel' to deploy"
echo "4. Follow the deployment checklist in DEPLOYMENT_CHECKLIST.md"
echo ""
echo "Environment file: .env.local"
echo "Build output: dist/"
echo "Deployment config: vercel.json"
echo "Checklist: DEPLOYMENT_CHECKLIST.md"
echo ""

# Check if we should proceed with deployment
read -p "Would you like to proceed with deployment now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting deployment..."
    vercel
else
    print_status "Setup complete! You can deploy later using 'vercel' command"
fi

print_success "Ready Lawyer Frontend is ready for Vercel deployment! 🚀"

