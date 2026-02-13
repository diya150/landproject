/**
 * Configuration settings for the Land Monitoring Backend
 */

require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Analysis thresholds
  deviationThreshold: parseFloat(process.env.DEVIATION_THRESHOLD) || 5,
  
  // Status constants
  status: {
    COMPLIANT: 'Compliant',
    VIOLATION: 'Violation',
    WARNING: 'Warning'
  },
  
  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
};
