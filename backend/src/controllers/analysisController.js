/**
 * Analysis Controller
 * Handles HTTP requests related to plot analysis and violation detection
 */

const AnalysisService = require('../services/analysisService');
const PlotService = require('../services/plotService');

class AnalysisController {
  /**
   * GET /analysis/:id
   * Get comprehensive analysis for a specific plot
   */
  static async analyzePlot(req, res) {
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

      const analysis = await AnalysisService.analyzePlot(id);

      res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Error analyzing plot:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze plot',
        message: error.message
      });
    }
  }

  /**
   * GET /analysis
   * Get analysis for all plots
   */
  static async analyzeAllPlots(req, res) {
    try {
      const analysisResults = await AnalysisService.analyzeAllPlots();

      res.status(200).json({
        success: true,
        data: analysisResults
      });
    } catch (error) {
      console.error('Error analyzing all plots:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze plots',
        message: error.message
      });
    }
  }

  /**
   * GET /analysis/violations
   * Get plots with violations only
   */
  static async getViolations(req, res) {
    try {
      const violations = await AnalysisService.getViolationAlerts();

      res.status(200).json({
        success: true,
        count: violations.length,
        data: violations
      });
    } catch (error) {
      console.error('Error fetching violations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch violations',
        message: error.message
      });
    }
  }

  /**
   * GET /analysis/alerts
   * Get critical alerts (violations and warnings)
   */
  static async getAlerts(req, res) {
    try {
      const alerts = await AnalysisService.getViolationAlerts();

      // Format alerts for immediate attention
      const formattedAlerts = alerts.map(alert => ({
        plotId: alert.plotId,
        industryName: alert.industryName,
        alertType: alert.status,
        severity: alert.severity,
        deviationPercent: alert.deviationPercent,
        encroachmentDetected: alert.encroachmentDetected,
        confidenceScore: alert.confidenceScore,
        priority: alert.severity === 'Critical' ? 'Urgent' : 
                  alert.severity === 'High' ? 'High' : 'Medium',
        timestamp: new Date().toISOString()
      }));

      res.status(200).json({
        success: true,
        alertCount: formattedAlerts.length,
        data: formattedAlerts
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch alerts',
        message: error.message
      });
    }
  }

  /**
   * GET /analysis/summary
   * Get high-level summary of analysis across all plots
   */
  static async getSummary(req, res) {
    try {
      const analysisResults = await AnalysisService.analyzeAllPlots();

      res.status(200).json({
        success: true,
        data: {
          summary: analysisResults.summary,
          timestamp: analysisResults.analysisTimestamp
        }
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch summary',
        message: error.message
      });
    }
  }
}

module.exports = AnalysisController;
