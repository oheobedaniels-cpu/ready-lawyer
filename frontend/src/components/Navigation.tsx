import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Shield, FileText, Users, ChevronRight, Briefcase, DollarSign, UserCheck } from 'lucide-react';

interface NavigationProps {
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobileMenuOpen, onMobileMenuClose }) => {
  const location = useLocation();

  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: Home,
      description: 'Platform overview and quick actions'
    },
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Shield,
      description: 'Your legal cases and activities'
    },
    { 
      name: 'Documents', 
      href: '/documents', 
      icon: FileText,
      description: 'Manage legal documents and files'
    },
    { 
      name: 'Escrow', 
      href: '/escrow', 
      icon: Briefcase,
      description: 'Legal case escrow and payments'
    },
    { 
      name: 'Fundraising', 
      href: '/fundraising', 
      icon: DollarSign,
      description: 'Legal funding campaigns'
    },
    { 
      name: 'Marketplace', 
      href: '/marketplace', 
      icon: Users,
      description: 'Find lawyers and legal services'
    },
    { 
      name: 'Verification', 
      href: '/verification', 
      icon: UserCheck,
      description: 'Lawyer verification and credentials'
    },
  ];

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', href: '/', current: location.pathname === '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const navItem = navigation.find(item => item.href === currentPath);
      breadcrumbs.push({
        name: navItem?.name || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        current: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 h-16">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-700 bg-primary-50 border border-primary-200 shadow-sm'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                  }`}
                  title={item.description}
                >
                  <Icon className={`h-4 w-4 transition-colors duration-200 ${
                    isActive ? 'text-primary-700' : 'text-gray-500 group-hover:text-primary-700'
                  }`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 py-3">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center space-x-2">
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                <Link
                  to={breadcrumb.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    breadcrumb.current
                      ? 'text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {breadcrumb.name}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity" onClick={onMobileMenuClose}>
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Navigation</h2>
                <button
                  onClick={onMobileMenuClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-primary-700 bg-primary-50 border border-primary-200'
                          : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                      }`}
                      onClick={onMobileMenuClose}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        isActive ? 'text-primary-700' : 'text-gray-500'
                      }`} />
                      <div className="flex-1">
                        <span className="text-base font-medium">{item.name}</span>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Ready Lawyer Platform</p>
                  <p className="text-xs text-gray-400 mt-1">Legal Services on Blockchain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
