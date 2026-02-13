/**
 * Backend API Integration Example
 * 
 * This file demonstrates how to integrate the backend API with your frontend.
 * Copy these functions to your frontend service/API layer.
 */

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';



/**
 * Fetch all plots
 * @returns {Promise<Array>} List of all plots
 */
export async function getAllPlots() {
  try {
    const response = await fetch(`${API_BASE_URL}/plots`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch plots');
    }
  } catch (error) {
    console.error('Error fetching plots:', error);
    throw error;
  }
}

/**
 * Fetch a specific plot by ID
 * @param {string} plotId - The plot ID (e.g., "PLT-001")
 * @returns {Promise<Object>} Plot details
 */
export async function getPlotById(plotId) {
  try {
    const response = await fetch(`${API_BASE_URL}/plots/${plotId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch plot');
    }
  } catch (error) {
    console.error(`Error fetching plot ${plotId}:`, error);
    throw error;
  }
}

/**
 * Fetch plot statistics
 * @returns {Promise<Object>} Statistics summary
 */
export async function getPlotStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/plots/statistics`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch statistics');
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

// ========================================
// ANALYSIS API FUNCTIONS
// ========================================

/**
 * Analyze a specific plot
 * @param {string} plotId - The plot ID to analyze
 * @returns {Promise<Object>} Analysis results with deviation, status, etc.
 */
export async function analyzePlot(plotId) {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/${plotId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to analyze plot');
    }
  } catch (error) {
    console.error(`Error analyzing plot ${plotId}:`, error);
    throw error;
  }
}

/**
 * Analyze all plots
 * @returns {Promise<Object>} Analysis results for all plots with summary
 */
export async function analyzeAllPlots() {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to analyze plots');
    }
  } catch (error) {
    console.error('Error analyzing all plots:', error);
    throw error;
  }
}

/**
 * Fetch plots with violations only
 * @returns {Promise<Array>} List of plots with violations/warnings
 */
export async function getViolations() {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/violations`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch violations');
    }
  } catch (error) {
    console.error('Error fetching violations:', error);
    throw error;
  }
}

/**
 * Fetch critical alerts
 * @returns {Promise<Array>} List of alerts requiring attention
 */
export async function getAlerts() {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/alerts`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch alerts');
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
}

/**
 * Fetch analysis summary statistics
 * @returns {Promise<Object>} Summary with compliance rates, violation counts, etc.
 */
export async function getAnalysisSummary() {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/summary`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch summary');
    }
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
}

// ========================================
// USAGE EXAMPLES IN REACT COMPONENTS
// ========================================

/*

// Example 1: Display all plots in a component
import React, { useEffect, useState } from 'react';
import { getAllPlots } from './api/backendApi';

function PlotsPage() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllPlots();
        setPlots(data);
      } catch (error) {
        console.error('Failed to load plots:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {plots.map(plot => (
        <div key={plot.plotId}>
          <h3>{plot.industryName}</h3>
          <p>Area: {plot.approvedArea} m²</p>
        </div>
      ))}
    </div>
  );
}

// Example 2: Display plot analysis with status badge
import React, { useEffect, useState } from 'react';
import { analyzePlot } from './api/backendApi';

function PlotAnalysis({ plotId }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    async function fetchAnalysis() {
      const data = await analyzePlot(plotId);
      setAnalysis(data);
    }
    fetchAnalysis();
  }, [plotId]);

  if (!analysis) return <div>Loading analysis...</div>;

  return (
    <div>
      <h2>{analysis.industryName}</h2>
      <div className={`status-badge ${analysis.status.toLowerCase()}`}>
        {analysis.status}
      </div>
      <p>Deviation: {analysis.deviationPercent}%</p>
      <p>Confidence: {analysis.confidenceScore}%</p>
      {analysis.encroachmentDetected && (
        <div className="alert">⚠️ Encroachment Detected!</div>
      )}
      <p>{analysis.recommendation}</p>
    </div>
  );
}

// Example 3: Display violations dashboard
import React, { useEffect, useState } from 'react';
import { getViolations, getAnalysisSummary } from './api/backendApi';

function ViolationsDashboard() {
  const [violations, setViolations] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [violationsData, summaryData] = await Promise.all([
        getViolations(),
        getAnalysisSummary()
      ]);
      setViolations(violationsData);
      setSummary(summaryData.summary);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Violations Dashboard</h1>
      {summary && (
        <div className="summary-cards">
          <div>Total Plots: {summary.totalPlots}</div>
          <div>Violations: {summary.violations}</div>
          <div>Compliance Rate: {summary.complianceRate}%</div>
        </div>
      )}
      <div className="violations-list">
        {violations.map(violation => (
          <div key={violation.plotId} className="violation-card">
            <h3>{violation.industryName}</h3>
            <span className={`severity ${violation.severity.toLowerCase()}`}>
              {violation.severity}
            </span>
            <p>Deviation: {violation.deviationPercent}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

*/

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get status badge color based on status
 * @param {string} status - 'Compliant', 'Warning', or 'Violation'
 * @returns {string} CSS class name
 */
export function getStatusColor(status) {
  switch (status) {
    case 'Compliant':
      return 'bg-green-500';
    case 'Warning':
      return 'bg-yellow-500';
    case 'Violation':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Get severity badge color
 * @param {string} severity - 'Low', 'Medium', 'High', or 'Critical'
 * @returns {string} CSS class name
 */
export function getSeverityColor(severity) {
  switch (severity) {
    case 'Low':
      return 'bg-blue-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'High':
      return 'bg-orange-500';
    case 'Critical':
      return 'bg-red-600';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Format area with units
 * @param {number} area - Area in square meters
 * @returns {string} Formatted area string
 */
export function formatArea(area) {
  if (area >= 10000) {
    return `${(area / 10000).toFixed(2)} hectares`;
  }
  return `${area.toLocaleString()} m²`;
}
