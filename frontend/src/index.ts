// Main App
export { default as App } from './App';

// Components
export { default as Layout } from './components/Layout';
export { 
  Header, 
  Navigation, 
  UserProfile, 
  NotificationSystem, 
  useNotifications,
  NavbarDemo 
} from './components';

// Pages
export { default as Home } from './pages/Home';
export { default as Dashboard } from './pages/Dashboard';
export { default as Documents } from './pages/Documents';
export { default as Escrow } from './pages/Escrow';
export { default as Fundraising } from './pages/Fundraising';
export { default as Marketplace } from './pages/Marketplace';
export { default as Verification } from './pages/Verification';

// Contexts
export { Web3Provider, useWeb3 } from './contexts/Web3Context';

// Services
export * from './services';

// Types
export * from './types';

// Data
export * from './data/dummyData';
