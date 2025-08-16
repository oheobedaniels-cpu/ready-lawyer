import { ethers } from 'ethers';
import { User, PractitionerStatus } from '../../types';
import { dummyUsers } from '../../data/dummyData';

export class ReadyRolesService {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(contractAddress: string, signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    this.contract = new ethers.Contract(contractAddress, [
      'function registerPractitioner(string profileURI) external',
      'function approvePractitioner(address practitioner) external',
      'function revokePractitioner(address practitioner) external',
      'function getPractitionerStatus(address practitioner) external view returns (uint8)',
      'function getPractitionerProfile(address practitioner) external view returns (string)',
      'function isLawyer(address practitioner) external view returns (bool)',
      'function isJudge(address practitioner) external view returns (bool)',
      'function isAdmin(address account) external view returns (bool)',
      'function grantRole(bytes32 role, address account) external',
      'function revokeRole(bytes32 role, address account) external',
      'function hasRole(bytes32 role, address account) external view returns (bool)'
    ], signer);
  }

  // Register as a legal practitioner
  async registerPractitioner(profileURI: string): Promise<ethers.ContractTransaction> {
    return await this.contract.registerPractitioner(profileURI);
  }

  // Approve a practitioner (admin only)
  async approvePractitioner(practitionerAddress: string): Promise<ethers.ContractTransaction> {
    return await this.contract.approvePractitioner(practitionerAddress);
  }

  // Revoke a practitioner (admin only)
  async revokePractitioner(practitionerAddress: string): Promise<ethers.ContractTransaction> {
    return await this.contract.revokePractitioner(practitionerAddress);
  }

  // Get practitioner status
  async getPractitionerStatus(practitionerAddress: string): Promise<PractitionerStatus> {
    const status = await this.contract.getPractitionerStatus(practitionerAddress);
    return Number(status);
  }

  // Get practitioner profile URI
  async getPractitionerProfile(practitionerAddress: string): Promise<string> {
    return await this.contract.getPractitionerProfile(practitionerAddress);
  }

  // Check if address is a lawyer
  async isLawyer(practitionerAddress: string): Promise<boolean> {
    return await this.contract.isLawyer(practitionerAddress);
  }

  // Check if address is a judge
  async isJudge(practitionerAddress: string): Promise<boolean> {
    return await this.contract.isJudge(practitionerAddress);
  }

  // Check if address is an admin
  async isAdmin(accountAddress: string): Promise<boolean> {
    return await this.contract.isAdmin(accountAddress);
  }

  // Grant role to account (admin only)
  async grantRole(role: string, accountAddress: string): Promise<ethers.ContractTransaction> {
    const roleHash = ethers.keccak256(ethers.toUtf8Bytes(role));
    return await this.contract.grantRole(roleHash, accountAddress);
  }

  // Revoke role from account (admin only)
  async revokeRole(role: string, accountAddress: string): Promise<ethers.ContractTransaction> {
    const roleHash = ethers.keccak256(ethers.toUtf8Bytes(role));
    return await this.contract.revokeRole(roleHash, accountAddress);
  }

  // Check if account has role
  async hasRole(role: string, accountAddress: string): Promise<boolean> {
    const roleHash = ethers.keccak256(ethers.toUtf8Bytes(role));
    return await this.contract.hasRole(roleHash, accountAddress);
  }

  // Get all practitioners (combines contract data with dummy data)
  async getAllPractitioners(): Promise<User[]> {
    // For now, return dummy data. In production, this would fetch from contract
    return dummyUsers.filter(user => user.role === 'lawyer' || user.role === 'judge');
  }

  // Get practitioner by address
  async getPractitionerByAddress(address: string): Promise<User | null> {
    const practitioners = await this.getAllPractitioners();
    return practitioners.find(user => user.address.toLowerCase() === address.toLowerCase()) || null;
  }

  // Get verified lawyers
  async getVerifiedLawyers(): Promise<User[]> {
    const practitioners = await this.getAllPractitioners();
    return practitioners.filter(user => user.role === 'lawyer' && user.verified);
  }

  // Get verified judges
  async getVerifiedJudges(): Promise<User[]> {
    const practitioners = await this.getAllPractitioners();
    return practitioners.filter(user => user.role === 'judge' && user.verified);
  }

  // Search practitioners
  async searchPractitioners(query: string): Promise<User[]> {
    const practitioners = await this.getAllPractitioners();
    const lowerQuery = query.toLowerCase();
    return practitioners.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery)
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
