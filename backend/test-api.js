/**
 * API Testing Script
 * Run this script to test all backend endpoints
 * Usage: node test-api.js
 */

const API_BASE_URL = 'http://localhost:5000';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Make HTTP GET request
 */
async function get(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();
    return { success: true, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Print test result
 */
function printResult(testName, result) {
  if (result.success && result.status === 200) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    return true;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    console.log(`  Error: ${result.error || result.status}`);
    return false;
  }
}

/**
 * Print section header
 */
function printHeader(text) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`\n${colors.blue}🧪 Testing Industrial Land Monitoring Backend API${colors.reset}\n`);
  console.log(`${colors.yellow}API Base URL: ${API_BASE_URL}${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  // Health Check
  printHeader('Health Check');
  const healthResult = await get('/health');
  if (printResult('GET /health', healthResult)) {
    passed++;
    console.log(`   Status: ${healthResult.data.status}`);
    console.log(`   Message: ${healthResult.data.message}`);
  } else {
    failed++;
  }

  // Plot Endpoints
  printHeader('Plot Endpoints');
  
  const plotsResult = await get('/api/plots');
  if (printResult('GET /api/plots', plotsResult)) {
    passed++;
    console.log(`   Found ${plotsResult.data.count} plots`);
  } else {
    failed++;
  }

  const plotByIdResult = await get('/api/plots/PLT-001');
  if (printResult('GET /api/plots/PLT-001', plotByIdResult)) {
    passed++;
    console.log(`   Industry: ${plotByIdResult.data.data.industryName}`);
    console.log(`   Area: ${plotByIdResult.data.data.approvedArea} m²`);
  } else {
    failed++;
  }

  const statsResult = await get('/api/plots/statistics');
  if (printResult('GET /api/plots/statistics', statsResult)) {
    passed++;
    console.log(`   Total Plots: ${statsResult.data.data.totalPlots}`);
    console.log(`   Total Area: ${statsResult.data.data.totalArea} m²`);
  } else {
    failed++;
  }

  const currentResult = await get('/api/plots/PLT-001/current');
  if (printResult('GET /api/plots/PLT-001/current', currentResult)) {
    passed++;
    console.log(`   Current Area: ${currentResult.data.data.currentArea} m²`);
  } else {
    failed++;
  }

  // Analysis Endpoints
  printHeader('Analysis Endpoints');

  const analysisResult = await get('/api/analysis/PLT-001');
  if (printResult('GET /api/analysis/PLT-001', analysisResult)) {
    passed++;
    const analysis = analysisResult.data.data;
    console.log(`   Status: ${analysis.status}`);
    console.log(`   Deviation: ${analysis.deviationPercent}%`);
    console.log(`   Severity: ${analysis.severity}`);
    console.log(`   Encroachment: ${analysis.encroachmentDetected ? 'Yes' : 'No'}`);
  } else {
    failed++;
  }

  const allAnalysisResult = await get('/api/analysis');
  if (printResult('GET /api/analysis', allAnalysisResult)) {
    passed++;
    const summary = allAnalysisResult.data.data.summary;
    console.log(`   Total Plots: ${summary.totalPlots}`);
    console.log(`   Compliant: ${summary.compliant}`);
    console.log(`   Violations: ${summary.violations}`);
  } else {
    failed++;
  }

  const violationsResult = await get('/api/analysis/violations');
  if (printResult('GET /api/analysis/violations', violationsResult)) {
    passed++;
    console.log(`   Found ${violationsResult.data.count} violations/warnings`);
    if (violationsResult.data.count > 0) {
      const topViolation = violationsResult.data.data[0];
      console.log(`   Top Violation: ${topViolation.industryName} (${topViolation.deviationPercent}%)`);
    }
  } else {
    failed++;
  }

  const alertsResult = await get('/api/analysis/alerts');
  if (printResult('GET /api/analysis/alerts', alertsResult)) {
    passed++;
    console.log(`   Alert Count: ${alertsResult.data.alertCount}`);
  } else {
    failed++;
  }

  const summaryResult = await get('/api/analysis/summary');
  if (printResult('GET /api/analysis/summary', summaryResult)) {
    passed++;
    const summary = summaryResult.data.data.summary;
    console.log(`   Compliance Rate: ${summary.complianceRate}%`);
    console.log(`   Average Deviation: ${summary.averageDeviation}%`);
  } else {
    failed++;
  }

  // Test invalid endpoint (404)
  printHeader('Error Handling');
  const notFoundResult = await get('/api/invalid-endpoint');
  if (printResult('GET /api/invalid-endpoint (should return 404)', 
      { success: true, status: notFoundResult.status, data: notFoundResult.data })) {
    if (notFoundResult.status === 404) {
      passed++;
      console.log(`   ${colors.green}Correctly returned 404${colors.reset}`);
    }
  } else {
    failed++;
  }

  // Summary
  printHeader('Test Summary');
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log(`\n${colors.green}🎉 All tests passed! Backend is working perfectly.${colors.reset}\n`);
  } else {
    console.log(`\n${colors.red}⚠️  Some tests failed. Please check the backend.${colors.reset}\n`);
  }

  return failed === 0;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error(`${colors.red}Test runner failed:${colors.reset}`, error);
      process.exit(1);
    });
}

module.exports = { runTests };
