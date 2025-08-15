import React from 'react';

// Smart Contract Types
export interface DocType {
  Other: 0;
  Pleading: 1;
  Judgment: 2;
  Contract: 3;
  Evidence: 4;
}

export interface Version {
  cid: string;
  timestamp: number;
  revoked: boolean;
  author: string;
}

export interface DocMeta {
  docType: keyof DocType;
  caseId: string;
  exists: boolean;
}

export interface CaseData {
  client: string;
  lawyer: string;
  token: string;
  amount: string;
  createdAt: number;
  deadline: number;
  status: CaseStatus;
}

export interface Campaign {
  creator: string;
  beneficiary: string;
  token: string;
  goal: string;
  deadline: number;
  raised: string;
  status: CampaignStatus;
  beneficiaryIsLawyer: boolean;
}

export interface Practitioner {
  status: PractitionerStatus;
  profileURI: string;
}

// Enums
export enum CaseStatus {
  None = 0,
  Open = 1,
  Funded = 2,
  Accepted = 3,
  Resolved = 4,
  Disputed = 5,
  Released = 6,
  Refunded = 7,
  Cancelled = 8,
}

export enum CampaignStatus {
  None = 0,
  Active = 1,
  Succeeded = 2,
  Failed = 3,
  Cancelled = 4,
  PayoutReady = 5,
  Refunding = 6,
}

export enum PractitionerStatus {
  None = 0,
  Pending = 1,
  Approved = 2,
  Revoked = 3,
}

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  MAIN_CONTRACT: '0x7113C79e62FC58886325314dF173d6A55fC85902',
  READY_ROLES: '', // To be filled after deployment
  READY_DOCS: '', // To be filled after deployment
  READY_ESCROW: '', // To be filled after deployment
  READY_FUND: '', // To be filled after deployment
  READY_LISTINGS: '', // To be filled after deployment
} as const;

// Network Configuration
export const NETWORKS = {
  AVALANCHE_MAINNET: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io/',
    currency: 'AVAX',
  },
  AVALANCHE_TESTNET: {
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorer: 'https://testnet.snowtrace.io/',
    currency: 'AVAX',
  },
} as const;

// Form Types
export interface LawyerVerificationForm {
  profileURI: string;
}

export interface DocumentForm {
  docId: string;
  docType: keyof DocType;
  caseId: string;
  initialCid: string;
}

export interface CaseForm {
  caseId: string;
  lawyer: string;
  token: string;
  amount: string;
  deadline: number;
}

export interface CampaignForm {
  id: string;
  beneficiary: string;
  beneficiaryIsLawyer: boolean;
  token: string;
  goalAmount: string;
  deadline: number;
}

export interface LawyerListingForm {
  profileURI: string;
  hourlyRate: string;
  tags: string[];
}

export interface CaseSignalForm {
  signalId: string;
  caseURI: string;
  budgetMin: string;
  budgetMax: string;
  tags: string[];
}

// UI Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

// Web3 Types
declare global {
  interface Window {
    ethereum?: any;
  }
}
