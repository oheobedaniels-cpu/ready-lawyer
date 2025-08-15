import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Shield, Plus, DollarSign, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const Escrow: React.FC = () => {
  const { isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'funded' | 'accepted' | 'resolved'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data - replace with actual contract calls
  const cases = [
    {
      id: 'case_001',
      title: 'Contract Dispute Resolution',
      client: '0x1234...5678',
      lawyer: '0x8765...4321',
      amount: '2.5',
      token: 'AVAX',
      status: 'funded',
      createdAt: '2024-01-15',
      deadline: '2024-02-15'
    },
    {
      id: 'case_002',
      title: 'Employment Law Case',
      client: '0x9999...8888',
      lawyer: '0x7777...6666',
      amount: '1.8',
      token: 'AVAX',
      status: 'accepted',
      createdAt: '2024-01-14',
      deadline: '2024-02-14'
    },
    {
      id: 'case_003',
      title: 'Property Dispute',
      client: '0x5555...4444',
      lawyer: '',
      amount: '3.2',
      token: 'AVAX',
      status: 'open',
      createdAt: '2024-01-13',
      deadline: '2024-02-13'
    }
  ];

  const statusTabs = [
    { key: 'all', label: 'All Cases', count: cases.length },
    { key: 'open', label: 'Open', count: cases.filter(c => c.status === 'open').length },
    { key: 'funded', label: 'Funded', count: cases.filter(c => c.status === 'funded').length },
    { key: 'accepted', label: 'Accepted', count: cases.filter(c => c.status === 'accepted').length },
    { key: 'resolved', label: 'Resolved', count: cases.filter(c => c.status === 'resolved').length }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Open' };
      case 'funded':
        return { icon: DollarSign, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Funded' };
      case 'accepted':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Accepted' };
      case 'resolved':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Resolved' };
      case 'disputed':
        return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Disputed' };
      default:
        return { icon: Clock, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Unknown' };
    }
  };

  const filteredCases = activeTab === 'all' 
    ? cases 
    : cases.filter(caseItem => caseItem.status === activeTab);

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your wallet to access escrow services</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Escrow Management</h1>
          <p className="text-gray-600 mt-1">
            Manage legal cases with secure escrow payments and automated dispute resolution
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Open New Case</span>
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

      {/* Cases Grid */}
      <div className="grid gap-6">
        {filteredCases.map((caseItem) => {
          const statusInfo = getStatusInfo(caseItem.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={caseItem.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${statusInfo.bgColor}`}>
                    <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {caseItem.title}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Case ID:</span>
                        <span className="ml-2 font-mono">{caseItem.id}</span>
                      </div>
                      <div>
                        <span className="font-medium">Client:</span>
                        <span className="ml-2 font-mono">{caseItem.client}</span>
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span>
                        <span className="ml-2 font-mono">{caseItem.amount} {caseItem.token}</span>
                      </div>
                      <div>
                        <span className="font-medium">Deadline:</span>
                        <span className="ml-2">{caseItem.deadline}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {caseItem.lawyer && (
                        <span className="text-sm text-gray-600">
                          Lawyer: {caseItem.lawyer}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {caseItem.status === 'open' && (
                    <button className="btn-outline text-sm px-3 py-1">
                      Fund Case
                    </button>
                  )}
                  {caseItem.status === 'funded' && !caseItem.lawyer && (
                    <button className="btn-outline text-sm px-3 py-1">
                      Accept Case
                    </button>
                  )}
                  {caseItem.status === 'accepted' && (
                    <button className="btn-outline text-sm px-3 py-1">
                      Mark Resolved
                    </button>
                  )}
                  <button className="btn-outline text-sm px-3 py-1">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <div className="text-center py-20">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'all' 
              ? 'Get started by opening your first case'
              : `No ${activeTab} cases found. Open a new case to get started.`
            }
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Open New Case
          </button>
        </div>
      )}

      {/* Create Case Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Open New Case</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="caseTitle" className="label">Case Title</label>
                <input
                  type="text"
                  id="caseTitle"
                  className="input"
                  placeholder="Enter case title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lawyerAddress" className="label">Lawyer Address (Optional)</label>
                <input
                  type="text"
                  id="lawyerAddress"
                  className="input"
                  placeholder="0x... (leave empty to find lawyer later)"
                />
              </div>
              
              <div>
                <label htmlFor="caseAmount" className="label">Case Amount (AVAX)</label>
                <input
                  type="number"
                  id="caseAmount"
                  className="input"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="caseDeadline" className="label">Deadline</label>
                <input
                  type="date"
                  id="caseDeadline"
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
                  Open Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Escrow;
