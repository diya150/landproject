/**
 * Analysis Routes
 * Defines API endpoints for analysis and violation detection
 */

const express = require('express');
const router = express.Router();
const AnalysisController = require('../controllers/analysisController');

// GET /api/analysis - Analyze all plots
router.get('/', AnalysisController.analyzeAllPlots);

// GET /api/analysis/summary - Get analysis summary
router.get('/summary', AnalysisController.getSummary);

// GET /api/analysis/violations - Get plots with violations
router.get('/violations', AnalysisController.getViolations);

// GET /api/analysis/alerts - Get critical alerts
router.get('/alerts', AnalysisController.getAlerts);

// GET /api/analysis/:id - Analyze specific plot
router.get('/:id', AnalysisController.analyzePlot);

module.exports = router;
