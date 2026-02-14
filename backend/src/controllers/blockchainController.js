const blockchainService = require('../services/blockchainService');
const emailService = require('../services/emailService');

/**
 * Record complaint on blockchain with automated email notification
 */
exports.recordComplaintOnBlockchain = async (req, res) => {
  try {
    const { companyName, reason, email, phone, severity, location, details } = req.body;

    // Validate input
    if (!companyName || !reason || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: companyName, reason, email'
      });
    }

    // Record on blockchain
    const blockchainRecord = blockchainService.recordComplaint({
      companyName,
      reason,
      email,
      phone,
      severity: severity || 'Medium',
      location: location || 'Not specified',
      details: details || ''
    });

    // Generate blockchain proof
    const blockchainProof = blockchainService.generateComplaintProof(
      blockchainRecord.hash
    );

    // Send notifications
    const adminAlert = await emailService.sendAdminAlert(
      { companyName, reason, severity, email, phone, location, details },
      blockchainProof
    );

    const verificationEmail = await emailService.sendVerificationEmail(
      { companyName, reason, severity, email, phone, location, details },
      blockchainRecord.hash
    );

    res.status(201).json({
      status: 'success',
      message: 'Complaint recorded on blockchain and notifications sent',
      complaint: {
        companyName,
        reason,
        severity,
        location
      },
      blockchain: {
        blockNumber: blockchainRecord.blockNumber,
        hash: blockchainRecord.hash,
        timestamp: blockchainRecord.timestamp,
        chainLength: blockchainRecord.verification.chainLength,
        proof: blockchainProof
      },
      notifications: {
        adminAlert: adminAlert.status,
        verificationEmail: verificationEmail.status,
        verificationLink: verificationEmail.verificationLink
      }
    });
  } catch (error) {
    console.error('Error recording complaint:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Verify a complaint record on blockchain
 */
exports.verifyComplaintRecord = async (req, res) => {
  try {
    const { hash } = req.params;

    const verification = blockchainService.verifyRecord(hash);

    res.json({
      status: verification.isValid ? 'verified' : 'invalid',
      verification,
      blockchainStats: blockchainService.getBlockchainStats()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all blockchain complaint records
 */
exports.getAllComplaintRecords = async (req, res) => {
  try {
    const records = blockchainService.getAllRecords();
    const stats = blockchainService.getBlockchainStats();

    res.json({
      status: 'success',
      totalRecords: records.length,
      records,
      blockchain: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get blockchain transaction history (like blockchain explorer)
 */
exports.getBlockchainHistory = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const history = blockchainService.getTransactionHistory(parseInt(limit));

    res.json({
      status: 'success',
      transactions: history,
      totalBlocks: blockchainService.getBlockchainStats().totalBlocks
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get complaints by company
 */
exports.getComplaintsByCompany = async (req, res) => {
  try {
    const { companyName } = req.params;
    const complaints = blockchainService.getComplaintsByCompany(companyName);

    res.json({
      status: 'success',
      company: companyName,
      complaints,
      totalComplaints: complaints.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get blockchain statistics
 */
exports.getBlockchainStats = async (req, res) => {
  try {
    const stats = blockchainService.getBlockchainStats();

    res.json({
      status: 'success',
      blockchain: stats,
      integrityStatus: stats.chainIntegrity ? 'Valid ✓' : 'Compromised ✗'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
