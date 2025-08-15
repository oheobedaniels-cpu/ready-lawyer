// Export all dummy data and helper functions
export {
  dummyUsers,
  dummyDocuments,
  dummyCases,
  dummyCampaigns,
  dummyDashboardStats,
  getUserById,
  getUserByAddress
} from './dummyData';

// Re-export types for convenience
export type {
  User,
  LegalDocument,
  LegalCase,
  FundraisingCampaign,
  LawyerProfile,
  CaseSignal,
  DashboardStats,
  Notification,
  ActivityItem
} from '../types';
