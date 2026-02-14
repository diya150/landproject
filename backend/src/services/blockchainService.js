const crypto = require('crypto');

/**
 * Simulated Blockchain Service
 * Records complaint emails with cryptographic hashing for immutability
 * Each record is linked to the previous one (chain structure)
 */

class BlockchainRecord {
  constructor(index, complaint, previousHash) {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.complaint = complaint;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.blockNumber = `0x${index.toString(16)}`; // Hex format like blockchain
  }

  calculateHash() {
    const data = JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      complaint: this.complaint,
      previousHash: this.previousHash
    });
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }
}

class BlockchainService {
  constructor() {
    this.chain = [];
    this.records = {};
    this.initializeGenesis();
  }

  // Create genesis block
  initializeGenesis() {
    const genesisBlock = new BlockchainRecord(
      0,
      {
        companyName: 'Genesis Block',
        reason: 'System Initialization',
        email: 'system@industrialmonitoring.local'
      },
      '0'
    );
    this.chain.push(genesisBlock);
  }

  /**
   * Record a complaint on blockchain
   * @param {Object} complaint - Complaint data
   * @returns {Object} Blockchain record with verification hash
   */
  recordComplaint(complaint) {
    const previousBlock = this.chain[this.chain.length - 1];
    const newRecord = new BlockchainRecord(
      this.chain.length,
      {
        companyName: complaint.companyName,
        reason: complaint.reason,
        email: complaint.email,
        phone: complaint.phone,
        severity: complaint.severity || 'Medium',
        location: complaint.location,
        details: complaint.details
      },
      previousBlock.hash
    );

    // Verify chain integrity
    if (!this.verifyChainIntegrity()) {
      throw new Error('Blockchain integrity compromised. Recording aborted.');
    }

    this.chain.push(newRecord);
    this.records[newRecord.hash] = newRecord;

    return {
      status: 'recorded',
      blockNumber: newRecord.blockNumber,
      hash: newRecord.hash,
      timestamp: newRecord.timestamp,
      index: newRecord.index,
      verification: {
        isValid: true,
        chainLength: this.chain.length,
        previousBlockHash: previousBlock.hash
      }
    };
  }

  /**
   * Verify the entire blockchain chain integrity
   */
  verifyChainIntegrity() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check current block's hash is correct
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Check link to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  /**
   * Verify a specific complaint record
   */
  verifyRecord(hash) {
    if (!this.records[hash]) {
      return { isValid: false, reason: 'Record not found' };
    }

    const record = this.records[hash];
    const isValid = record.hash === record.calculateHash();
    
    return {
      isValid,
      record,
      chainPosition: record.index,
      timestamp: record.timestamp,
      chainLength: this.chain.length
    };
  }

  /**
   * Get all complaints recorded on blockchain
   */
  getAllRecords() {
    return this.chain.slice(1).map((block) => ({
      blockNumber: block.blockNumber,
      hash: block.hash,
      timestamp: block.timestamp,
      companyName: block.complaint.companyName,
      reason: block.complaint.reason,
      email: block.complaint.email,
      severity: block.complaint.severity,
      location: block.complaint.location,
      details: block.complaint.details,
      index: block.index
    }));
  }

  /**
   * Get complaints by company name
   */
  getComplaintsByCompany(companyName) {
    return this.getAllRecords().filter(
      (record) => record.companyName.toLowerCase() === companyName.toLowerCase()
    );
  }

  /**
   * Get blockchain statistics
   */
  getBlockchainStats() {
    return {
      totalBlocks: this.chain.length,
      totalRecords: this.chain.length - 1, // Excluding genesis block
      chainIntegrity: this.verifyChainIntegrity(),
      latestBlockHash: this.chain[this.chain.length - 1].hash,
      genesisHash: this.chain[0].hash
    };
  }

  /**
   * Get transaction history (like blockchain explorer)
   */
  getTransactionHistory(limit = 10) {
    return this.chain
      .slice(1)
      .reverse()
      .slice(0, limit)
      .map((block) => ({
        transactionHash: block.hash,
        blockNumber: block.blockNumber,
        timestamp: block.timestamp,
        from: 'System',
        to: block.complaint.email,
        value: `Complaint: ${block.complaint.reason.substring(0, 50)}...`,
        status: 'confirmed'
      }));
  }

  /**
   * Generate blockchain proof for a complaint
   */
  generateComplaintProof(hash) {
    const record = this.records[hash];
    if (!record) {
      return null;
    }

    return {
      complaintHash: hash,
      blockNumber: record.blockNumber,
      timestamp: record.timestamp,
      companyName: record.complaint.companyName,
      reason: record.complaint.reason,
      merkleProof: `0x${crypto
        .createHash('sha256')
        .update(JSON.stringify(record.complaint))
        .digest('hex')}`,
      chainValidation: this.verifyChainIntegrity(),
      proofTimestamp: new Date().toISOString()
    };
  }
}

module.exports = new BlockchainService();
