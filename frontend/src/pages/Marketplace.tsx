import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Users, Plus, Search, Star, Clock, MapPin, DollarSign, Tag, X } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'lawyers' | 'cases'>('lawyers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data - replace with actual contract calls
  const lawyers = [
    {
      id: 'lawyer_001',
      name: 'Sarah Johnson',
      address: '0x1234...5678',
      hourlyRate: '0.002',
      tags: ['Criminal Law', 'Family Law', 'Contract Law'],
      rating: 4.8,
      cases: 45,
      verified: true,
      profileURI: 'ipfs://QmLawyerProfile1'
    },
    {
      id: 'lawyer_002',
      name: 'Michael Chen',
      address: '0x8765...4321',
      hourlyRate: '0.003',
      tags: ['Corporate Law', 'Tax Law', 'Employment Law'],
      rating: 4.9,
      cases: 67,
      verified: true,
      profileURI: 'ipfs://QmLawyerProfile2'
    },
    {
      id: 'lawyer_003',
      name: 'Emily Rodriguez',
      address: '0x9999...8888',
      hourlyRate: '0.0015',
      tags: ['Immigration Law', 'Civil Rights', 'Family Law'],
      rating: 4.7,
      cases: 23,
      verified: true,
      profileURI: 'ipfs://QmLawyerProfile3'
    }
  ];

  const caseSignals = [
    {
      id: 'signal_001',
      title: 'Contract Dispute Resolution',
      client: '0x5555...4444',
      budgetMin: '1.5',
      budgetMax: '3.0',
      tags: ['Contract Law', 'Commercial Dispute'],
      createdAt: '2024-01-15',
      status: 'open'
    },
    {
      id: 'signal_002',
      title: 'Employment Discrimination Case',
      client: '0x6666...7777',
      budgetMin: '2.0',
      budgetMax: '4.0',
      tags: ['Employment Law', 'Discrimination'],
      createdAt: '2024-01-14',
      status: 'open'
    },
    {
      id: 'signal_003',
      title: 'Family Law Consultation',
      client: '0x8888...9999',
      budgetMin: '0.5',
      budgetMax: '1.0',
      tags: ['Family Law', 'Consultation'],
      createdAt: '2024-01-13',
      status: 'open'
    }
  ];

  const filteredLawyers = lawyers.filter(lawyer =>
    lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lawyer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCaseSignals = caseSignals.filter(signal =>
    signal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    signal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your wallet to access the marketplace</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Marketplace</h1>
          <p className="text-gray-600 mt-1">
            Find verified lawyers or post case requirements for legal assistance
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{activeTab === 'lawyers' ? 'Create Listing' : 'Post Case Signal'}</span>
        </button>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'lawyers' ? 'lawyers' : 'case signals'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('lawyers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lawyers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lawyers ({lawyers.length})
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cases'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Case Signals ({caseSignals.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'lawyers' ? (
        /* Lawyers Grid */
        <div className="grid gap-6">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {lawyer.name}
                        {lawyer.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 font-mono">{lawyer.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{lawyer.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600">{lawyer.cases} cases</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{lawyer.hourlyRate} AVAX/hour</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {lawyer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-outline text-sm px-3 py-1">
                    View Profile
                  </button>
                  <button className="btn-primary text-sm px-3 py-1">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Case Signals Grid */
        <div className="grid gap-6">
          {filteredCaseSignals.map((signal) => (
            <div key={signal.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {signal.title}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Signal ID:</span>
                      <span className="ml-2 font-mono">{signal.id}</span>
                    </div>
                    <div>
                      <span className="font-medium">Client:</span>
                      <span className="ml-2 font-mono">{signal.client}</span>
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span>
                      <span className="ml-2">{signal.budgetMin} - {signal.budgetMax} AVAX</span>
                    </div>
                    <div>
                      <span className="font-medium">Posted:</span>
                      <span className="ml-2">{signal.createdAt}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {signal.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-outline text-sm px-3 py-1">
                    View Details
                  </button>
                  <button className="btn-primary text-sm px-3 py-1">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'lawyers' && filteredLawyers.length === 0) || 
        (activeTab === 'cases' && filteredCaseSignals.length === 0)) && (
        <div className="text-center py-20">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No results found' : `No ${activeTab === 'lawyers' ? 'lawyers' : 'case signals'} found`}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : `Get started by ${activeTab === 'lawyers' ? 'creating a lawyer listing' : 'posting a case signal'}`
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              {activeTab === 'lawyers' ? 'Create Listing' : 'Post Case Signal'}
            </button>
          )}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'lawyers' ? 'Create Lawyer Listing' : 'Post Case Signal'}
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              {activeTab === 'lawyers' ? (
                /* Lawyer Listing Form */
                <>
                  <div>
                    <label htmlFor="profileURI" className="label">Profile URI</label>
                    <input
                      type="text"
                      id="profileURI"
                      className="input"
                      placeholder="IPFS hash or HTTPS URL to your profile"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hourlyRate" className="label">Hourly Rate (AVAX)</label>
                    <input
                      type="number"
                      id="hourlyRate"
                      className="input"
                      placeholder="0.001"
                      step="0.001"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="label">Practice Areas (comma-separated)</label>
                    <input
                      type="text"
                      id="tags"
                      className="input"
                      placeholder="Criminal Law, Family Law, Contract Law"
                      required
                    />
                  </div>
                </>
              ) : (
                /* Case Signal Form */
                <>
                  <div>
                    <label htmlFor="caseTitle" className="label">Case Title</label>
                    <input
                      type="text"
                      id="caseTitle"
                      className="input"
                      placeholder="Brief description of your case"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="caseURI" className="label">Case Details URI</label>
                    <input
                      type="text"
                      id="caseURI"
                      className="input"
                      placeholder="IPFS hash or HTTPS URL to case details"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="budgetMin" className="label">Min Budget (AVAX)</label>
                      <input
                        type="number"
                        id="budgetMin"
                        className="input"
                        placeholder="0.5"
                        step="0.1"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="budgetMax" className="label">Max Budget (AVAX)</label>
                      <input
                        type="number"
                        id="budgetMax"
                        className="input"
                        placeholder="2.0"
                        step="0.1"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="caseTags" className="label">Case Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="caseTags"
                      className="input"
                      placeholder="Contract Law, Commercial Dispute"
                      required
                    />
                  </div>
                </>
              )}
              
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
                  {activeTab === 'lawyers' ? 'Create Listing' : 'Post Signal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
