#!/bin/bash

echo "🚀 Setting up Ready Lawyer Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "Please upgrade Node.js to version 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check the error above."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
# Ready Lawyer Frontend Environment Variables
VITE_CONTRACT_ADDRESS=0x7113C79e62FC58886325314dF173d6A55fC85902
VITE_NETWORK_ID=43114
VITE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
EOF
    echo "✅ .env file created with default values"
    echo "⚠️  Please update the contract addresses after deployment"
else
    echo "✅ .env file already exists"
fi

# Check if contracts are deployed
echo "🔍 Checking contract deployment status..."
if grep -q "0x0000000000000000000000000000000000000000" src/types/index.ts; then
    echo "⚠️  Warning: Some contract addresses are not set"
    echo "   Please update src/types/index.ts after deploying contracts"
else
    echo "✅ Contract addresses are configured"
fi

echo ""
echo "🎉 Setup complete! You can now:"
echo ""
echo "   🚀 Start development server:"
echo "      npm run dev"
echo ""
echo "   🏗️  Build for production:"
echo "      npm run build"
echo ""
echo "   🔍 Run linting:"
echo "      npm run lint"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🔗 The app will be available at: http://localhost:3000"
echo ""
echo "⚠️  Remember to:"
echo "   1. Connect your Web3 wallet (MetaMask)"
echo "   2. Switch to Avalanche C-Chain network"
echo "   3. Update contract addresses after deployment"
echo ""
