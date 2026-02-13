# Industrial Land Monitoring System - Backend API

## Overview

This is a professional backend API for the Industrial Land Monitoring System. It provides comprehensive land boundary monitoring, violation detection, and analysis capabilities for industrial plots.

## Features

✅ **Reference Data Storage** - Stores approved/old land records with boundaries  
✅ **Live Data Simulation** - Simulates real-time plot boundary data  
✅ **Comparison Logic** - Compares approved vs current boundaries  
✅ **Violation Detection** - Detects encroachment and boundary violations  
✅ **Deviation Analysis** - Calculates area and boundary deviation percentages  
✅ **REST API** - Clean, documented API endpoints  
✅ **Production Ready** - Proper error handling and logging  

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript (ES6+)
- **Architecture:** MVC Pattern with Service Layer

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.js              # Configuration settings
│   ├── data/
│   │   ├── referencePlots.js      # Approved plot data (10 plots)
│   │   └── livePlotsSimulator.js  # Simulates live API data
│   ├── utils/
│   │   └── geoCalculations.js     # Geographical calculations
│   ├── services/
│   │   ├── plotService.js         # Plot business logic
│   │   └── analysisService.js     # Analysis & comparison logic
│   ├── controllers/
│   │   ├── plotController.js      # Plot request handlers
│   │   └── analysisController.js  # Analysis request handlers
│   ├── routes/
│   │   ├── plotRoutes.js          # Plot API routes
│   │   └── analysisRoutes.js      # Analysis API routes
│   └── index.js                   # Main server entry point
├── package.json
├── .env
└── README.md
```

---

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development
DEVIATION_THRESHOLD=5
```

### 3. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

---

## API Endpoints

### 🏢 Plot Endpoints

#### 1. Get All Plots
```http
GET /api/plots
```

**Query Parameters:**
- `industryType` (optional) - Filter by industry type
- `category` (optional) - Filter by category

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "plotId": "PLT-001",
      "industryName": "Steel Manufacturing Corp",
      "industryType": "Steel & Iron",
      "approvedBoundary": [...],
      "approvedArea": 15000,
      "registrationDate": "2020-03-15",
      "licenseNumber": "IND-2020-001",
      "category": "Heavy Industry",
      "status": "Active"
    }
  ]
}
```

#### 2. Get Plot by ID
```http
GET /api/plots/:id
```

**Example:** `/api/plots/PLT-001`

#### 3. Get Plot Statistics
```http
GET /api/plots/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPlots": 10,
    "totalArea": 193000,
    "averageArea": 19300,
    "categoryCounts": {
      "Heavy Industry": 2,
      "Pharmaceuticals": 1,
      ...
    }
  }
}
```

#### 4. Get Current/Live Plot Data
```http
GET /api/plots/:id/current
```

Returns simulated current boundary data from "satellite source"

---

### 📊 Analysis Endpoints

#### 1. Analyze Specific Plot
```http
GET /api/analysis/:id
```

**Example:** `/api/analysis/PLT-001`

**Response:**
```json
{
  "success": true,
  "data": {
    "plotId": "PLT-001",
    "industryName": "Steel Manufacturing Corp",
    "approvedArea": 15000,
    "currentArea": 15375,
    "areaDifference": 375,
    "deviationPercent": 2.5,
    "deviationThreshold": 5,
    "boundaryDisplacement": 12.5,
    "status": "Compliant",
    "severity": "Low",
    "encroachmentDetected": false,
    "confidenceScore": 90,
    "analysisTimestamp": "2026-02-12T10:30:00.000Z",
    "recommendation": "No action required. Plot boundaries are within acceptable limits.",
    "approvedBoundary": [...],
    "currentBoundary": [...]
  }
}
```

#### 2. Analyze All Plots
```http
GET /api/analysis
```

Returns summary + analysis for all plots

#### 3. Get Violations Only
```http
GET /api/analysis/violations
```

Returns only plots with violations or warnings (sorted by severity)

#### 4. Get Critical Alerts
```http
GET /api/analysis/alerts
```

Returns formatted alerts for immediate attention

**Response:**
```json
{
  "success": true,
  "alertCount": 4,
  "data": [
    {
      "plotId": "PLT-009",
      "industryName": "Plastic Manufacturing Hub",
      "alertType": "Violation",
      "severity": "Critical",
      "deviationPercent": 15.8,
      "encroachmentDetected": true,
      "priority": "Urgent"
    }
  ]
}
```

#### 5. Get Analysis Summary
```http
GET /api/analysis/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPlots": 10,
      "compliant": 5,
      "warnings": 1,
      "violations": 4,
      "encroachmentCount": 4,
      "averageDeviation": 5.73,
      "complianceRate": 50
    }
  }
}
```

---

## Comparison Logic

### How It Works

1. **Fetch Reference Data:** Get approved boundary coordinates and area
2. **Fetch Live Data:** Simulate current boundary data from "API"
3. **Calculate Areas:** Use Shoelace formula to compute polygon areas
4. **Calculate Deviation:**
   ```
   deviation % = |currentArea - approvedArea| / approvedArea × 100
   ```
5. **Determine Status:**
   - ✅ **Compliant:** deviation ≤ 5%
   - ⚠️ **Warning:** 5% < deviation ≤ 7%
   - ❌ **Violation:** deviation > 7%

6. **Detect Encroachment:** Check if currentArea > approvedArea
7. **Calculate Confidence Score:** Based on data quality and displacement

### Severity Levels

| Deviation | Severity | Action Required |
|-----------|----------|-----------------|
| 0-5% | Low | None |
| 5-10% | Medium | Monitor |
| 10-15% | High | Immediate inspection |
| >15% | Critical | Urgent legal action |

---

## Dummy Data

### Reference Plots (10 Industries)

The system includes 10 pre-configured industrial plots:

1. **PLT-001** - Steel Manufacturing Corp (15,000 m²) - Compliant
2. **PLT-002** - Pharma Solutions Ltd (22,000 m²) - Violation (8.5%)
3. **PLT-003** - Green Textiles Inc (12,000 m²) - Compliant
4. **PLT-004** - AutoParts Manufacturing (28,000 m²) - Violation (12.3%)
5. **PLT-005** - Chemical Industries (18,500 m²) - Warning (4.8%)
6. **PLT-006** - Electronics Assembly (10,000 m²) - Compliant
7. **PLT-007** - Food Processing Units (16,500 m²) - Violation (6.7%)
8. **PLT-008** - Paper Mill Industries (14,000 m²) - Compliant
9. **PLT-009** - Plastic Manufacturing Hub (25,000 m²) - Critical (15.8%)
10. **PLT-010** - Cement Factory Ltd (32,000 m²) - Compliant

---

## Frontend Integration

### CORS Configuration

CORS is enabled by default to allow frontend integration.

### Example Frontend Fetch

```javascript
// Fetch all plots
const response = await fetch('http://localhost:5000/api/plots');
const data = await response.json();

