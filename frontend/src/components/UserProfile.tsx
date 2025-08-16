import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { User, Settings, LogOut, Wallet, Shield, ChevronDown, Copy, ExternalLink, UserCheck, Building2 } from 'lucide-react';
import { shortenAddress } from '../utils/contractUtils';

const UserProfile: React.FC = () => {
  const { account, isConnected, contractsInitialized, connectWallet, disconnectWallet } = useWeb3();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mock user data - in production this would come from user service
  const userProfile = {
    name: 'John Doe',
    role: 'lawyer',
    verified: true,
    avatar: null,
    joinDate: '2024-01-15',
    totalCases: 24,
    successRate: 92,
    rating: 4.8,
    reviews: 18
  };

  const formatAddress = (address: string) => {
    return shortenAddress(address, 6);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'lawyer':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'judge':
        return <UserCheck className="h-4 w-4 text-purple-600" />;
      case 'admin':
        return <Building2 className="h-4 w-4 text-red-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'lawyer':
        return 'Verified Lawyer';
      case 'judge':
        return 'Judge';
      case 'admin':
        return 'Administrator';
      default:
        return 'Client';
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 group"
      >
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          {userProfile.avatar ? (
            <img src={userProfile.avatar} alt={userProfile.name} className="w-8 h-8 rounded-full" />
          ) : (
            <User className="h-4 w-4 text-primary-600" />
          )}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
          <p className="text-xs text-gray-500 font-mono">{formatAddress(account!)}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
          isUserMenuOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* User Dropdown Menu */}
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt={userProfile.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <User className="h-6 w-6 text-primary-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">{userProfile.name}</h3>
                  {userProfile.verified && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      <UserCheck className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {getRoleIcon(userProfile.role)}
                  <span className="text-xs text-gray-500">{getRoleLabel(userProfile.role)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Member since {userProfile.joinDate}</p>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Wallet Address</span>
              </div>
              <button
                onClick={() => copyToClipboard(account!)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-150"
                title="Copy address"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs font-mono text-gray-500 mt-1 break-all">{account}</p>
          </div>

          {/* Contract Status */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Smart Contracts</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                contractsInitialized 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {contractsInitialized ? 'Ready' : 'Initializing...'}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">{userProfile.totalCases}</p>
                <p className="text-xs text-gray-500">Total Cases</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{userProfile.successRate}%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{userProfile.rating}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/profile"
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>View Profile</span>
            </Link>
            <Link
              to="/settings"
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            <a
              href="https://snowtrace.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Explorer</span>
            </a>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={() => {
                disconnectWallet();
                setIsUserMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
