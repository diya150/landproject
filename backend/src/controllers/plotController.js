/**
 * Plot Controller
 * Handles HTTP requests related to plot data
 */

const PlotService = require('../services/plotService');

class PlotController {
  /**
   * GET /plots
   * Get all plots with optional filtering
   */
  static async getAllPlots(req, res) {
    try {
      const { industryType, category } = req.query;

      let plots;

      if (industryType) {
        plots = PlotService.getPlotsByIndustryType(industryType);
      } else if (category) {
        plots = PlotService.getPlotsByCategory(category);
      } else {
        plots = PlotService.getAllPlots();
      }

      res.status(200).json({
        success: true,
        count: plots.length,
        data: plots
      });
    } catch (error) {
      console.error('Error fetching plots:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch plots',
        message: error.message
      });
    }
  }

  /**
   * GET /plots/:id
   * Get a specific plot by ID
   */
  static async getPlotById(req, res) {
    try {
      const { id } = req.params;

      const plot = PlotService.getPlotById(id);

      if (!plot) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          message: `Plot with ID ${id} does not exist`
        });
      }

      res.status(200).json({
        success: true,
        data: plot
      });
    } catch (error) {
      console.error('Error fetching plot:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch plot',
        message: error.message
      });
    }
  }

  /**
   * GET /plots/statistics
   * Get statistical summary of all plots
   */
  static async getStatistics(req, res) {
    try {
      const statistics = PlotService.getPlotStatistics();

      res.status(200).json({
        success: true,
        data: statistics
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        message: error.message
      });
    }
  }

  /**
   * GET /plots/:id/current
   * Get current/live data for a specific plot
   */
  static async getCurrentPlotData(req, res) {
    try {
      const { id } = req.params;

      // Check if plot exists
      if (!PlotService.plotExists(id)) {
        return res.status(404).json({
          success: false,
          error: 'Plot not found',
          message: `Plot with ID ${id} does not exist`
        });
      }

      const currentData = await PlotService.getCurrentPlotData(id);

      if (!currentData) {
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch current data',
          message: 'Unable to retrieve live plot data from satellite source'
        });
      }

      res.status(200).json({
        success: true,
        data: currentData
      });
    } catch (error) {
      console.error('Error fetching current plot data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch current plot data',
        message: error.message
      });
    }
  }
}

module.exports = PlotController;
