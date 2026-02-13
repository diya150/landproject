/**
 * Plot Service
 * Handles business logic for plot data retrieval and management
 */

const referencePlots = require('../data/referencePlots');
const LivePlotSimulator = require('../data/livePlotsSimulator');

class PlotService {
  /**
   * Get all reference plots (approved land records)
   * @returns {Array} All reference plots
   */
  static getAllPlots() {
    return referencePlots.map(plot => ({
      ...plot,
      status: 'Active',
      dataType: 'Reference'
    }));
  }

  /**
   * Get a specific plot by ID
   * @param {string} plotId - The plot ID to retrieve
   * @returns {object|null} Plot data or null if not found
   */
  static getPlotById(plotId) {
    const plot = referencePlots.find(p => p.plotId === plotId);
    
    if (!plot) {
      return null;
    }

    return {
      ...plot,
      status: 'Active',
      dataType: 'Reference'
    };
  }

  /**
   * Get plots by industry type
   * @param {string} industryType - The industry type to filter by
   * @returns {Array} Filtered plots
   */
  static getPlotsByIndustryType(industryType) {
    return referencePlots
      .filter(plot => plot.industryType.toLowerCase().includes(industryType.toLowerCase()))
      .map(plot => ({
        ...plot,
        status: 'Active',
        dataType: 'Reference'
      }));
  }

  /**
   * Get plots by category
   * @param {string} category - The category to filter by
   * @returns {Array} Filtered plots
   */
  static getPlotsByCategory(category) {
    return referencePlots
      .filter(plot => plot.category.toLowerCase() === category.toLowerCase())
      .map(plot => ({
        ...plot,
        status: 'Active',
        dataType: 'Reference'
      }));
  }

  /**
   * Get summary statistics for all plots
   * @returns {object} Summary statistics
   */
  static getPlotStatistics() {
    const totalPlots = referencePlots.length;
    const totalArea = referencePlots.reduce((sum, plot) => sum + plot.approvedArea, 0);
    const avgArea = totalArea / totalPlots;

    // Group by category
    const categoryCounts = referencePlots.reduce((acc, plot) => {
      acc[plot.category] = (acc[plot.category] || 0) + 1;
      return acc;
    }, {});

    // Group by industry type
    const industryTypeCounts = referencePlots.reduce((acc, plot) => {
      acc[plot.industryType] = (acc[plot.industryType] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPlots,
      totalArea: Math.round(totalArea),
      averageArea: Math.round(avgArea),
      categoryCounts,
      industryTypeCounts
    };
  }

  /**
   * Get current/live plot data from simulator
   * @param {string} plotId - The plot ID
   * @returns {object|null} Current plot data
   */
  static async getCurrentPlotData(plotId) {
    // Simulate API delay
    await LivePlotSimulator.simulateApiDelay(50);
    return LivePlotSimulator.getLivePlotData(plotId);
  }

  /**
   * Get all current/live plot data
   * @returns {Array} All current plot data
   */
  static async getAllCurrentPlotData() {
    // Simulate API delay
    await LivePlotSimulator.simulateApiDelay(100);
    return LivePlotSimulator.getAllLivePlotData();
  }

  /**
   * Check if plot exists
   * @param {string} plotId - The plot ID to check
   * @returns {boolean} True if plot exists
   */
  static plotExists(plotId) {
    return referencePlots.some(plot => plot.plotId === plotId);
  }
}

module.exports = PlotService;
