/**
 * Search Service
 * Handles plot search with exact and fuzzy matching
 */

const axios = require('axios');
const referencePlots = require('../data/referencePlots');

const PYTHON_MATCHER_URL = process.env.PYTHON_MATCHER_URL || 'http://localhost:8001';

/**
 * Perform exact case-insensitive match against reference plots
 */
function exactMatch(query) {
  const queryLower = query.toLowerCase();
  
  for (const plot of referencePlots) {
    // Match against Plot ID
    if (plot.plotId.toLowerCase() === queryLower) {
      return {
        matchType: 'exact',
        confidence: 100,
        plot: {
          id: plot.plotId,
          name: plot.industryName,
          latitude: plot.approvedBoundary[0]?.lat,
          longitude: plot.approvedBoundary[0]?.lng,
          boundaryCoords: plot.approvedBoundary,
          industryId: plot.licenseNumber,
          industryType: plot.industryType,
          category: plot.category
        }
      };
    }
    
    // Match against Industry Name
    if (plot.industryName.toLowerCase() === queryLower) {
      return {
        matchType: 'exact',
        confidence: 100,
        plot: {
          id: plot.plotId,
          name: plot.industryName,
          latitude: plot.approvedBoundary[0]?.lat,
          longitude: plot.approvedBoundary[0]?.lng,
          boundaryCoords: plot.approvedBoundary,
          industryId: plot.licenseNumber,
          industryType: plot.industryType,
          category: plot.category
        }
      };
    }
    
    // Match against License Number / Industry ID
    if (plot.licenseNumber.toLowerCase() === queryLower) {
      return {
        matchType: 'exact',
        confidence: 100,
        plot: {
          id: plot.plotId,
          name: plot.industryName,
          latitude: plot.approvedBoundary[0]?.lat,
          longitude: plot.approvedBoundary[0]?.lng,
          boundaryCoords: plot.approvedBoundary,
          industryId: plot.licenseNumber,
          industryType: plot.industryType,
          category: plot.category
        }
      };
    }
  }
  
  return null;
}

/**
 * Call Python fuzzy matcher service
 */
async function fuzzyMatch(query, threshold = 85) {
  try {
    const response = await axios.get(`${PYTHON_MATCHER_URL}/match`, {
      params: {
        q: query,
        threshold: threshold
      },
      timeout: 5000
    });
    
    return response.data.data || null;
  } catch (error) {
    console.error('Error calling Python matcher:', error.message);
    return null;
  }
}

/**
 * Get search suggestions
 */
async function getSuggestions(query, limit = 5) {
  try {
    const response = await axios.get(`${PYTHON_MATCHER_URL}/suggest`, {
      params: {
        q: query,
        limit: limit
      },
      timeout: 5000
    });
    
    return response.data.suggestions || [];
  } catch (error) {
    console.error('Error getting suggestions:', error.message);
    return [];
  }
}

/**
 * Main search function
 * 1. Try exact match
 * 2. If not found, try fuzzy match from Python service
 * 3. Return result with confidence score
 */
async function search(query, options = {}) {
  const {
    threshold = 85,
    returnSuggestions = false,
    suggestionLimit = 5
  } = options;
  
  if (!query || query.trim().length < 2) {
    throw new Error('Query must be at least 2 characters');
  }
  
  // Step 1: Try exact match
  const exactResult = exactMatch(query);
  if (exactResult) {
    return {
      success: true,
      data: exactResult,
      message: 'Exact match found'
    };
  }
  
  // Step 2: Try fuzzy match
  const fuzzyResult = await fuzzyMatch(query, threshold);
  if (fuzzyResult) {
    return {
      success: true,
      data: fuzzyResult,
      message: `Fuzzy match found with ${fuzzyResult.confidence}% confidence`
    };
  }
  
  // Step 3: Return suggestions if requested
  if (returnSuggestions) {
    const suggestions = await getSuggestions(query, suggestionLimit);
    return {
      success: false,
      data: null,
      message: `No match found for '${query}'`,
      suggestions: suggestions
    };
  }
  
  return {
    success: false,
    data: null,
    message: `No match found for '${query}' with minimum confidence ${threshold}`
  };
}

/**
 * Get all available plots for browsing
 */
function getAllPlots() {
  return referencePlots.map(plot => ({
    id: plot.plotId,
    name: plot.industryName,
    latitude: plot.approvedBoundary[0]?.lat,
    longitude: plot.approvedBoundary[0]?.lng,
    boundaryCoords: plot.approvedBoundary,
    industryId: plot.licenseNumber,
    industryType: plot.industryType,
    category: plot.category,
    approvedArea: plot.approvedArea
  }));
}

module.exports = {
  search,
  exactMatch,
  fuzzyMatch,
  getSuggestions,
  getAllPlots
};
