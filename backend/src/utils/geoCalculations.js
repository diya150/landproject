/**
 * Geographical Calculation Utilities
 * Functions for calculating areas, distances, and boundary comparisons
 */

/**
 * Calculate the area of a polygon using the Shoelace formula
 * @param {Array} coordinates - Array of {lat, lng} objects
 * @returns {number} Area in square meters (approximate)
 */
function calculatePolygonArea(coordinates) {
  if (!coordinates || coordinates.length < 3) {
    throw new Error('At least 3 coordinates are required to calculate area');
  }

  // Convert lat/lng to approximate meters using Haversine
  // Note: This is an approximation; for production, use a proper GIS library
  const metersPerDegreeLat = 111320; // meters per degree of latitude
  
  // Calculate average longitude for local meter conversion
  const avgLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
  const metersPerDegreeLng = 111320 * Math.cos(avgLat * Math.PI / 180);

  // Convert coordinates to meters (relative to first point)
  const origin = coordinates[0];
  const metersCoords = coordinates.map(coord => ({
    x: (coord.lng - origin.lng) * metersPerDegreeLng,
    y: (coord.lat - origin.lat) * metersPerDegreeLat
  }));

  // Shoelace formula
  let area = 0;
  const n = metersCoords.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += metersCoords[i].x * metersCoords[j].y;
    area -= metersCoords[j].x * metersCoords[i].y;
  }

  return Math.abs(area / 2);
}

/**
 * Calculate deviation percentage between two areas
 * @param {number} approvedArea - Original approved area
 * @param {number} currentArea - Current measured area
 * @returns {number} Deviation percentage
 */
function calculateDeviation(approvedArea, currentArea) {
  if (approvedArea === 0) {
    throw new Error('Approved area cannot be zero');
  }

  const difference = Math.abs(currentArea - approvedArea);
  const deviation = (difference / approvedArea) * 100;

  return Math.round(deviation * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate the distance between two coordinates using Haversine formula
 * @param {object} coord1 - {lat, lng}
 * @param {object} coord2 - {lat, lng}
 * @returns {number} Distance in meters
 */
function calculateDistance(coord1, coord2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = coord1.lat * Math.PI / 180;
  const φ2 = coord2.lat * Math.PI / 180;
  const Δφ = (coord2.lat - coord1.lat) * Math.PI / 180;
  const Δλ = (coord2.lng - coord1.lng) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Calculate average boundary displacement
 * Compares corresponding points in approved vs current boundaries
 * @param {Array} approvedBoundary - Array of approved coordinates
 * @param {Array} currentBoundary - Array of current coordinates
 * @returns {number} Average displacement in meters
 */
function calculateBoundaryDisplacement(approvedBoundary, currentBoundary) {
  if (approvedBoundary.length !== currentBoundary.length) {
    throw new Error('Boundary coordinate counts must match');
  }

  let totalDisplacement = 0;

  for (let i = 0; i < approvedBoundary.length; i++) {
    const distance = calculateDistance(approvedBoundary[i], currentBoundary[i]);
    totalDisplacement += distance;
  }

  return Math.round(totalDisplacement / approvedBoundary.length * 100) / 100;
}

/**
 * Determine if there's encroachment based on area comparison
 * @param {number} approvedArea - Approved area
 * @param {number} currentArea - Current area
 * @returns {boolean} True if current area exceeds approved area
 */
function detectEncroachment(approvedArea, currentArea) {
  return currentArea > approvedArea;
}

/**
 * Calculate confidence score for the analysis
 * Based on data quality, boundary clarity, etc.
 * @param {number} deviation - Deviation percentage
 * @param {number} boundaryDisplacement - Average boundary displacement in meters
 * @returns {number} Confidence score (0-100)
 */
function calculateConfidenceScore(deviation, boundaryDisplacement) {
  // Base confidence is 95%
  let confidence = 95;

  // Reduce confidence for high deviation (uncertain measurements)
  if (deviation > 20) {
    confidence -= 15;
  } else if (deviation > 10) {
    confidence -= 10;
  } else if (deviation > 5) {
    confidence -= 5;
  }

  // Reduce confidence for high boundary displacement
  if (boundaryDisplacement > 50) {
    confidence -= 10;
  } else if (boundaryDisplacement > 20) {
    confidence -= 5;
  }

  // Ensure confidence is between 0 and 100
  return Math.max(0, Math.min(100, confidence));
}

/**
 * Determine status based on deviation threshold
 * @param {number} deviation - Deviation percentage
 * @param {number} threshold - Violation threshold (default 5%)
 * @returns {string} Status: 'Compliant', 'Warning', or 'Violation'
 */
function determineStatus(deviation, threshold = 5) {
  if (deviation <= threshold) {
    return 'Compliant';
  } else if (deviation <= threshold + 2) {
    return 'Warning';
  } else {
    return 'Violation';
  }
}

/**
 * Calculate center point of a polygon
 * @param {Array} coordinates - Array of {lat, lng} objects
 * @returns {object} Center coordinate {lat, lng}
 */
function calculateCenter(coordinates) {
  const sumLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
  const sumLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0);
  
  return {
    lat: sumLat / coordinates.length,
    lng: sumLng / coordinates.length
  };
}

module.exports = {
  calculatePolygonArea,
  calculateDeviation,
  calculateDistance,
  calculateBoundaryDisplacement,
  detectEncroachment,
  calculateConfidenceScore,
  determineStatus,
  calculateCenter
};
