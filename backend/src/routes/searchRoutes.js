/**
 * Search Routes
 * Handles all plot search endpoints
 */

const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');

// Search endpoints
router.get('/', SearchController.search);
router.get('/suggestions', SearchController.suggestions);
router.get('/all', SearchController.getAllPlots);

module.exports = router;
