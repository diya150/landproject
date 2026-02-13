/**
 * Satellite Controller
 * Handles HTTP requests for satellite imagery and change detection
 */

const SatelliteService = require('../services/satelliteService');
const ChangeDetectionService = require('../services/changeDetectionService');
const PlotService = require('../services/plotService');

class SatelliteController {
  /**
   * Get satellite imagery for a plot
   * GET /api/satellite/imagery/:plotId
   */
  static async getSatelliteImagery(req, res) {
    try {
      const { plotId } = req.params;
      const { date } = req.query;

      // Verify plot exists
      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const imagery = await SatelliteService.getSatelliteImagery(plot, date);

      res.status(200).json({
        success: true,
        data: imagery
      });
    } catch (error) {
      console.error('Error getting satellite imagery:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch satellite imagery',
        message: error.message
      });
    }
  }

  /**
   * Get satellite imagery for a specific date
   * GET /api/satellite/imagery/:plotId/date/:date
   */
  static async getSatelliteImageryForDate(req, res) {
    try {
      const { plotId, date } = req.params;

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const imagery = await SatelliteService.getSatelliteImagery(plot, date);

      res.status(200).json({
        success: true,
        data: imagery
      });
    } catch (error) {
      console.error('Error getting satellite imagery for date:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch satellite imagery',
        message: error.message
      });
    }
  }

  /**
   * Get available imagery dates for a plot
   * GET /api/satellite/available-dates/:plotId
   */
  static async getAvailableImageryDates(req, res) {
    try {
      const { plotId } = req.params;
      const { startDate, endDate } = req.query;

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const start = startDate || new Date(Date.now() - 90*24*60*60*1000).toISOString().split('T')[0];
      const end = endDate || new Date().toISOString().split('T')[0];

      const dates = await SatelliteService.getAvailableImageryDates(
        plot.coordinates,
        start,
        end
      );

      res.status(200).json({
        success: true,
        data: dates
      });
    } catch (error) {
      console.error('Error getting available imagery dates:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch available imagery dates',
        message: error.message
      });
    }
  }

  /**
   * Get NDVI for a plot
   * GET /api/satellite/spectral/ndvi/:plotId
   */
  static async getNDVI(req, res) {
    try {
      const { plotId } = req.params;
      const { date } = req.query;

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const ndvi = await SatelliteService.getNDVI(plot.coordinates, date);

      res.status(200).json({
        success: true,
        data: ndvi
      });
    } catch (error) {
      console.error('Error getting NDVI:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate NDVI',
        message: error.message
      });
    }
  }

  /**
   * Get MNDWI for a plot
   * GET /api/satellite/spectral/mndwi/:plotId
   */
  static async getMNDWI(req, res) {
    try {
      const { plotId } = req.params;
      const { date } = req.query;

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const mndwi = await SatelliteService.getMNDWI(plot.coordinates, date);

      res.status(200).json({
        success: true,
        data: mndwi
      });
    } catch (error) {
      console.error('Error getting MNDWI:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate MNDWI',
        message: error.message
      });
    }
  }

  /**
   * Get spectral indices for a plot
   * GET /api/satellite/spectral/indices/:plotId
   */
  static async getSpectralIndices(req, res) {
    try {
      const { plotId } = req.params;
      const { date } = req.query;

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const indices = await SatelliteService.getSpectralIndices(plot.coordinates, date);

      res.status(200).json({
        success: true,
        data: indices
      });
    } catch (error) {
      console.error('Error getting spectral indices:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get spectral indices',
        message: error.message
      });
    }
  }

  /**
   * Get RGB composite for a plot
   * GET /api/satellite/spectral/rgb/:plotId
   */
  static async getRGBComposite(req, res) {
    try {
      const { plotId } = req.params;
      const { date } = req.query;

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const rgb = await SatelliteService.getRGBComposite(plot.coordinates, date);

      res.status(200).json({
        success: true,
        data: rgb
      });
    } catch (error) {
      console.error('Error getting RGB composite:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get RGB composite',
        message: error.message
      });
    }
  }

  /**
   * Get false color composite for a plot
   * GET /api/satellite/spectral/false-color/:plotId
   */
  static async getFalseColorComposite(req, res) {
    try {
      const { plotId } = req.params;
      const { date } = req.query;

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const falseColor = await SatelliteService.getFalseColorComposite(plot.coordinates, date);

      res.status(200).json({
        success: true,
        data: falseColor
      });
    } catch (error) {
      console.error('Error getting false color composite:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get false color composite',
        message: error.message
      });
    }
  }

  /**
   * Detect changes between two dates
   * POST /api/satellite/change-detection/compare
   */
  static async detectChanges(req, res) {
    try {
      const { plotId, beforeDate, afterDate } = req.body;

      if (!plotId || !beforeDate || !afterDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
          required: ['plotId', 'beforeDate', 'afterDate']
        });
      }

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const changeDetection = await ChangeDetectionService.detectChanges(
        plot,
        beforeDate,
        afterDate
      );

      res.status(200).json({
        success: true,
        data: changeDetection
      });
    } catch (error) {
      console.error('Error detecting changes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to detect changes',
        message: error.message
      });
    }
  }

  /**
   * Detect temporal changes
   * POST /api/satellite/change-detection/temporal
   */
  static async detectTemporalChanges(req, res) {
    try {
      const { coordinates, startDate, endDate } = req.body;

      if (!coordinates || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
          required: ['coordinates', 'startDate', 'endDate']
        });
      }

      const temporalAnalysis = await ChangeDetectionService.detectTemporalChanges(
        coordinates,
        startDate,
        endDate
      );

      res.status(200).json({
        success: true,
        data: temporalAnalysis
      });
    } catch (error) {
      console.error('Error detecting temporal changes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to detect temporal changes',
        message: error.message
      });
    }
  }

  /**
   * Detect land use changes
   * POST /api/satellite/change-detection/land-use
   */
  static async detectLandUseChanges(req, res) {
    try {
      const { coordinates, date1, date2 } = req.body;

      if (!coordinates || !date1 || !date2) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
          required: ['coordinates', 'date1', 'date2']
        });
      }

      const landUseAnalysis = await ChangeDetectionService.detectLandUseChanges(
        coordinates,
        date1,
        date2
      );

      res.status(200).json({
        success: true,
        data: landUseAnalysis
      });
    } catch (error) {
      console.error('Error detecting land use changes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to detect land use changes',
        message: error.message
      });
    }
  }

  /**
   * Detect encroachment
   * POST /api/satellite/change-detection/encroachment
   */
  static async detectEncroachment(req, res) {
    try {
      const { plotId, beforeDate, afterDate } = req.body;

      if (!plotId || !beforeDate || !afterDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
          required: ['plotId', 'beforeDate', 'afterDate']
        });
      }

      const plot = PlotService.getPlotById(plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          plotId
        });
      }

      const encroachmentAnalysis = await ChangeDetectionService.detectEncroachment(
        plot,
        beforeDate,
        afterDate
      );

      res.status(200).json({
        success: true,
        data: encroachmentAnalysis
      });
    } catch (error) {
      console.error('Error detecting encroachment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to detect encroachment',
        message: error.message
      });
    }
  }

  /**
   * Batch analyze an area
   * POST /api/satellite/batch/analyze-area
   */
  static async batchAnalyzeArea(req, res) {
    try {
      const { coordinates, startDate, endDate } = req.body;

      if (!coordinates || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
          required: ['coordinates', 'startDate', 'endDate']
        });
      }

      // Perform multiple analyses
      const [imagery, ndvi, mndwi, indices, temporal] = await Promise.all([
        SatelliteService.getSatelliteImagery({ coordinates }, null),
        SatelliteService.getNDVI(coordinates),
        SatelliteService.getMNDWI(coordinates),
        SatelliteService.getSpectralIndices(coordinates),
        ChangeDetectionService.detectTemporalChanges(coordinates, startDate, endDate)
      ]);

      res.status(200).json({
        success: true,
        data: {
          imagery,
          ndvi: ndvi.ndvi,
          mndwi: mndwi.mndwi,
          indices: indices.indices,
          temporalAnalysis: temporal.temporalAnalysis,
          analysisTimestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in batch analysis:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete batch analysis',
        message: error.message
      });
    }
  }
}

module.exports = SatelliteController;
