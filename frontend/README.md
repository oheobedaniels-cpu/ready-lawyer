# Ready Lawyer Frontend

A modern React + TypeScript frontend for the Ready Lawyer decentralized legal services platform, built on the Avalanche blockchain.

## 🚀 Features

- **Modern UI/UX**: Built with React 18, TypeScript, and Tailwind CSS
- **Web3 Integration**: Full wallet connection and smart contract interaction
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live blockchain data and transaction status
- **Professional Interface**: Clean, intuitive design for legal professionals

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js v6
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet
- Avalanche C-Chain network access

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_CONTRACT_ADDRESS=0x7113C79e62FC58886325314dF173d6A55fC85902
VITE_NETWORK_ID=43114
VITE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
```

### Contract Addresses

Update contract addresses in `src/types/index.ts` after deployment:

```typescript
export const CONTRACT_ADDRESSES = {
  MAIN_CONTRACT: '0x7113C79e62FC58886325314dF173d6A55fC85902',
  READY_ROLES: '0x...', // Deployed contract address
  READY_DOCS: '0x...',  // Deployed contract address
  READY_ESCROW: '0x...', // Deployed contract address
  READY_FUND: '0x...',   // Deployed contract address
  READY_LISTINGS: '0x...', // Deployed contract address
} as const;
```

## 📱 Pages & Features

### 1. Home (`/`)
- Platform overview and features
- Call-to-action for new users
- Feature highlights and benefits

### 2. Dashboard (`/dashboard`)
- User activity overview
- Quick actions and statistics
- Recent transactions and cases

### 3. Verification (`/verification`)
- Lawyer and judge verification requests
- Status tracking and updates
- Credential submission forms

### 4. Documents (`/documents`)
- Legal document management
- Version control and tracking
- Document creation and updates

### 5. Escrow (`/escrow`)
- Case management and funding
- Escrow payment processing
- Dispute resolution interface

### 6. Fundraising (`/fundraising`)
- Legal case crowdfunding
- Campaign creation and management
- Contribution tracking

### 7. Marketplace (`/marketplace`)
- Lawyer listings and discovery
- Case signal posting
- Search and filtering

## 🔌 Smart Contract Integration

### Web3 Context

The application uses a centralized Web3 context (`src/contexts/Web3Context.tsx`) that provides:

- Wallet connection management
- Network switching (Avalanche C-Chain)
- Provider and signer instances
- Account state management

### Contract Interaction

Each page includes mock data that should be replaced with actual smart contract calls:

```typescript
// Example: Get lawyer verification status
const isLawyer = await readyRoles.isLawyer(account);

// Example: Create document
await readyDocs.createDocument(docId, docType, caseId, initialCid);

// Example: Open escrow case
await readyEscrow.openCase(caseId, lawyer, token, amount, deadline);
```

## 🎨 Customization

### Styling

The application uses Tailwind CSS with custom component classes defined in `src/index.css`:

```css
.btn-primary { @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg; }
.card { @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6; }
.input { @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500; }
```

### Theme Colors

Customize the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        // ... more shades
      }
    }
  }
}
```

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Single-column layouts, collapsible navigation
- **Tablet**: Two-column grids, expanded navigation
- **Desktop**: Multi-column layouts, full navigation

## 🔒 Security Features

- **Wallet Validation**: Ensures users are on Avalanche C-Chain
- **Input Validation**: Form validation with Zod schemas
- **Error Handling**: Comprehensive error handling and user feedback
- **Transaction Safety**: Confirmation dialogs for critical actions

## 🧪 Testing

### Run Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Deploy to Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

## 📚 API Integration

### Smart Contract Functions

The frontend is designed to integrate with these smart contract functions:

#### ReadyRoles
- `requestLawyerVerification(profileURI)`
- `approveLawyer(account, profileURI)`
- `isLawyer(account)`

#### ReadyDocs
- `createDocument(docId, docType, caseId, initialCid)`
- `addVersion(docId, cid)`
- `getVersion(docId, index)`

#### ReadyEscrow
- `openCase(caseId, lawyer, token, amount, deadline)`
- `fundCaseNative(caseId)`
- `acceptCase(caseId)`

#### ReadyFund
- `createCampaign(id, beneficiary, beneficiaryIsLawyer, token, goalAmount, deadline)`
- `contributeNative(id)`
- `finalize(id)`

#### ReadyListings
- `upsertLawyerListing(profileURI, hourlyRate, tags)`
- `createCaseSignal(signalId, caseURI, budgetMin, budgetMax, tags)`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation
- Review the smart contract code
- Open an issue on GitHub
- Contact the development team

## 🔮 Future Enhancements

- **Multi-chain Support**: Ethereum, Polygon, BSC
- **Mobile App**: React Native application
- **Advanced Analytics**: Case tracking and reporting
- **AI Integration**: Smart case matching
- **Video Conferencing**: Built-in legal consultations
- **Document Templates**: Pre-built legal document templates
- **Payment Processing**: Credit card and bank transfer support
- **Multi-language**: Internationalization support

## 📊 Performance Optimization

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Image Optimization**: Optimized images and icons
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker for offline support

## 🔍 SEO & Accessibility

- **Meta Tags**: Dynamic meta tag management
- **Structured Data**: JSON-LD schema markup
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Core Web Vitals optimization
- **Analytics**: Google Analytics integration ready
