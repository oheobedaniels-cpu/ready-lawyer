import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { FileText, Plus, Upload, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Documents: React.FC = () => {
  const { isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'all' | 'pleadings' | 'judgments' | 'contracts' | 'evidence'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data - replace with actual contract calls
  const documents = [
    {
      id: 'doc_001',
      title: 'Contract Agreement v1.0',
      type: 'contract',
      caseId: 'CASE_001',
      author: '0x1234...5678',
      createdAt: '2024-01-15',
      versions: 2,
      status: 'active'
    },
    {
      id: 'doc_002',
      title: 'Pleading Document',
      type: 'pleading',
      caseId: 'CASE_002',
      author: '0x8765...4321',
      createdAt: '2024-01-14',
      versions: 1,
      status: 'active'
    },
    {
      id: 'doc_003',
      title: 'Court Judgment',
      type: 'judgment',
      caseId: 'CASE_003',
      author: '0x9999...8888',
      createdAt: '2024-01-13',
      versions: 1,
      status: 'active'
    }
  ];

  const documentTypes = [
    { key: 'all', label: 'All Documents', count: documents.length },
    { key: 'pleadings', label: 'Pleadings', count: documents.filter(d => d.type === 'pleading').length },
    { key: 'judgments', label: 'Judgments', count: documents.filter(d => d.type === 'judgment').length },
    { key: 'contracts', label: 'Contracts', count: documents.filter(d => d.type === 'contract').length },
    { key: 'evidence', label: 'Evidence', count: documents.filter(d => d.type === 'evidence').length }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pleading':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'judgment':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'contract':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'evidence':
        return <Eye className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'active') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === 'revoked') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const filteredDocuments = activeTab === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === activeTab);

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your wallet to access document management</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">
            Create, manage, and track legal documents with immutable version control
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Document</span>
        </button>
      </div>

      {/* Document Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {documentTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setActiveTab(type.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === type.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {type.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {type.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-6">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {getTypeIcon(doc.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {doc.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>Case: {doc.caseId}</span>
                    <span>Author: {doc.author}</span>
                    <span>Created: {doc.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Versions: {doc.versions}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm text-gray-600 capitalize">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="btn-outline text-sm px-3 py-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="btn-outline text-sm px-3 py-1">
                  <Upload className="h-4 w-4 mr-1" />
                  Add Version
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'all' 
              ? 'Get started by creating your first document'
              : `No ${activeTab} documents found. Create one to get started.`
            }
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Document
          </button>
        </div>
      )}

      {/* Create Document Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Document</h2>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="docTitle" className="label">Document Title</label>
                <input
                  type="text"
                  id="docTitle"
                  className="input"
                  placeholder="Enter document title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="docType" className="label">Document Type</label>
                <select id="docType" className="input" required>
                  <option value="">Select type</option>
                  <option value="pleading">Pleading</option>
                  <option value="judgment">Judgment</option>
                  <option value="contract">Contract</option>
                  <option value="evidence">Evidence</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="caseId" className="label">Case ID</label>
                <input
                  type="text"
                  id="caseId"
                  className="input"
                  placeholder="Enter case identifier"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="docCid" className="label">Document CID</label>
                <input
                  type="text"
                  id="docCid"
                  className="input"
                  placeholder="IPFS hash or document URI"
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
                  Create Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
