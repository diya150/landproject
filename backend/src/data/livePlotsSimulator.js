/**
 * Live Plot Simulator - Simulates current/live boundary data
 * This simulates an external API that provides current plot boundaries
 * Some plots have deviations to demonstrate violation detection
 */

const referencePlots = require('./referencePlots');

/**
 * Simulates fetching live/current plot data from an external API
 * Adds realistic deviations to demonstrate the monitoring system
 */
class LivePlotSimulator {
  /**
   * Get current boundaries for a specific plot
   * @param {string} plotId - The plot ID to fetch data for
   * @returns {object} Current plot data with potential deviations
   */
  static getLivePlotData(plotId) {
    const referencePlot = referencePlots.find(p => p.plotId === plotId);
    
    if (!referencePlot) {
      return null;
    }

    // Simulate different scenarios for different plots
    const scenarios = {
      'PLT-001': { deviation: 2.5, encroachment: false }, // Compliant
      'PLT-002': { deviation: 8.5, encroachment: true },  // Violation - expanded boundary
      'PLT-003': { deviation: 1.2, encroachment: false }, // Compliant
      'PLT-004': { deviation: 12.3, encroachment: true }, // Severe violation
      'PLT-005': { deviation: 4.8, encroachment: false }, // Warning - near threshold
      'PLT-006': { deviation: 0.5, encroachment: false }, // Compliant
      'PLT-007': { deviation: 6.7, encroachment: true },  // Violation
      'PLT-008': { deviation: 3.2, encroachment: false }, // Compliant
      'PLT-009': { deviation: 15.8, encroachment: true }, // Critical violation
      'PLT-010': { deviation: 1.8, encroachment: false }  // Compliant
    };

    const scenario = scenarios[plotId] || { deviation: 0, encroachment: false };
    
    // Calculate modified boundary based on deviation
    const currentBoundary = this._generateDeviatedBoundary(
      referencePlot.approvedBoundary,
      scenario.deviation,
      scenario.encroachment
    );

    // Calculate current area based on deviation
    const currentArea = this._calculateDeviatedArea(
      referencePlot.approvedArea,
      scenario.deviation,
      scenario.encroachment
    );

    return {
      plotId: referencePlot.plotId,
      industryName: referencePlot.industryName,
      currentBoundary,
      currentArea,
      timestamp: new Date().toISOString(),
      dataSource: 'Satellite Imagery / GPS Survey'
    };
  }

  /**
   * Get live data for all plots
   * @returns {array} Array of current plot data
   */
  static getAllLivePlotData() {
    return referencePlots.map(plot => this.getLivePlotData(plot.plotId));
  }

  /**
   * Generate a deviated boundary based on reference boundary
   * @private
   */
  static _generateDeviatedBoundary(approvedBoundary, deviationPercent, hasEncroachment) {
    if (deviationPercent === 0 || !hasEncroachment) {
      // Small random variations even for compliant plots (GPS noise)
      return approvedBoundary.map(coord => ({
        lat: coord.lat + (Math.random() - 0.5) * 0.00001,
        lng: coord.lng + (Math.random() - 0.5) * 0.00001
      }));
    }

    // For violations, expand boundaries outward
    const scaleFactor = 1 + (deviationPercent / 100);
    const center = this._calculateCenter(approvedBoundary);

    return approvedBoundary.map(coord => {
      const vectorLat = (coord.lat - center.lat) * scaleFactor;
      const vectorLng = (coord.lng - center.lng) * scaleFactor;
      
      return {
        lat: center.lat + vectorLat,
        lng: center.lng + vectorLng
      };
    });
  }

  /**
   * Calculate center point of a polygon
   * @private
   */
  static _calculateCenter(boundary) {
    const sumLat = boundary.reduce((sum, coord) => sum + coord.lat, 0);
    const sumLng = boundary.reduce((sum, coord) => sum + coord.lng, 0);
    
    return {
      lat: sumLat / boundary.length,
      lng: sumLng / boundary.length
    };
  }

  /**
   * Calculate deviated area
   * @private
   */
  static _calculateDeviatedArea(approvedArea, deviationPercent, hasEncroachment) {
    if (!hasEncroachment) {
      // Minor variations for compliant plots
      const randomVariation = (Math.random() - 0.5) * 50; // +/- 25 sqm
      return Math.round(approvedArea + randomVariation);
    }

    // For encroachment, area increases
    const deviation = (deviationPercent / 100) * approvedArea;
    return Math.round(approvedArea + deviation);
  }

  /**
   * Simulate API delay
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  static async simulateApiDelay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = LivePlotSimulator;
