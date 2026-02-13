/**
 * Satellite Routes
 * Defines API endpoints for satellite imagery and change detection
 */

const express = require('express');
const router = express.Router();
const SatelliteController = require('../controllers/satelliteController');

// Satellite Imagery Routes
router.get('/imagery/:plotId', SatelliteController.getSatelliteImagery);
router.get('/imagery/:plotId/date/:date', SatelliteController.getSatelliteImageryForDate);
router.get('/available-dates/:plotId', SatelliteController.getAvailableImageryDates);

// Spectral Analysis Routes
router.get('/spectral/ndvi/:plotId', SatelliteController.getNDVI);
router.get('/spectral/mndwi/:plotId', SatelliteController.getMNDWI);
router.get('/spectral/indices/:plotId', SatelliteController.getSpectralIndices);
router.get('/spectral/rgb/:plotId', SatelliteController.getRGBComposite);
router.get('/spectral/false-color/:plotId', SatelliteController.getFalseColorComposite);

// Change Detection Routes
router.post('/change-detection/compare', SatelliteController.detectChanges);
router.post('/change-detection/temporal', SatelliteController.detectTemporalChanges);
router.post('/change-detection/land-use', SatelliteController.detectLandUseChanges);
router.post('/change-detection/encroachment', SatelliteController.detectEncroachment);

// Batch Operations
router.post('/batch/analyze-area', SatelliteController.batchAnalyzeArea);

module.exports = router;
