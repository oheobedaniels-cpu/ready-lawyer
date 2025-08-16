import { 
  User, 
  LegalDocument, 
  LegalCase, 
  FundraisingCampaign, 
  CaseSignal, 
  DashboardStats,
  Notification,
  ActivityItem,
  CaseStatus,
  CampaignStatus,
  PractitionerStatus
} from '../types';
import { 
  dummyUsers, 
  dummyDocuments, 
  dummyCases, 
  dummyCampaigns, 
  dummyDashboardStats 
} from '../data/dummyData';
import { contractService } from './ContractService';

export class DataService {
  private static instance: DataService;

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // ===== User Management =====
  async getAllUsers(): Promise<User[]> {
    // Try to get from contract first, fallback to dummy data
    try {
      const readyRoles = contractService.getReadyRoles();
      if (readyRoles) {
        return await readyRoles.getAllPractitioners();
      }
    } catch (error) {
      console.warn('Failed to fetch users from contract, using dummy data:', error);
    }
    return dummyUsers;
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  async getUserByAddress(address: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.address.toLowerCase() === address.toLowerCase()) || null;
  }

  async getVerifiedLawyers(): Promise<User[]> {
    const users = await this.getAllUsers();
    return users.filter(user => user.role === 'lawyer' && user.verified);
  }

  async getVerifiedJudges(): Promise<User[]> {
    const users = await this.getAllUsers();
    return users.filter(user => user.role === 'judge' && user.verified);
  }

  async searchUsers(query: string): Promise<User[]> {
    const users = await this.getAllUsers();
    const lowerQuery = query.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery)
    );
  }

  // ===== Document Management =====
  async getAllDocuments(): Promise<LegalDocument[]> {
    try {
      const readyDocs = contractService.getReadyDocs();
      if (readyDocs) {
        return await readyDocs.getAllDocuments();
      }
    } catch (error) {
      console.warn('Failed to fetch documents from contract, using dummy data:', error);
    }
    return dummyDocuments;
  }

  async getDocumentById(id: string): Promise<LegalDocument | null> {
    const documents = await this.getAllDocuments();
    return documents.find(doc => doc.id === id) || null;
  }

  async getDocumentsByCaseId(caseId: string): Promise<LegalDocument[]> {
    const documents = await this.getAllDocuments();
    return documents.filter(doc => doc.caseId === caseId);
  }

  async searchDocuments(query: string): Promise<LegalDocument[]> {
    const documents = await this.getAllDocuments();
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getDocumentsByType(docType: string): Promise<LegalDocument[]> {
    const documents = await this.getAllDocuments();
    return documents.filter(doc => doc.docType === docType);
  }

  // ===== Case Management =====
  async getAllCases(): Promise<LegalCase[]> {
    try {
      const readyEscrow = contractService.getReadyEscrow();
      if (readyEscrow) {
        return await readyEscrow.getAllCases();
      }
    } catch (error) {
      console.warn('Failed to fetch cases from contract, using dummy data:', error);
    }
    return dummyCases;
  }

  async getCaseById(id: string): Promise<LegalCase | null> {
    const cases = await this.getAllCases();
    return cases.find(c => c.id === id) || null;
  }

  async getCasesByClient(clientAddress: string): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.client.address.toLowerCase() === clientAddress.toLowerCase());
  }

  async getCasesByLawyer(lawyerAddress: string): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.lawyer?.address.toLowerCase() === lawyerAddress.toLowerCase());
  }

  async getActiveCases(): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.status === CaseStatus.Accepted || c.status === CaseStatus.Funded);
  }

  async getCompletedCases(): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.status === CaseStatus.Resolved);
  }

  async searchCases(query: string): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    const lowerQuery = query.toLowerCase();
    return cases.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getCasesByCategory(category: string): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  // ===== Fundraising Management =====
  async getAllCampaigns(): Promise<FundraisingCampaign[]> {
    try {
      const readyFund = contractService.getReadyFund();
      if (readyFund) {
        return await readyFund.getAllCampaigns();
      }
    } catch (error) {
      console.warn('Failed to fetch campaigns from contract, using dummy data:', error);
    }
    return dummyCampaigns;
  }

  async getCampaignById(id: string): Promise<FundraisingCampaign | null> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.find(c => c.id === id) || null;
  }

  async getCampaignsByCreator(creatorAddress: string): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.creator.address.toLowerCase() === creatorAddress.toLowerCase());
  }

  async getCampaignsByBeneficiary(beneficiaryAddress: string): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.beneficiary.address.toLowerCase() === beneficiaryAddress.toLowerCase());
  }

  async getActiveCampaigns(): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.status === CampaignStatus.Active);
  }

  async getSuccessfulCampaigns(): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.status === CampaignStatus.Succeeded);
  }

  async getFailedCampaigns(): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.status === CampaignStatus.Failed);
  }

  async searchCampaigns(query: string): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    const lowerQuery = query.toLowerCase();
    return campaigns.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getCampaignsByCategory(category: string): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  async getUrgentCampaigns(daysThreshold: number = 7): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    const now = Date.now();
    const threshold = daysThreshold * 24 * 60 * 60 * 1000;
    return campaigns.filter(c => 
      c.status === CampaignStatus.Active && 
      (c.deadline - now) <= threshold
    );
  }

  // ===== Dashboard Data =====
  async getDashboardStats(): Promise<DashboardStats> {
    // In production, this would aggregate data from all sources
    return dummyDashboardStats;
  }

  async getRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
    const stats = await this.getDashboardStats();
    return stats.recentActivity.slice(0, limit);
  }

  async getUpcomingDeadlines(limit: number = 5): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    const now = Date.now();
    const upcoming = cases
      .filter(c => c.deadline > now && c.status !== CaseStatus.Resolved)
      .sort((a, b) => a.deadline - b.deadline)
      .slice(0, limit);
    return upcoming;
  }

  // ===== Search and Filter =====
  async globalSearch(query: string): Promise<{
    users: User[];
    documents: LegalDocument[];
    cases: LegalCase[];
    campaigns: FundraisingCampaign[];
  }> {
    const [users, documents, cases, campaigns] = await Promise.all([
      this.searchUsers(query),
      this.searchDocuments(query),
      this.searchCases(query),
      this.searchCampaigns(query)
    ]);

    return { users, documents, cases, campaigns };
  }

  // ===== Data Aggregation =====
  async getDataSummary(): Promise<{
    totalUsers: number;
    totalDocuments: number;
    totalCases: number;
    totalCampaigns: number;
    activeCases: number;
    activeCampaigns: number;
    totalRevenue: number;
  }> {
    const [users, documents, cases, campaigns] = await Promise.all([
      this.getAllUsers(),
      this.getAllDocuments(),
      this.getAllCases(),
      this.getAllCampaigns()
    ]);

    const activeCases = cases.filter(c => 
      c.status === CaseStatus.Accepted || c.status === CaseStatus.Funded
    ).length;

    const activeCampaigns = campaigns.filter(c => 
      c.status === CampaignStatus.Active
    ).length;

    const totalRevenue = cases
      .filter(c => c.status === CaseStatus.Resolved)
      .reduce((sum, c) => sum + c.budget.max, 0);

    return {
      totalUsers: users.length,
      totalDocuments: documents.length,
      totalCases: cases.length,
      totalCampaigns: campaigns.length,
      activeCases,
      activeCampaigns,
      totalRevenue
    };
  }

  // ===== Contract Integration =====
  async getContractStatus() {
    return contractService.getContractStatus();
  }

  async isContractAvailable(serviceName: string): Promise<boolean> {
    return contractService.hasService(serviceName as any);
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();
