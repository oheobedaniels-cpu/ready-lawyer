import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { Scale, Bell, Search, Menu, X, Wifi, WifiOff, Shield, AlertCircle } from 'lucide-react';
import UserProfile from './UserProfile';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const { isConnected, contractsInitialized, chainId } = useWeb3();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock notifications - in production this would come from a notification service
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'System Update',
      message: 'New features have been deployed',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Case Resolved',
      message: 'Your case "Contract Dispute" has been resolved',
      time: '1 day ago',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNetworkInfo = () => {
    if (!isConnected) return { name: 'Not Connected', status: 'disconnected' };
    
    switch (chainId) {
      case 43114:
        return { name: 'Avalanche Mainnet', status: 'connected' };
      case 43113:
        return { name: 'Avalanche Testnet', status: 'connected' };
      default:
        return { name: 'Unknown Network', status: 'warning' };
    }
  };

  const networkInfo = getNetworkInfo();

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Scale className="h-10 w-10 text-primary-600 group-hover:text-primary-700 transition-colors duration-200" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
                  Ready Lawyer
                </span>
                <span className="text-xs text-gray-500 font-medium">Legal Services Platform</span>
              </div>
            </Link>
          </div>

          {/* Center Section - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases, documents, lawyers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section - Status, Notifications, User */}
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
              networkInfo.status === 'connected' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : networkInfo.status === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {networkInfo.status === 'connected' ? (
                <Wifi className="h-4 w-4" />
              ) : networkInfo.status === 'warning' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              <span className="text-xs font-medium">{networkInfo.name}</span>
            </div>

            {/* Contract Status */}
            {isConnected && (
              <div className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                contractsInitialized 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-orange-50 border-orange-200 text-orange-700'
              }`}>
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {contractsInitialized ? 'Smart Contracts Ready' : 'Initializing Contracts...'}
                </span>
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      <button className="text-xs text-primary-600 hover:text-primary-700">Mark all read</button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <Link to="/notifications" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <UserProfile />

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases, documents, lawyers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
