import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Building2, Plus, TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const Fundraising: React.FC = () => {
  const { isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'succeeded' | 'failed'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data - replace with actual contract calls
  const campaigns = [
    {
      id: 'camp_001',
      title: 'Criminal Defense Fund',
      beneficiary: '0x1234...5678',
      goal: '15.0',
      raised: '12.5',
      token: 'AVAX',
      status: 'active',
      deadline: '2024-02-15',
      beneficiaryIsLawyer: true,
      contributors: 45
    },
    {
      id: 'camp_002',
      title: 'Family Law Support',
      beneficiary: '0x8765...4321',
      goal: '8.0',
      raised: '8.0',
      token: 'AVAX',
      status: 'succeeded',
      deadline: '2024-01-20',
      beneficiaryIsLawyer: true,
      contributors: 32
    },
    {
      id: 'camp_003',
      title: 'Civil Rights Case',
      beneficiary: '0x9999...8888',
      goal: '25.0',
      raised: '18.2',
      token: 'AVAX',
      status: 'active',
      deadline: '2024-03-01',
      beneficiaryIsLawyer: false,
      contributors: 78
    }
  ];

  const statusTabs = [
    { key: 'all', label: 'All Campaigns', count: campaigns.length },
    { key: 'active', label: 'Active', count: campaigns.filter(c => c.status === 'active').length },
    { key: 'succeeded', label: 'Succeeded', count: campaigns.filter(c => c.status === 'succeeded').length },
    { key: 'failed', label: 'Failed', count: campaigns.filter(c => c.status === 'failed').length }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Active' };
      case 'succeeded':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Succeeded' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Failed' };
      case 'payoutReady':
        return { icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Payout Ready' };
      default:
        return { icon: Clock, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Unknown' };
    }
  };

  const getProgressPercentage = (raised: string, goal: string) => {
    return Math.min((parseFloat(raised) / parseFloat(goal)) * 100, 100);
  };

  const filteredCampaigns = activeTab === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.status === activeTab);

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your wallet to access fundraising services</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Fundraising</h1>
          <p className="text-gray-600 mt-1">
            Support legal cases and access justice through community crowdfunding
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6">
        {filteredCampaigns.map((campaign) => {
          const statusInfo = getStatusInfo(campaign.status);
          const StatusIcon = statusInfo.icon;
          const progressPercentage = getProgressPercentage(campaign.raised, campaign.goal);
          
          return (
            <div key={campaign.id} className="card hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${statusInfo.bgColor}`}>
                      <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {campaign.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Campaign ID: {campaign.id}</span>
                        <span>Beneficiary: {campaign.beneficiary}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.beneficiaryIsLawyer 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {campaign.beneficiaryIsLawyer ? 'Lawyer' : 'Client'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {campaign.status === 'active' && (
                      <button className="btn-primary text-sm px-3 py-1">
                        Contribute
                      </button>
                    )}
                    <button className="btn-outline text-sm px-3 py-1">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {campaign.raised} / {campaign.goal} {campaign.token}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{progressPercentage.toFixed(1)}% funded</span>
                    <span>{campaign.contributors} contributors</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Deadline: {campaign.deadline}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  {campaign.status === 'succeeded' && (
                    <button className="btn-outline text-sm px-3 py-1">
                      Finalize
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="text-center py-20">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'all' 
              ? 'Get started by creating your first fundraising campaign'
              : `No ${activeTab} campaigns found. Create a new campaign to get started.`
            }
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Campaign
          </button>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Fundraising Campaign</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="campaignTitle" className="label">Campaign Title</label>
                <input
                  type="text"
                  id="campaignTitle"
                  className="input"
                  placeholder="Enter campaign title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="beneficiaryAddress" className="label">Beneficiary Address</label>
                <input
                  type="text"
                  id="beneficiaryAddress"
                  className="input"
                  placeholder="0x... (who will receive the funds)"
                  required
                />
              </div>
              
              <div>
                <label className="label">Beneficiary Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="beneficiaryType" value="lawyer" className="mr-2" />
                    <span>Lawyer</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="beneficiaryType" value="client" className="mr-2" />
                    <span>Client</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="goalAmount" className="label">Goal Amount (AVAX)</label>
                <input
                  type="number"
                  id="goalAmount"
                  className="input"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="campaignDeadline" className="label">Campaign Deadline</label>
                <input
                  type="date"
                  id="campaignDeadline"
                  className="input"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fundraising;
