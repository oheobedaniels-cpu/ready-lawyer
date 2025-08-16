import { ethers } from 'ethers';
import { LegalCase, CaseStatus } from '../../types';
import { dummyCases } from '../../data/dummyData';

export class ReadyEscrowService {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(contractAddress: string, signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    this.contract = new ethers.Contract(contractAddress, [
      'function createCase(string caseId, address lawyer, address token, uint256 amount, uint256 deadline) external',
      'function fundCase(string caseId) external payable',
      'function acceptCase(string caseId) external',
      'function resolveCase(string caseId) external',
      'function disputeCase(string caseId) external',
      'function releaseFunds(string caseId) external',
      'function refundCase(string caseId) external',
      'function getCaseData(string caseId) external view returns (tuple(address client, address lawyer, address token, uint256 amount, uint256 createdAt, uint256 deadline, uint8 status))',
      'function getCaseStatus(string caseId) external view returns (uint8)',
      'function getCaseBalance(string caseId) external view returns (uint256)',
      'function pause() external',
      'function unpause() external'
    ], signer);
  }

  // Create a new legal case
  async createCase(
    caseId: string,
    lawyer: string,
    token: string,
    amount: string,
    deadline: number
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.createCase(caseId, lawyer, token, amount, deadline);
  }

  // Fund a case with escrow amount
  async fundCase(caseId: string, amount?: string): Promise<ethers.ContractTransaction> {
    if (amount) {
      return await this.contract.fundCase(caseId, { value: ethers.parseEther(amount) });
    }
    return await this.contract.fundCase(caseId);
  }

  // Accept a case (lawyer only)
  async acceptCase(caseId: string): Promise<ethers.ContractTransaction> {
    return await this.contract.acceptCase(caseId);
  }

  // Resolve a case
  async resolveCase(caseId: string): Promise<ethers.ContractTransaction> {
    return await this.contract.resolveCase(caseId);
  }

  // Dispute a case
  async disputeCase(caseId: string): Promise<ethers.ContractTransaction> {
    return await this.contract.disputeCase(caseId);
  }

  // Release funds to lawyer
  async releaseFunds(caseId: string): Promise<ethers.ContractTransaction> {
    return await this.contract.releaseFunds(caseId);
  }

  // Refund case funds to client
  async refundCase(caseId: string): Promise<ethers.ContractTransaction> {
    return await this.contract.refundCase(caseId);
  }

  // Get case data
  async getCaseData(caseId: string): Promise<{
    client: string;
    lawyer: string;
    token: string;
    amount: string;
    createdAt: number;
    deadline: number;
    status: CaseStatus;
  }> {
    const caseData = await this.contract.getCaseData(caseId);
    return {
      client: caseData[0],
      lawyer: caseData[1],
      token: caseData[2],
      amount: caseData[3].toString(),
      createdAt: Number(caseData[4]),
      deadline: Number(caseData[5]),
      status: Number(caseData[6])
    };
  }

  // Get case status
  async getCaseStatus(caseId: string): Promise<CaseStatus> {
    const status = await this.contract.getCaseStatus(caseId);
    return Number(status);
  }

  // Get case balance
  async getCaseBalance(caseId: string): Promise<string> {
    const balance = await this.contract.getCaseBalance(caseId);
    return ethers.formatEther(balance);
  }

  // Get all cases (combines contract data with dummy data)
  async getAllCases(): Promise<LegalCase[]> {
    // For now, return dummy data. In production, this would fetch from contract
    return dummyCases;
  }

  // Get case by ID
  async getCaseById(caseId: string): Promise<LegalCase | null> {
    const cases = await this.getAllCases();
    return cases.find(c => c.id === caseId) || null;
  }

  // Get cases by client address
  async getCasesByClient(clientAddress: string): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.client.address.toLowerCase() === clientAddress.toLowerCase());
  }

  // Get cases by lawyer address
  async getCasesByLawyer(lawyerAddress: string): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.lawyer?.address.toLowerCase() === lawyerAddress.toLowerCase());
  }

  // Get active cases
  async getActiveCases(): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.status === CaseStatus.Accepted || c.status === CaseStatus.Funded);
  }

  // Get completed cases
  async getCompletedCases(): Promise<LegalCase[]> {
    const cases = await this.getAllCases();
    return cases.filter(c => c.status === CaseStatus.Resolved);
  }

  // Search cases
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

  // Get contract instance
  getContract(): ethers.Contract {
    return this.contract;
  }

  // Get contract address
  getContractAddress(): string {
    return this.contract.target as string;
  }
}
