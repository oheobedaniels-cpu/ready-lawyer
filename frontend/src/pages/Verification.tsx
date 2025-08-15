import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Scale, UserCheck, Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Verification: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const [activeTab, setActiveTab] = useState<'lawyer' | 'judge'>('lawyer');
  const [profileURI, setProfileURI] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual contract calls
  const verificationStatus = {
    lawyer: 'pending',
    judge: 'none'
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Approved' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Pending Review' };
      case 'revoked':
        return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Revoked' };
      default:
        return { icon: Shield, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Not Verified' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !profileURI.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Call smart contract function
      console.log('Submitting verification request:', { type: activeTab, profileURI });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Verification request submitted successfully!');
      setProfileURI('');
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Failed to submit verification request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your wallet to access verification services</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Professional Verification</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get verified as a legal practitioner on the Ready Lawyer platform. 
          Submit your credentials for review and approval.
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <UserCheck className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Lawyer Status</h3>
          </div>
          <div className="flex items-center space-x-3">
            {(() => {
              const statusInfo = getStatusInfo(verificationStatus.lawyer);
              const Icon = statusInfo.icon;
              return (
                <>
                  <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
                    <Icon className={`h-5 w-5 ${statusInfo.color}`} />
                  </div>
                  <span className={`font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Judge Status</h3>
          </div>
          <div className="flex items-center space-x-3">
            {(() => {
              const statusInfo = getStatusInfo(verificationStatus.judge);
              const Icon = statusInfo.icon;
              return (
                <>
                  <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
                    <Icon className={`h-5 w-5 ${statusInfo.color}`} />
                  </div>
                  <span className={`font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Verification Form */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Verification</h2>
          <p className="text-gray-600">
            Submit your professional credentials for verification. This process helps maintain 
            the quality and trustworthiness of our legal services platform.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('lawyer')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lawyer'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lawyer Verification
            </button>
            <button
              onClick={() => setActiveTab('judge')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'judge'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Judge Appointment
            </button>
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="profileURI" className="label">
              Profile URI
            </label>
            <input
              type="text"
              id="profileURI"
              value={profileURI}
              onChange={(e) => setProfileURI(e.target.value)}
              placeholder="IPFS hash or HTTPS URL to your professional profile"
              className="input"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Provide a link to your professional profile, credentials, or portfolio. 
              This should include your bar number, certifications, and relevant experience.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Verification Requirements
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Valid bar license or legal certification</li>
                    <li>Professional experience documentation</li>
                    <li>Clean disciplinary record</li>
                    <li>Proof of identity and credentials</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !profileURI.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : `Submit ${activeTab === 'lawyer' ? 'Lawyer' : 'Judge'} Verification`}
            </button>
          </div>
        </form>
      </div>

      {/* Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">For Lawyers</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Access to client case management</li>
            <li>• Document creation and management</li>
            <li>• Escrow payment processing</li>
            <li>• Professional profile listing</li>
            <li>• Case funding opportunities</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">For Judges</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Judgment document creation</li>
            <li>• Case oversight and management</li>
            <li>• Dispute resolution authority</li>
            <li>• Legal precedent setting</li>
            <li>• Platform governance participation</li>
          </ul>
        </div>
      </div>

      {/* Process Steps */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Process</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Submit Request', description: 'Provide your credentials and profile information' },
            { step: 2, title: 'Review', description: 'Our team reviews your application and documents' },
            { step: 3, title: 'Verification', description: 'Background check and credential verification' },
            { step: 4, title: 'Approval', description: 'Access granted to platform features' }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold">
                {item.step}
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Verification;