// Analyze a specific plot
const analysis = await fetch('http://localhost:5000/api/analysis/PLT-001');
const result = await analysis.json();

// Get violations
const violations = await fetch('http://localhost:5000/api/analysis/violations');
const alerts = await violations.json();
```

### Integration Steps

1. Update frontend API base URL to `http://localhost:5000`
2. Replace mock data calls with actual API calls
3. Use the exact data structure from API responses
4. Display:
   - Plot status badges
   - Deviation percentages
   - Violation alerts
   - Boundary maps (using approvedBoundary and currentBoundary)

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "error": "Error title",
  "message": "Detailed error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `404` - Resource not found
- `500` - Internal server error

---

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/health

# Get all plots
curl http://localhost:5000/api/plots

# Analyze specific plot
curl http://localhost:5000/api/analysis/PLT-001

# Get violations
curl http://localhost:5000/api/analysis/violations
```

### Using Browser

Simply navigate to:
- http://localhost:5000/api/plots
- http://localhost:5000/api/analysis/PLT-001
- http://localhost:5000/api/analysis/violations

---

## Key Features Implemented

✅ **Reference Plot Storage** - 10 industrial plots with approved boundaries  
✅ **Live Data Simulation** - Realistic deviations for testing  
✅ **Area Calculation** - Shoelace formula for polygon areas  
✅ **Deviation Detection** - Percentage-based comparison  
✅ **Violation Alerts** - Automated threshold checking  
✅ **Encroachment Detection** - Area expansion detection  
✅ **Confidence Scoring** - Data quality assessment  
✅ **Clean REST API** - RESTful endpoints with proper HTTP methods  
✅ **Error Handling** - Comprehensive error responses  
✅ **CORS Enabled** - Ready for frontend integration  
✅ **Production Structure** - MVC architecture + services  
✅ **Comprehensive Logging** - Request logging and error tracking  

---

## Future Enhancements

- Add authentication (JWT tokens)
- Implement actual database (PostgreSQL/MongoDB)
- Add WebSocket for real-time alerts
- Integrate actual satellite imagery API
- Add PDF report generation
- Implement plot registration API
- Add historical analysis tracking
- Email notifications for violations

---

## Support

For issues or questions, please refer to the code comments or create an issue in the repository.

---

## License

MIT License - Feel free to use and modify for your projects.

---

**Backend Development Complete! ✅**

The backend is fully functional and ready for integration with your existing frontend.
