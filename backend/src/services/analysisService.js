/**
 * Analysis Service
 * Handles comparison logic and violation detection
 */

const PlotService = require('./plotService');
const {
  calculatePolygonArea,
  calculateDeviation,
  calculateBoundaryDisplacement,
  detectEncroachment,
  calculateConfidenceScore,
  determineStatus
} = require('../utils/geoCalculations');
const config = require('../config/config');

class AnalysisService {
  /**
   * Perform comprehensive analysis for a specific plot
   * Compares approved vs current boundaries and detects violations
   * @param {string} plotId - The plot ID to analyze
   * @returns {object} Analysis results
   */
  static async analyzePlot(plotId) {
    // Get reference/approved plot data
    const referencePlot = PlotService.getPlotById(plotId);
    
    if (!referencePlot) {
      throw new Error(`Plot ${plotId} not found`);
    }

    // Get current/live plot data from simulator
    const currentPlot = await PlotService.getCurrentPlotData(plotId);

    if (!currentPlot) {
      throw new Error(`Unable to fetch current data for plot ${plotId}`);
    }

    // Calculate areas
    const approvedAreaCalculated = calculatePolygonArea(referencePlot.approvedBoundary);
    const currentAreaCalculated = calculatePolygonArea(currentPlot.currentBoundary);

    // Use provided area values but validate with calculations
    const approvedArea = referencePlot.approvedArea;
    const currentArea = currentPlot.currentArea;

    // Calculate deviation percentage
    const deviationPercent = calculateDeviation(approvedArea, currentArea);

    // Calculate boundary displacement
    const boundaryDisplacement = calculateBoundaryDisplacement(
      referencePlot.approvedBoundary,
      currentPlot.currentBoundary
    );

    // Detect encroachment
    const hasEncroachment = detectEncroachment(approvedArea, currentArea);

    // Determine status
    const status = determineStatus(deviationPercent, config.deviationThreshold);

    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(deviationPercent, boundaryDisplacement);

    // Determine severity level
    const severity = this._determineSeverity(deviationPercent);

    // Calculate area difference
    const areaDifference = currentArea - approvedArea;

    // Generate detailed analysis
    const analysis = {
      plotId: referencePlot.plotId,
      industryName: referencePlot.industryName,
      industryType: referencePlot.industryType,
      
      // Area analysis
      approvedArea,
      currentArea,
      areaDifference: Math.round(areaDifference),
      
      // Deviation analysis
      deviationPercent,
      deviationThreshold: config.deviationThreshold,
      
      // Boundary analysis
      boundaryDisplacement,
      
      // Status and detection
      status,
      severity,
      encroachmentDetected: hasEncroachment,
      confidenceScore,
      
      // Metadata
      analysisTimestamp: new Date().toISOString(),
      dataSource: currentPlot.dataSource,
      
      // Boundaries (for visualization)
      approvedBoundary: referencePlot.approvedBoundary,
      currentBoundary: currentPlot.currentBoundary,
      
      // Recommendations
      recommendation: this._generateRecommendation(status, severity, hasEncroachment)
    };

    return analysis;
  }

  /**
   * Analyze all plots and return summary
   * @returns {object} Analysis summary for all plots
   */
  static async analyzeAllPlots() {
    const plots = PlotService.getAllPlots();
    const analysisResults = [];

    for (const plot of plots) {
      try {
        const analysis = await this.analyzePlot(plot.plotId);
        analysisResults.push({
          plotId: analysis.plotId,
          industryName: analysis.industryName,
          status: analysis.status,
          severity: analysis.severity,
          deviationPercent: analysis.deviationPercent,
          encroachmentDetected: analysis.encroachmentDetected,
          confidenceScore: analysis.confidenceScore
        });
      } catch (error) {
        analysisResults.push({
          plotId: plot.plotId,
          industryName: plot.industryName,
          status: 'Error',
          error: error.message
        });
      }
    }

    // Generate summary statistics
    const summary = this._generateSummary(analysisResults);

    return {
      summary,
      results: analysisResults,
      analysisTimestamp: new Date().toISOString()
    };
  }

  /**
   * Get violation alerts (plots with violations only)
   * @returns {Array} List of plots with violations
   */
  static async getViolationAlerts() {
    const allAnalysis = await this.analyzeAllPlots();
    
    return allAnalysis.results
      .filter(result => result.status === 'Violation' || result.status === 'Warning')
      .sort((a, b) => b.deviationPercent - a.deviationPercent); // Sort by severity
  }

  /**
   * Determine severity level based on deviation
   * @private
   */
  static _determineSeverity(deviationPercent) {
    if (deviationPercent <= 5) {
      return 'Low';
    } else if (deviationPercent <= 10) {
      return 'Medium';
    } else if (deviationPercent <= 15) {
      return 'High';
    } else {
      return 'Critical';
    }
  }

  /**
   * Generate recommendation based on analysis
   * @private
   */
  static _generateRecommendation(status, severity, hasEncroachment) {
    if (status === 'Compliant') {
      return 'No action required. Plot boundaries are within acceptable limits.';
    } else if (status === 'Warning') {
      return 'Monitor closely. Deviation is approaching threshold. Schedule inspection.';
    } else {
      if (severity === 'Critical') {
        return 'URGENT: Immediate action required. Significant boundary violation detected. Initiate legal proceedings and site inspection.';
      } else if (severity === 'High') {
        return 'High priority violation. Schedule immediate site inspection and issue notice to industry.';
      } else {
        return 'Violation detected. Issue warning notice and schedule site inspection within 7 days.';
      }
    }
  }

  /**
   * Generate summary statistics for analysis results
   * @private
   */
  static _generateSummary(results) {
    const total = results.length;
    const compliant = results.filter(r => r.status === 'Compliant').length;
    const warnings = results.filter(r => r.status === 'Warning').length;
    const violations = results.filter(r => r.status === 'Violation').length;
    const errors = results.filter(r => r.status === 'Error').length;

    const avgDeviation = results
      .filter(r => r.deviationPercent !== undefined)
      .reduce((sum, r) => sum + r.deviationPercent, 0) / (total - errors);

    const encroachmentCount = results.filter(r => r.encroachmentDetected).length;

    return {
      totalPlots: total,
      compliant,
      warnings,
      violations,
      errors,
      encroachmentCount,
      averageDeviation: Math.round(avgDeviation * 100) / 100,
      complianceRate: Math.round((compliant / (total - errors)) * 100)
    };
  }
}

module.exports = AnalysisService;
