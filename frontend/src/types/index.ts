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

// Enhanced Types for Frontend
export interface User {
  id: string;
  address: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'client' | 'lawyer' | 'judge' | 'admin';
  verified: boolean;
  joinDate: number;
  totalCases: number;
  successRate: number;
  rating: number;
  reviews: number;
}

export interface LegalDocument {
  id: string;
  title: string;
  docType: keyof DocType;
  caseId?: string;
  content: string;
  cid: string;
  author: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
  version: number;
  status: 'draft' | 'published' | 'archived' | 'revoked';
  tags: string[];
  fileSize: number;
  fileType: string;
  isPublic: boolean;
}

export interface LegalCase {
  id: string;
  title: string;
  description: string;
  client: User;
  lawyer?: User;
  status: CaseStatus;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: number;
  createdAt: number;
  updatedAt: number;
  documents: LegalDocument[];
  tags: string[];
  location: string;
  court?: string;
  caseNumber?: string;
  progress: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: number;
  completed: boolean;
  completedAt?: number;
}

export interface FundraisingCampaign {
  id: string;
  title: string;
  description: string;
  beneficiary: User;
  creator: User;
  goal: number;
  raised: number;
  currency: string;
  deadline: number;
  status: CampaignStatus;
  createdAt: number;
  updatedAt: number;
  category: string;
  tags: string[];
  story: string;
  updates: CampaignUpdate[];
  donors: Donor[];
  beneficiaryIsLawyer: boolean;
  caseId?: string;
}

export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  author: User;
}

export interface Donor {
  address: string;
  name?: string;
  amount: number;
  message?: string;
  donatedAt: number;
  anonymous: boolean;
}

export interface LawyerProfile {
  id: string;
  user: User;
  specialization: string[];
  experience: number;
  education: Education[];
  certifications: Certification[];
  hourlyRate: number;
  currency: string;
  availability: 'available' | 'busy' | 'unavailable';
  languages: string[];
  location: string;
  about: string;
  services: string[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  contactInfo: ContactInfo;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  expiryDate?: number;
  description?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  outcome: string;
  year: number;
  category: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: number;
  caseId?: string;
}

export interface ContactInfo {
  phone?: string;
  email: string;
  website?: string;
  officeAddress?: string;
  consultationHours?: string;
}

export interface CaseSignal {
  id: string;
  title: string;
  description: string;
  client: User;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: number;
  createdAt: number;
  status: 'open' | 'in_progress' | 'closed' | 'expired';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  tags: string[];
  requirements: string[];
  responses: LawyerResponse[];
  documents?: LegalDocument[];
}

export interface LawyerResponse {
  id: string;
  lawyer: User;
  proposal: string;
  estimatedCost: number;
  estimatedDuration: number;
  qualifications: string[];
  createdAt: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: number;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  totalDocuments: number;
  totalRevenue: number;
  pendingTasks: number;
  upcomingDeadlines: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'case_created' | 'document_uploaded' | 'payment_received' | 'deadline_approaching' | 'verification_approved';
  title: string;
  description: string;
  timestamp: number;
  metadata?: Record<string, any>;
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
