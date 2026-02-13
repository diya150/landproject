/**
 * Search Controller
 * Handles search API requests
 */

const SearchService = require('../services/searchService');

class SearchController {
  /**
   * GET /api/search?q=query
   * Search for plots by name, ID, or industry name
   */
  static async search(req, res) {
    try {
      const { q, threshold = 85, suggestions = false, limit = 5 } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Missing query parameter',
          message: 'Query parameter "q" is required'
        });
      }
      
      const result = await SearchService.search(q, {
        threshold: parseInt(threshold),
        returnSuggestions: suggestions === 'true',
        suggestionLimit: parseInt(limit)
      });
      
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error.message
      });
    }
  }

  /**
   * GET /api/search/suggestions?q=query
   * Get search suggestions
   */
  static async suggestions(req, res) {
    try {
      const { q, limit = 5 } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Missing query parameter',
          message: 'Query parameter "q" is required'
        });
      }
      
      const suggestions = await SearchService.getSuggestions(q, parseInt(limit));
      
      return res.status(200).json({
        success: true,
        data: suggestions,
        total: suggestions.length
      });
    } catch (error) {
      console.error('Suggestions error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get suggestions',
        message: error.message
      });
    }
  }

  /**
   * GET /api/search/all
   * Get all available plots
   */
  static async getAllPlots(req, res) {
    try {
      const plots = SearchService.getAllPlots();
      
      return res.status(200).json({
        success: true,
        data: plots,
        total: plots.length
      });
    } catch (error) {
      console.error('Get all plots error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get plots',
        message: error.message
      });
    }
  }
}

module.exports = SearchController;
