/**
 * Frontend Blockchain Service
 * Handles communication with blockchain API for complaint recording
 */

const API_BASE_URL = 'http://localhost:3001/api/blockchain';

export const blockchainService = {
  /**
   * Record a complaint on blockchain
   */
  async recordComplaint(complaintData: {
    companyName: string;
    reason: string;
    email: string;
    phone?: string;
    severity?: string;
    location?: string;
    details?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/complaint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(complaintData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error recording complaint:', error);
      throw error;
    }
  },

  /**
   * Verify a complaint record on blockchain
   */
  async verifyRecord(hash: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/complaint/${hash}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying record:', error);
      throw error;
    }
  },

  /**
   * Get all complaint records
   */
  async getAllRecords() {
    try {
      const response = await fetch(`${API_BASE_URL}/records`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  /**
   * Get complaints for a specific company
   */
  async getComplaintsByCompany(companyName: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/company/${encodeURIComponent(companyName)}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching company complaints:', error);
      throw error;
    }
  },

  /**
   * Get blockchain transaction history
   */
  async getTransactionHistory(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  },

  /**
   * Get blockchain statistics
   */
  async getBlockchainStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blockchain stats:', error);
      throw error;
    }
  }
};
