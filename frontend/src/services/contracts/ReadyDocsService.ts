import { ethers } from 'ethers';
import { LegalDocument, DocType, Version } from '../../types';
import { dummyDocuments } from '../../data/dummyData';

export class ReadyDocsService {
  private contract: ethers.Contract;


  constructor(contractAddress: string, signer: ethers.JsonRpcSigner) {
    this.contract = new ethers.Contract(contractAddress, [
      'function createDocument(bytes32 docId, uint8 docType, string caseId, string initialCid) external',
      'function addVersion(bytes32 docId, string cid) external',
      'function revokeVersion(bytes32 docId, uint256 index) external',
      'function docTypeOf(bytes32 docId) external view returns (uint8)',
      'function versionCount(bytes32 docId) external view returns (uint256)',
      'function getVersion(bytes32 docId, uint256 index) external view returns (tuple(string cid, uint256 timestamp, bool revoked, address author))',
      'function pause() external',
      'function unpause() external',
      'function setOperator(address account, bool ok) external'
    ], signer);
  }

  // Create a new document
  async createDocument(
    docId: string,
    docType: keyof DocType,
    caseId: string,
    initialCid: string
  ): Promise<ethers.ContractTransaction> {
    const docTypeValue = this.getDocTypeValue(docType);
    return await this.contract.createDocument(
      ethers.keccak256(ethers.toUtf8Bytes(docId)),
      docTypeValue,
      caseId,
      initialCid
    );
  }

  // Add a new version to an existing document
  async addVersion(docId: string, cid: string): Promise<ethers.ContractTransaction> {
    return await this.contract.addVersion(
      ethers.keccak256(ethers.toUtf8Bytes(docId)),
      cid
    );
  }

  // Revoke a specific version
  async revokeVersion(docId: string, index: number): Promise<ethers.ContractTransaction> {
    return await this.contract.revokeVersion(
      ethers.keccak256(ethers.toUtf8Bytes(docId)),
      index
    );
  }

  // Get document type
  async getDocType(docId: string): Promise<keyof DocType> {
    const docTypeValue = await this.contract.docTypeOf(ethers.keccak256(ethers.toUtf8Bytes(docId)));
    return this.getDocTypeKey(docTypeValue);
  }

  // Get version count
  async getVersionCount(docId: string): Promise<number> {
    return await this.contract.versionCount(ethers.keccak256(ethers.toUtf8Bytes(docId)));
  }

  // Get specific version
  async getVersion(docId: string, index: number): Promise<Version> {
    const version = await this.contract.getVersion(ethers.keccak256(ethers.toUtf8Bytes(docId)), index);
    return {
      cid: version[0],
      timestamp: Number(version[1]),
      revoked: version[2],
      author: version[3]
    };
  }

  // Get all documents (combines contract data with dummy data)
  async getAllDocuments(): Promise<LegalDocument[]> {
    // For now, return dummy data. In production, this would fetch from contract
    return dummyDocuments;
  }

  // Get document by ID
  async getDocumentById(docId: string): Promise<LegalDocument | null> {
    const documents = await this.getAllDocuments();
    return documents.find(doc => doc.id === docId) || null;
  }

  // Get documents by case ID
  async getDocumentsByCaseId(caseId: string): Promise<LegalDocument[]> {
    const documents = await this.getAllDocuments();
    return documents.filter(doc => doc.caseId === caseId);
  }

  // Search documents
  async searchDocuments(query: string): Promise<LegalDocument[]> {
    const documents = await this.getAllDocuments();
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Helper methods
  private getDocTypeValue(docType: keyof DocType): number {
    const docTypeMap: Record<keyof DocType, number> = {
      Other: 0,
      Pleading: 1,
      Judgment: 2,
      Contract: 3,
      Evidence: 4
    };
    return docTypeMap[docType];
  }

  private getDocTypeKey(docTypeValue: number): keyof DocType {
    const docTypeMap: Record<number, keyof DocType> = {
      0: 'Other',
      1: 'Pleading',
      2: 'Judgment',
      3: 'Contract',
      4: 'Evidence'
    };
    return docTypeMap[docTypeValue] || 'Other';
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
