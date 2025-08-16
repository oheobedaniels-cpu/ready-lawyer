import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  FileText, 
  Shield, 
  Users, 
  Building2, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar
} from 'lucide-react';
import { dataService } from '../services';
import { DashboardStats, LegalCase } from '../types';

const Dashboard: React.FC = () => {
  const { isConnected, contractsInitialized } = useWeb3();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<LegalCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (isConnected) {
        try {
          const [dashboardStats, deadlines] = await Promise.all([
            dataService.getDashboardStats(),
            dataService.getUpcomingDeadlines(5)
          ]);
          setStats(dashboardStats);
          setUpcomingDeadlines(deadlines);
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-500 mb-6">Connect your wallet to view your dashboard and manage your legal cases.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-medium text-blue-800 mb-2">What you'll get access to:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• View and manage your legal cases</li>
              <li>• Track document uploads and updates</li>
              <li>• Monitor fundraising campaigns</li>
              <li>• Access to legal marketplace</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    change 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ComponentType<{ className?: string }>; 
    color: string; 
    change?: string; 
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityCard = ({ activity }: { activity: any }) => {
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'case_created': return <FileText className="h-4 w-4 text-blue-500" />;
        case 'document_uploaded': return <FileText className="h-4 w-4 text-green-500" />;
        case 'payment_received': return <DollarSign className="h-4 w-4 text-green-500" />;
        case 'deadline_approaching': return <Clock className="h-4 w-4 text-orange-500" />;
        case 'verification_approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
        default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
      }
    };

    const getActivityColor = (type: string) => {
      switch (type) {
        case 'case_created': return 'bg-blue-50 border-blue-200';
        case 'document_uploaded': return 'bg-green-50 border-green-200';
        case 'payment_received': return 'bg-green-50 border-green-200';
        case 'deadline_approaching': return 'bg-orange-50 border-orange-200';
        case 'verification_approved': return 'bg-green-50 border-green-200';
        default: return 'bg-gray-50 border-gray-200';
      }
    };

    return (
      <div className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
        {getActivityIcon(activity.type)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-600">{activity.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(activity.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your legal cases.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Connected to Avalanche</span>
          </div>
          {contractsInitialized && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">Smart Contracts Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={Shield}
          color="bg-blue-500"
          change="+12% this month"
        />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-purple-500"
          change="+8% this month"
        />
        <StatCard
          title="Documents"
          value={stats.totalDocuments}
          icon={FileText}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <FileText className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-gray-700">Upload Document</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Users className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-gray-700">Find Lawyer</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Building2 className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-gray-700">Start Campaign</span>
          </button>
        </div>
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
          <button className="w-full mt-4 p-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All Activity
          </button>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((legalCase) => {
                const daysUntilDeadline = Math.ceil((legalCase.deadline - Date.now()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysUntilDeadline <= 3;
                const bgColor = isUrgent ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200';
                const textColor = isUrgent ? 'text-orange-600' : 'text-blue-600';
                
                return (
                  <div key={legalCase.id} className={`flex items-center justify-between p-3 ${bgColor} rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <Calendar className={`h-5 w-5 ${isUrgent ? 'text-orange-500' : 'text-blue-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{legalCase.title}</p>
                        <p className="text-xs text-gray-600">{legalCase.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${textColor}`}>
                        Due in {daysUntilDeadline} {daysUntilDeadline === 1 ? 'day' : 'days'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(legalCase.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No upcoming deadlines</p>
              </div>
            )}
          </div>
          <button className="w-full mt-4 p-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All Deadlines
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 relative">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={`${(stats.completedCases / stats.totalCases) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {Math.round((stats.completedCases / stats.totalCases) * 100)}%
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">Success Rate</p>
            <p className="text-xs text-gray-500">{stats.completedCases} of {stats.totalCases} cases</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 relative">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={`${(stats.activeCases / stats.totalCases) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {Math.round((stats.activeCases / stats.totalCases) * 100)}%
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">Active Cases</p>
            <p className="text-xs text-gray-500">{stats.activeCases} currently active</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 relative">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeDasharray={`${(stats.totalRevenue / 200000) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  ${(stats.totalRevenue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">Revenue</p>
            <p className="text-xs text-gray-500">This year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
