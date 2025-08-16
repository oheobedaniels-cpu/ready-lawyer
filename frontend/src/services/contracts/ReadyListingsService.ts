import { ethers } from 'ethers';
import { User, LawyerProfile, CaseSignal } from '../../types';
import { dummyUsers } from '../../data/dummyData';

export class ReadyListingsService {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(contractAddress: string, signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    this.contract = new ethers.Contract(contractAddress, [
      'function createListing(string profileURI, uint256 hourlyRate, string[] tags) external',
      'function updateListing(string profileURI, uint256 hourlyRate, string[] tags) external',
      'function removeListing() external',
      'function createCaseSignal(string signalId, string caseURI, uint256 budgetMin, uint256 budgetMax, string[] tags) external',
      'function respondToSignal(string signalId, string proposal, uint256 estimatedCost, uint256 estimatedDuration, string[] qualifications) external',
      'function getListing(address lawyer) external view returns (tuple(string profileURI, uint256 hourlyRate, string[] tags, bool exists))',
      'function getCaseSignal(string signalId) external view returns (tuple(address client, string caseURI, uint256 budgetMin, uint256 budgetMax, string[] tags, uint8 status, uint256 urgency))',
      'function getSignalResponses(string signalId) external view returns (address[] lawyers)',
      'function getLawyerResponse(string signalId, address lawyer) external view returns (tuple(string proposal, uint256 estimatedCost, uint256 estimatedDuration, string[] qualifications, uint8 status))',
      'function pause() external',
      'function unpause() external'
    ], signer);
  }

  // Create a lawyer listing
  async createListing(
    profileURI: string,
    hourlyRate: string,
    tags: string[]
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.createListing(profileURI, hourlyRate, tags);
  }

  // Update an existing listing
  async updateListing(
    profileURI: string,
    hourlyRate: string,
    tags: string[]
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.updateListing(profileURI, hourlyRate, tags);
  }

  // Remove a listing
  async removeListing(): Promise<ethers.ContractTransaction> {
    return await this.contract.removeListing();
  }

  // Create a case signal (client looking for lawyer)
  async createCaseSignal(
    signalId: string,
    caseURI: string,
    budgetMin: string,
    budgetMax: string,
    tags: string[]
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.createCaseSignal(signalId, caseURI, budgetMin, budgetMax, tags);
  }

  // Respond to a case signal (lawyer responding to client)
  async respondToSignal(
    signalId: string,
    proposal: string,
    estimatedCost: string,
    estimatedDuration: string,
    qualifications: string[]
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.respondToSignal(
      signalId,
      proposal,
      estimatedCost,
      estimatedDuration,
      qualifications
    );
  }

  // Get lawyer listing
  async getListing(lawyerAddress: string): Promise<{
    profileURI: string;
    hourlyRate: string;
    tags: string[];
    exists: boolean;
  }> {
    const listing = await this.contract.getListing(lawyerAddress);
    return {
      profileURI: listing[0],
      hourlyRate: listing[1].toString(),
      tags: listing[2],
      exists: listing[3]
    };
  }

  // Get case signal
  async getCaseSignal(signalId: string): Promise<{
    client: string;
    caseURI: string;
    budgetMin: string;
    budgetMax: string;
    tags: string[];
    status: number;
    urgency: number;
  }> {
    const signal = await this.contract.getCaseSignal(signalId);
    return {
      client: signal[0],
      caseURI: signal[1],
      budgetMin: signal[2].toString(),
      budgetMax: signal[3].toString(),
      tags: signal[4],
      status: Number(signal[5]),
      urgency: Number(signal[6])
    };
  }

  // Get all lawyers responding to a signal
  async getSignalResponses(signalId: string): Promise<string[]> {
    return await this.contract.getSignalResponses(signalId);
  }

  // Get specific lawyer response to a signal
  async getLawyerResponse(signalId: string, lawyerAddress: string): Promise<{
    proposal: string;
    estimatedCost: string;
    estimatedDuration: string;
    qualifications: string[];
    status: number;
  }> {
    const response = await this.contract.getLawyerResponse(signalId, lawyerAddress);
    return {
      proposal: response[0],
      estimatedCost: response[1].toString(),
      estimatedDuration: response[2].toString(),
      qualifications: response[3],
      status: Number(response[4])
    };
  }

  // Get all lawyer listings (combines contract data with dummy data)
  async getAllListings(): Promise<User[]> {
    // For now, return dummy data. In production, this would fetch from contract
    return dummyUsers.filter(user => user.role === 'lawyer' && user.verified);
  }

  // Get listing by lawyer address
  async getListingByLawyer(lawyerAddress: string): Promise<User | null> {
    const listings = await this.getAllListings();
    return listings.find(user => user.address.toLowerCase() === lawyerAddress.toLowerCase()) || null;
  }

  // Get lawyers by specialization (tags)
  async getLawyersBySpecialization(specialization: string): Promise<User[]> {
    const listings = await this.getAllListings();
    // In production, this would filter by actual contract tags
    return listings.filter(user => 
      user.role === 'lawyer' && 
      user.verified
    );
  }

  // Get lawyers by hourly rate range
  async getLawyersByRateRange(minRate: number, maxRate: number): Promise<User[]> {
    const listings = await this.getAllListings();
    // In production, this would filter by actual contract hourly rates
    return listings.filter(user => 
      user.role === 'lawyer' && 
      user.verified
    );
  }

  // Search lawyer listings
  async searchLawyers(query: string): Promise<User[]> {
    const listings = await this.getAllListings();
    const lowerQuery = query.toLowerCase();
    return listings.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery)
    );
  }

  // Get top-rated lawyers
  async getTopRatedLawyers(limit: number = 10): Promise<User[]> {
    const listings = await this.getAllListings();
    return listings
      .filter(user => user.role === 'lawyer' && user.verified)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Get lawyers by location
  async getLawyersByLocation(location: string): Promise<User[]> {
    const listings = await this.getAllListings();
    // In production, this would filter by actual location data
    return listings.filter(user => 
      user.role === 'lawyer' && 
      user.verified
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
