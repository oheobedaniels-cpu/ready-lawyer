import { DataService } from '../DataService';
import { dummyUsers, dummyDocuments, dummyCases, dummyCampaigns } from '../../data/dummyData';

// Mock the contract service
jest.mock('../ContractService', () => ({
  contractService: {
    getReadyRoles: jest.fn(() => null),
    getReadyDocs: jest.fn(() => null),
    getReadyEscrow: jest.fn(() => null),
    getReadyFund: jest.fn(() => null),
    getReadyListings: jest.fn(() => null),
    getContractStatus: jest.fn(() => ({
      readyDocs: false,
      readyRoles: false,
      readyEscrow: false,
      readyFund: false,
      readyListings: false
    })),
    hasService: jest.fn(() => false)
  }
}));

describe('DataService', () => {
  let dataService: DataService;

  beforeEach(() => {
    dataService = DataService.getInstance();
  });

  describe('User Management', () => {
    it('should return all users from dummy data when contracts are unavailable', async () => {
      const users = await dataService.getAllUsers();
      expect(users).toEqual(dummyUsers);
    });

    it('should find user by ID', async () => {
      const user = await dataService.getUserById('1');
      expect(user).toEqual(dummyUsers[0]);
    });

    it('should find user by address', async () => {
      const user = await dataService.getUserByAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
      expect(user).toEqual(dummyUsers[0]);
    });

    it('should return verified lawyers', async () => {
      const lawyers = await dataService.getVerifiedLawyers();
      expect(lawyers).toHaveLength(2);
      expect(lawyers.every(l => l.role === 'lawyer' && l.verified)).toBe(true);
    });

    it('should search users', async () => {
      const results = await dataService.searchUsers('Sarah');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Sarah Johnson');
    });
  });

  describe('Document Management', () => {
    it('should return all documents from dummy data when contracts are unavailable', async () => {
      const documents = await dataService.getAllDocuments();
      expect(documents).toEqual(dummyDocuments);
    });

    it('should find document by ID', async () => {
      const document = await dataService.getDocumentById('doc1');
      expect(document).toEqual(dummyDocuments[0]);
    });

    it('should find documents by case ID', async () => {
      const documents = await dataService.getDocumentsByCaseId('case1');
      expect(documents).toHaveLength(1);
      expect(documents[0].caseId).toBe('case1');
    });

    it('should search documents', async () => {
      const results = await dataService.searchDocuments('Contract');
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('Contract');
    });
  });

  describe('Case Management', () => {
    it('should return all cases from dummy data when contracts are unavailable', async () => {
      const cases = await dataService.getAllCases();
      expect(cases).toEqual(dummyCases);
    });

    it('should find case by ID', async () => {
      const legalCase = await dataService.getCaseById('case1');
      expect(legalCase).toEqual(dummyCases[0]);
    });

    it('should find cases by client', async () => {
      const cases = await dataService.getCasesByClient('0x1234567890123456789012345678901234567890');
      expect(cases).toHaveLength(1);
      expect(cases[0].client.address).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should return active cases', async () => {
      const activeCases = await dataService.getActiveCases();
      expect(activeCases).toHaveLength(1);
      expect(activeCases[0].status).toBe(3); // Accepted
    });
  });

  describe('Fundraising Management', () => {
    it('should return all campaigns from dummy data when contracts are unavailable', async () => {
      const campaigns = await dataService.getAllCampaigns();
      expect(campaigns).toEqual(dummyCampaigns);
    });

    it('should find campaign by ID', async () => {
      const campaign = await dataService.getCampaignById('campaign1');
      expect(campaign).toEqual(dummyCampaigns[0]);
    });

    it('should return active campaigns', async () => {
      const activeCampaigns = await dataService.getActiveCampaigns();
      expect(activeCampaigns).toHaveLength(1);
      expect(activeCampaigns[0].status).toBe(1); // Active
    });

    it('should search campaigns', async () => {
      const results = await dataService.searchCampaigns('Justice');
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('Justice');
    });
  });

  describe('Global Search', () => {
    it('should search across all data types', async () => {
      const results = await dataService.globalSearch('Tech');
      expect(results.users).toBeDefined();
      expect(results.documents).toBeDefined();
      expect(results.cases).toBeDefined();
      expect(results.campaigns).toBeDefined();
    });
  });

  describe('Data Summary', () => {
    it('should return correct data summary', async () => {
      const summary = await dataService.getDataSummary();
      expect(summary.totalUsers).toBe(3);
      expect(summary.totalDocuments).toBe(2);
      expect(summary.totalCases).toBe(1);
      expect(summary.totalCampaigns).toBe(1);
      expect(summary.activeCases).toBe(1);
      expect(summary.activeCampaigns).toBe(1);
    });
  });

  describe('Contract Status', () => {
    it('should return contract status', async () => {
      const status = await dataService.getContractStatus();
      expect(status).toBeDefined();
      expect(typeof status.readyDocs).toBe('boolean');
    });

    it('should check if specific service is available', async () => {
      const isAvailable = await dataService.isContractAvailable('readyDocs');
      expect(typeof isAvailable).toBe('boolean');
    });
  });
});
