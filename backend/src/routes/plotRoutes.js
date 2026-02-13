/**
 * Plot Routes
 * Defines API endpoints for plot-related operations
 */

const express = require('express');
const router = express.Router();
const PlotController = require('../controllers/plotController');

// GET /api/plots - Get all plots (with optional filters)
router.get('/', PlotController.getAllPlots);

// GET /api/plots/statistics - Get plot statistics
router.get('/statistics', PlotController.getStatistics);

// GET /api/plots/:id - Get specific plot by ID
router.get('/:id', PlotController.getPlotById);

// GET /api/plots/:id/current - Get current/live data for a plot
router.get('/:id/current', PlotController.getCurrentPlotData);

module.exports = router;
