/**
 * Main Server Entry Point
 * Industrial Land Monitoring System Backend
 */

const express = require('express');
const cors = require('cors');
const config = require('./config/config');

// Import routes
const plotRoutes = require('./routes/plotRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const satelliteRoutes = require('./routes/satelliteRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors(config.cors)); // Enable CORS for frontend integration
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Land Monitoring Backend is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API Routes
app.use('/api/plots', plotRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/satellite', satelliteRoutes);
app.use('/api/search', searchRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Industrial Land Monitoring System API',
    version: '1.0.0',
    endpoints: {
      plots: '/api/plots',
      analysis: '/api/analysis',
      satellite: '/api/satellite',
      health: '/health'
    },
    documentation: 'See README.md for API documentation'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Industrial Land Monitoring System Backend');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('\n📌 Available Endpoints:');
  console.log(`   GET  /api/plots                    - Get all plots`);
  console.log(`   GET  /api/plots/:id                - Get specific plot`);
  console.log(`   GET  /api/plots/:id/current        - Get live plot data`);
  console.log(`   GET  /api/plots/statistics         - Get plot statistics`);
  console.log(`   GET  /api/analysis                 - Analyze all plots`);
  console.log(`   GET  /api/analysis/:id             - Analyze specific plot`);
  console.log(`   GET  /api/analysis/violations      - Get violations`);
  console.log(`   GET  /api/analysis/alerts          - Get critical alerts`);
  console.log(`   GET  /api/analysis/summary         - Get analysis summary`);
  console.log(`   GET  /api/satellite/imagery/:id    - Get satellite imagery`);
  console.log(`   GET  /api/satellite/spectral/*     - Get spectral indices`);
  console.log(`   POST /api/satellite/change-detection/* - Detect changes`);
  console.log('='.repeat(50));
  console.log('\n✅ Backend ready for frontend integration!\n');
});

module.exports = app;
