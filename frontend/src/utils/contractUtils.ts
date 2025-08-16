import { ethers } from 'ethers';
import { CaseStatus, CampaignStatus, PractitionerStatus } from '../types';

// Contract Address Utilities
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

export const formatEther = (wei: string | number | bigint): string => {
  try {
    return ethers.formatEther(wei.toString());
  } catch {
    return '0';
  }
};

export const parseEther = (ether: string): bigint => {
  try {
    return ethers.parseEther(ether);
  } catch {
    return BigInt(0);
  }
};

// Status Utilities
export const getCaseStatusText = (status: CaseStatus): string => {
  switch (status) {
    case CaseStatus.None: return 'None';
    case CaseStatus.Open: return 'Open';
    case CaseStatus.Funded: return 'Funded';
    case CaseStatus.Accepted: return 'Accepted';
    case CaseStatus.Resolved: return 'Resolved';
    case CaseStatus.Disputed: return 'Disputed';
    case CaseStatus.Released: return 'Released';
    case CaseStatus.Refunded: return 'Refunded';
    case CaseStatus.Cancelled: return 'Cancelled';
    default: return 'Unknown';
  }
};

export const getCaseStatusColor = (status: CaseStatus): string => {
  switch (status) {
    case CaseStatus.Open: return 'text-blue-600 bg-blue-50 border-blue-200';
    case CaseStatus.Funded: return 'text-green-600 bg-green-50 border-green-200';
    case CaseStatus.Accepted: return 'text-purple-600 bg-purple-50 border-purple-200';
    case CaseStatus.Resolved: return 'text-green-600 bg-green-50 border-green-200';
    case CaseStatus.Disputed: return 'text-red-600 bg-red-50 border-red-200';
    case CaseStatus.Released: return 'text-green-600 bg-green-50 border-green-200';
    case CaseStatus.Refunded: return 'text-orange-600 bg-orange-50 border-orange-200';
    case CaseStatus.Cancelled: return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getCampaignStatusText = (status: CampaignStatus): string => {
  switch (status) {
    case CampaignStatus.None: return 'None';
    case CampaignStatus.Active: return 'Active';
    case CampaignStatus.Succeeded: return 'Succeeded';
    case CampaignStatus.Failed: return 'Failed';
    case CampaignStatus.Cancelled: return 'Cancelled';
    case CampaignStatus.PayoutReady: return 'Payout Ready';
    case CampaignStatus.Refunding: return 'Refunding';
    default: return 'Unknown';
  }
};

export const getCampaignStatusColor = (status: CampaignStatus): string => {
  switch (status) {
    case CampaignStatus.Active: return 'text-blue-600 bg-blue-50 border-blue-200';
    case CampaignStatus.Succeeded: return 'text-green-600 bg-green-50 border-green-200';
    case CampaignStatus.Failed: return 'text-red-600 bg-red-50 border-red-200';
    case CampaignStatus.Cancelled: return 'text-gray-600 bg-gray-50 border-gray-200';
    case CampaignStatus.PayoutReady: return 'text-green-600 bg-green-50 border-green-200';
    case CampaignStatus.Refunding: return 'text-orange-600 bg-orange-50 border-orange-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getPractitionerStatusText = (status: PractitionerStatus): string => {
  switch (status) {
    case PractitionerStatus.None: return 'None';
    case PractitionerStatus.Pending: return 'Pending';
    case PractitionerStatus.Approved: return 'Approved';
    case PractitionerStatus.Revoked: return 'Revoked';
    default: return 'Unknown';
  }
};

export const getPractitionerStatusColor = (status: PractitionerStatus): string => {
  switch (status) {
    case PractitionerStatus.Pending: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case PractitionerStatus.Approved: return 'text-green-600 bg-green-50 border-green-200';
    case PractitionerStatus.Revoked: return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Time Utilities
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDeadline = (deadline: number): string => {
  const now = Date.now();
  const diffInDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) return 'Overdue';
  if (diffInDays === 0) return 'Due today';
  if (diffInDays === 1) return 'Due tomorrow';
  if (diffInDays <= 7) return `Due in ${diffInDays} days`;
  
  return new Date(deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const isUrgent = (deadline: number, thresholdDays: number = 3): boolean => {
  const now = Date.now();
  const diffInDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return diffInDays <= thresholdDays && diffInDays >= 0;
};

// File Utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string): string => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return '📄';
  if (type.includes('doc') || type.includes('docx')) return '📝';
  if (type.includes('image')) return '🖼️';
  if (type.includes('video')) return '🎥';
  if (type.includes('audio')) return '🎵';
  return '📎';
};

// Validation Utilities
export const validateEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateDeadline = (deadline: number): boolean => {
  return deadline > Date.now();
};

// Error Handling
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error?.message) return error.error.message;
  return 'An unknown error occurred';
};

// Contract Interaction Helpers
export const waitForTransaction = async (tx: ethers.ContractTransactionResponse): Promise<ethers.ContractTransactionReceipt | null> => {
  return await tx.wait();
};

export const estimateGas = async (_tx: ethers.ContractTransactionResponse): Promise<bigint> => {
  // Note: estimateGas is not available on ContractTransactionResponse in ethers v6
  // This would need to be called before the transaction is sent
  throw new Error('estimateGas must be called before sending the transaction');
};

export const getTransactionStatus = async (tx: ethers.ContractTransactionResponse): Promise<'pending' | 'confirmed' | 'failed'> => {
  try {
    const receipt = await tx.wait();
    return receipt && receipt.status === 1 ? 'confirmed' : 'failed';
  } catch {
    return 'pending';
  }
};
