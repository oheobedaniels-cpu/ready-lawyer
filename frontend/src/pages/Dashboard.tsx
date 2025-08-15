import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  FileText, 
  Shield, 
  Users, 
  Building2, 
  Scale, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isConnected, account } = useWeb3();

  // Mock data - replace with actual contract calls
  const stats = [
    { label: 'Active Cases', value: '3', icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Documents', value: '12', icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Lawyers', value: '8', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Campaigns', value: '2', icon: Building2, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ];

  const recentActivities = [
    { type: 'Case Opened', description: 'Case #001 - Contract Dispute', time: '2 hours ago', status: 'pending' },
    { type: 'Document Added', description: 'Contract v2.1 uploaded', time: '1 day ago', status: 'completed' },
    { type: 'Payment Received', description: 'AVAX 0.5 for Case #002', time: '2 days ago', status: 'completed' },
    { type: 'Lawyer Verified', description: 'John Doe approved', time: '3 days ago', status: 'completed' },
  ];

  const quickActions = [
    { name: 'Open New Case', href: '/escrow', icon: Plus, color: 'bg-blue-600' },
    { name: 'Upload Document', href: '/documents', icon: FileText, color: 'bg-green-600' },
    { name: 'Find Lawyer', href: '/marketplace', icon: Users, color: 'bg-purple-600' },
    { name: 'Create Campaign', href: '/fundraising', icon: Building2, color: 'bg-orange-600' },
  ];

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your wallet to view your dashboard</p>
        <Link to="/" className="btn-primary">
          Go to Home
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === 'pending') {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your legal services.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">Connected as:</span>
          <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded mt-1">
            {account}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-center`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <span className="font-medium">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(activity.status)}
                <div>
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Network Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Network Status</h2>
            <p className="text-gray-600 mt-1">Avalanche C-Chain</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Connected</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Gas Price:</span>
            <span className="ml-2 font-mono">25 Gwei</span>
          </div>
          <div>
            <span className="text-gray-500">Block Height:</span>
            <span className="ml-2 font-mono">32,456,789</span>
          </div>
          <div>
            <span className="text-gray-500">Network:</span>
            <span className="ml-2 font-mono">Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
