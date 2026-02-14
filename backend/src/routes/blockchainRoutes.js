const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');

/**
 * POST /api/blockchain/complaint
 * Record a complaint on blockchain with automated email
 */
router.post('/complaint', blockchainController.recordComplaintOnBlockchain);

/**
 * GET /api/blockchain/complaint/:hash
 * Verify a complaint record on blockchain
 */
router.get('/complaint/:hash', blockchainController.verifyComplaintRecord);

/**
 * GET /api/blockchain/records
 * Get all complaint records from blockchain
 */
router.get('/records', blockchainController.getAllComplaintRecords);

/**
 * GET /api/blockchain/company/:companyName
 * Get all complaints for a specific company
 */
router.get('/company/:companyName', blockchainController.getComplaintsByCompany);

/**
 * GET /api/blockchain/history
 * Get blockchain transaction history (like blockchain explorer)
 */
router.get('/history', blockchainController.getBlockchainHistory);

/**
 * GET /api/blockchain/stats
 * Get blockchain statistics
 */
router.get('/stats', blockchainController.getBlockchainStats);

module.exports = router;
