import React from 'react';
import { useNotifications } from './NotificationSystem';

const NavbarDemo: React.FC = () => {
  const { showInfo, showSuccess, showWarning, showError } = useNotifications();

  const handleTestNotifications = () => {
    showInfo('Demo Info', 'This is an informational notification');
    setTimeout(() => showSuccess('Demo Success', 'This is a success notification'), 1000);
    setTimeout(() => showWarning('Demo Warning', 'This is a warning notification'), 2000);
    setTimeout(() => showError('Demo Error', 'This is an error notification'), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Navbar & Header Demo</h2>
        <p className="text-gray-600">
          Test the enhanced navbar and header components with various features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Features Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">New Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Enhanced Header with Search Bar</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Smart Contract Status Indicators</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Network Connection Status</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Notification System</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Enhanced User Profile Menu</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Breadcrumb Navigation</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Improved Mobile Experience</span>
            </li>
          </ul>
        </div>

        {/* Interactive Demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Interactive Demo</h3>
          
          <div className="space-y-3">
            <button
              onClick={handleTestNotifications}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Test Notification System
            </button>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Click the button above to test different notification types</p>
              <p>• Try connecting/disconnecting your wallet</p>
              <p>• Test the mobile menu on smaller screens</p>
              <p>• Use the search bar in the header</p>
              <p>• Explore the user profile dropdown</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Header:</span>
                <span className="text-green-600 font-medium">✓ Enhanced</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Navigation:</span>
                <span className="text-green-600 font-medium">✓ Responsive</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User Profile:</span>
                <span className="text-green-600 font-medium">✓ Interactive</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Notifications:</span>
                <span className="text-green-600 font-medium">✓ System Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Usage Instructions</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>1. Header Component:</strong> Includes logo, search bar, network status, contract status, and notifications</p>
          <p><strong>2. Navigation Component:</strong> Provides main navigation with breadcrumbs and mobile menu</p>
          <p><strong>3. UserProfile Component:</strong> Handles wallet connection and user menu</p>
          <p><strong>4. NotificationSystem Component:</strong> Manages system-wide notifications</p>
          <p><strong>5. Layout Component:</strong> Orchestrates all components and provides footer</p>
        </div>
      </div>
    </div>
  );
};

export default NavbarDemo;
