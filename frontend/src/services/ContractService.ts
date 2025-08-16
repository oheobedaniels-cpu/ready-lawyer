import { ethers } from 'ethers';
import { ReadyDocsService } from './contracts/ReadyDocsService';
import { ReadyRolesService } from './contracts/ReadyRolesService';
import { ReadyEscrowService } from './contracts/ReadyEscrowService';
import { ReadyFundService } from './contracts/ReadyFundService';
import { ReadyListingsService } from './contracts/ReadyListingsService';
import { CONTRACT_ADDRESSES } from '../types';

export class ContractService {
  private readyDocs: ReadyDocsService | null = null;
  private readyRoles: ReadyRolesService | null = null;
  private readyEscrow: ReadyEscrowService | null = null;
  private readyFund: ReadyFundService | null = null;
  private readyListings: ReadyListingsService | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {}

  // Initialize all contract services
  initialize(signer: ethers.JsonRpcSigner, contractAddresses?: Partial<typeof CONTRACT_ADDRESSES>) {
    this.signer = signer;
    const addresses = { ...CONTRACT_ADDRESSES, ...contractAddresses };

    if (addresses.READY_DOCS && signer) {
      this.readyDocs = new ReadyDocsService(addresses.READY_DOCS, signer);
    }

    if (addresses.READY_ROLES && signer) {
      this.readyRoles = new ReadyRolesService(addresses.READY_ROLES, signer);
    }

    if (addresses.READY_ESCROW && signer) {
      this.readyEscrow = new ReadyEscrowService(addresses.READY_ESCROW, signer);
    }

    if (addresses.READY_FUND && signer) {
      this.readyFund = new ReadyFundService(addresses.READY_FUND, signer);
    }

    if (addresses.READY_LISTINGS && signer) {
      this.readyListings = new ReadyListingsService(addresses.READY_LISTINGS, signer);
    }
  }

  // Check if contracts are initialized
  isInitialized(): boolean {
    return this.signer !== null;
  }

  // Get ReadyDocs service
  getReadyDocs(): ReadyDocsService | null {
    return this.readyDocs;
  }

  // Get ReadyRoles service
  getReadyRoles(): ReadyRolesService | null {
    return this.readyRoles;
  }

  // Get ReadyEscrow service
  getReadyEscrow(): ReadyEscrowService | null {
    return this.readyEscrow;
  }

  // Get ReadyFund service
  getReadyFund(): ReadyFundService | null {
    return this.readyFund;
  }

  // Get ReadyListings service
  getReadyListings(): ReadyListingsService | null {
    return this.readyListings;
  }

  // Get all available services
  getAllServices() {
    return {
      readyDocs: this.readyDocs,
      readyRoles: this.readyRoles,
      readyEscrow: this.readyEscrow,
      readyFund: this.readyFund,
      readyListings: this.readyListings
    };
  }

  // Check if specific service is available
  hasService(serviceName: keyof ReturnType<typeof this.getAllServices>): boolean {
    return this.getAllServices()[serviceName] !== null;
  }

  // Get contract status
  getContractStatus() {
    return {
      readyDocs: this.hasService('readyDocs'),
      readyRoles: this.hasService('readyRoles'),
      readyEscrow: this.hasService('readyEscrow'),
      readyFund: this.hasService('readyFund'),
      readyListings: this.hasService('readyListings')
    };
  }

  // Get signer
  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }

  // Clear all services (useful for disconnecting)
  clear() {
    this.readyDocs = null;
    this.readyRoles = null;
    this.readyEscrow = null;
    this.readyFund = null;
    this.readyListings = null;
    this.signer = null;
  }
}

// Create a singleton instance
export const contractService = new ContractService();
