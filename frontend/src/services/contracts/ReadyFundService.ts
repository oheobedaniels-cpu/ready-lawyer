import { ethers } from 'ethers';
import { FundraisingCampaign, CampaignStatus } from '../../types';
import { dummyCampaigns } from '../../data/dummyData';

export class ReadyFundService {
  private contract: ethers.Contract;


  constructor(contractAddress: string, signer: ethers.JsonRpcSigner) {
    this.contract = new ethers.Contract(contractAddress, [
      'function createCampaign(string id, address beneficiary, bool beneficiaryIsLawyer, address token, uint256 goalAmount, uint256 deadline) external',
      'function contribute(string id) external payable',
      'function withdrawFunds(string id) external',
      'function cancelCampaign(string id) external',
      'function refundContributors(string id) external',
      'function getCampaign(string id) external view returns (tuple(address creator, address beneficiary, address token, uint256 goal, uint256 deadline, uint256 raised, uint8 status, bool beneficiaryIsLawyer))',
      'function getCampaignStatus(string id) external view returns (uint8)',
      'function getCampaignBalance(string id) external view returns (uint256)',
      'function getContribution(string id, address contributor) external view returns (uint256)',
      'function pause() external',
      'function unpause() external'
    ], signer);
  }

  // Create a new fundraising campaign
  async createCampaign(
    id: string,
    beneficiary: string,
    beneficiaryIsLawyer: boolean,
    token: string,
    goalAmount: string,
    deadline: number
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.createCampaign(
      id,
      beneficiary,
      beneficiaryIsLawyer,
      token,
      goalAmount,
      deadline
    );
  }

  // Contribute to a campaign
  async contribute(campaignId: string, amount?: string): Promise<ethers.ContractTransaction> {
    if (amount) {
      return await this.contract.contribute(campaignId, { value: ethers.parseEther(amount) });
    }
    return await this.contract.contribute(campaignId);
  }

  // Withdraw funds from successful campaign
  async withdrawFunds(campaignId: string): Promise<ethers.ContractTransaction> {
    return await this.contract.withdrawFunds(campaignId);
  }

  // Cancel a campaign
  async cancelCampaign(campaignId: string): Promise<ethers.ContractTransaction> {
    return await this.contract.cancelCampaign(campaignId);
  }

  // Refund contributors for failed campaign
  async refundContributors(campaignId: string): Promise<ethers.ContractTransaction> {
    return await this.contract.refundContributors(campaignId);
  }

  // Get campaign data
  async getCampaign(campaignId: string): Promise<{
    creator: string;
    beneficiary: string;
    token: string;
    goal: string;
    deadline: number;
    raised: string;
    status: CampaignStatus;
    beneficiaryIsLawyer: boolean;
  }> {
    const campaign = await this.contract.getCampaign(campaignId);
    return {
      creator: campaign[0],
      beneficiary: campaign[1],
      token: campaign[2],
      goal: campaign[3].toString(),
      deadline: Number(campaign[4]),
      raised: campaign[5].toString(),
      status: Number(campaign[6]),
      beneficiaryIsLawyer: campaign[7]
    };
  }

  // Get campaign status
  async getCampaignStatus(campaignId: string): Promise<CampaignStatus> {
    const status = await this.contract.getCampaignStatus(campaignId);
    return Number(status);
  }

  // Get campaign balance
  async getCampaignBalance(campaignId: string): Promise<string> {
    const balance = await this.contract.getCampaignBalance(campaignId);
    return ethers.formatEther(balance);
  }

  // Get contribution amount for a specific contributor
  async getContribution(campaignId: string, contributorAddress: string): Promise<string> {
    const contribution = await this.contract.getContribution(campaignId, contributorAddress);
    return ethers.formatEther(contribution);
  }

  // Get all campaigns (combines contract data with dummy data)
  async getAllCampaigns(): Promise<FundraisingCampaign[]> {
    // For now, return dummy data. In production, this would fetch from contract
    return dummyCampaigns;
  }

  // Get campaign by ID
  async getCampaignById(campaignId: string): Promise<FundraisingCampaign | null> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.find(c => c.id === campaignId) || null;
  }

  // Get campaigns by creator
  async getCampaignsByCreator(creatorAddress: string): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.creator.address.toLowerCase() === creatorAddress.toLowerCase());
  }

  // Get campaigns by beneficiary
  async getCampaignsByBeneficiary(beneficiaryAddress: string): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.beneficiary.address.toLowerCase() === beneficiaryAddress.toLowerCase());
  }

  // Get active campaigns
  async getActiveCampaigns(): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.status === CampaignStatus.Active);
  }

  // Get successful campaigns
  async getSuccessfulCampaigns(): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.status === CampaignStatus.Succeeded);
  }

  // Get failed campaigns
  async getFailedCampaigns(): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.status === CampaignStatus.Failed);
  }

  // Search campaigns
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

  // Get campaigns by category
  async getCampaignsByCategory(category: string): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    return campaigns.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  // Get urgent campaigns (deadline approaching)
  async getUrgentCampaigns(daysThreshold: number = 7): Promise<FundraisingCampaign[]> {
    const campaigns = await this.getAllCampaigns();
    const now = Date.now();
    const threshold = daysThreshold * 24 * 60 * 60 * 1000;
    return campaigns.filter(c => 
      c.status === CampaignStatus.Active && 
      (c.deadline - now) <= threshold
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
