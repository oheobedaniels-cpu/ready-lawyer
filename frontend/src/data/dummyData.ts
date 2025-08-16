import { 
  User, 
  LegalDocument, 
  LegalCase, 
  FundraisingCampaign, 
  DashboardStats
} from '../types';

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@lawfirm.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'lawyer',
    verified: true,
    joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
    totalCases: 47,
    successRate: 94,
    rating: 4.8,
    reviews: 23
  },
  {
    id: '2',
    address: '0x8ba1f109551bA432bdf8c998a2F9f8B6E5d55ED6',
    name: 'Michael Chen',
    email: 'michael.chen@legal.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'lawyer',
    verified: true,
    joinDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
    totalCases: 23,
    successRate: 87,
    rating: 4.6,
    reviews: 15
  },
  {
    id: '3',
    address: '0x1234567890123456789012345678901234567890',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@client.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'client',
    verified: true,
    joinDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
    totalCases: 3,
    successRate: 100,
    rating: 5.0,
    reviews: 2
  }
];

// Dummy Legal Documents
export const dummyDocuments: LegalDocument[] = [
  {
    id: 'doc1',
    title: 'Contract Agreement - Tech Startup',
    docType: 'Contract',
    caseId: 'case1',
    content: 'This agreement is made between TechStart Inc. and LegalCorp...',
    cid: 'QmX123456789abcdef',
    author: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    authorName: 'Sarah Johnson',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    version: 2,
    status: 'published',
    tags: ['contract', 'startup', 'tech', 'agreement'],
    fileSize: 245760,
    fileType: 'pdf',
    isPublic: false
  },
  {
    id: 'doc2',
    title: 'Evidence - Financial Records',
    docType: 'Evidence',
    caseId: 'case2',
    content: 'Financial records showing transactions from January to March 2024...',
    cid: 'QmY987654321fedcba',
    author: '0x8ba1f109551bA432bdf8c998a2F9f8B6E5d55ED6',
    authorName: 'Michael Chen',
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    version: 1,
    status: 'published',
    tags: ['evidence', 'financial', 'records', 'transactions'],
    fileSize: 512000,
    fileType: 'pdf',
    isPublic: false
  }
];

// Dummy Legal Cases
export const dummyCases: LegalCase[] = [
  {
    id: 'case1',
    title: 'Tech Startup Contract Dispute',
    description: 'Dispute over intellectual property rights and contract terms in a technology startup acquisition.',
    client: dummyUsers[2],
    lawyer: dummyUsers[0],
    status: 3, // Accepted
    category: 'Intellectual Property',
    priority: 'high',
    budget: { min: 15000, max: 25000, currency: 'USD' },
    deadline: Date.now() + 45 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    documents: [dummyDocuments[0]],
    tags: ['contract', 'startup', 'IP', 'dispute'],
    location: 'San Francisco, CA',
    court: 'Superior Court of California',
    caseNumber: 'CV-2024-001234',
    progress: 65,
    milestones: [
      {
        id: 'milestone1',
        title: 'Initial Filing',
        description: 'File complaint with the court',
        dueDate: Date.now() - 20 * 24 * 60 * 60 * 1000,
        completed: true,
        completedAt: Date.now() - 22 * 24 * 60 * 60 * 1000
      }
    ]
  }
];

// Dummy Fundraising Campaigns
export const dummyCampaigns: FundraisingCampaign[] = [
  {
    id: 'campaign1',
    title: 'Justice for Small Business',
    description: 'Help a local business owner fight against corporate bullying and unfair business practices.',
    beneficiary: dummyUsers[2],
    creator: dummyUsers[0],
    goal: 25000,
    raised: 18750,
    currency: 'USD',
    deadline: Date.now() + 20 * 24 * 60 * 60 * 1000,
    status: 1, // Active
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    category: 'Business Law',
    tags: ['small business', 'justice', 'corporate', 'bullying'],
    story: 'Our client, a hardworking small business owner, has been targeted by a large corporation...',
    updates: [],
    donors: [],
    beneficiaryIsLawyer: false,
    caseId: 'case1'
  }
];

// Dummy Dashboard Stats
export const dummyDashboardStats: DashboardStats = {
  totalCases: 47,
  activeCases: 12,
  completedCases: 35,
  totalDocuments: 156,
  totalRevenue: 125000,
  pendingTasks: 8,
  upcomingDeadlines: 3,
  recentActivity: [
    {
      id: 'activity1',
      type: 'case_created',
      title: 'New Case Created',
      description: 'Tech Startup Contract Dispute case has been created',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      metadata: { caseId: 'case1' }
    }
  ]
};

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return dummyUsers.find(user => user.id === id);
};

export const getUserByAddress = (address: string): User | undefined => {
  return dummyUsers.find(user => user.address.toLowerCase() === address.toLowerCase());
};
