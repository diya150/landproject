# Quick Start Guide - Backend

## 🚀 Start the Backend Server

### Option 1: Development Mode (Recommended)
```bash
cd backend
npm run dev
```

### Option 2: Production Mode
```bash
cd backend
npm start
```

The server will start on **http://localhost:5000**

---

## ✅ Test the API

### 1. Health Check
Open your browser and visit:
```
http://localhost:5000/health
```

### 2. Get All Plots
```
http://localhost:5000/api/plots
```

### 3. Analyze a Plot
```
http://localhost:5000/api/analysis/PLT-001
```

### 4. Get Violations
```
http://localhost:5000/api/analysis/violations
```

---

## 🔗 Integration with Frontend

### Update Frontend API Configuration

In your frontend code, update the API base URL:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

// Example: Fetch plots
const fetchPlots = async () => {
  const response = await fetch(`${API_BASE_URL}/plots`);
  const data = await response.json();
  return data;
};

// Example: Analyze plot
const analyzePlot = async (plotId) => {
  const response = await fetch(`${API_BASE_URL}/analysis/${plotId}`);
  const data = await response.json();
  return data;
};

// Example: Get violations
const getViolations = async () => {
  const response = await fetch(`${API_BASE_URL}/analysis/violations`);
  const data = await response.json();
  return data;
};
```

---

## 📊 Sample Response Data

### Plot Data Structure
```json
{
  "plotId": "PLT-001",
  "industryName": "Steel Manufacturing Corp",
  "industryType": "Steel & Iron",
  "approvedBoundary": [
    { "lat": 28.5355, "lng": 77.3910 },
    { "lat": 28.5365, "lng": 77.3910 },
    { "lat": 28.5365, "lng": 77.3925 },
    { "lat": 28.5355, "lng": 77.3925 }
  ],
  "approvedArea": 15000
}
```

### Analysis Data Structure
```json
{
  "plotId": "PLT-001",
  "status": "Compliant",
  "deviationPercent": 2.5,
  "encroachmentDetected": false,
  "confidenceScore": 90,
  "severity": "Low",
  "recommendation": "No action required..."
}
```

---

## 🎯 Main Endpoints for Frontend

| Endpoint | Purpose | Frontend Usage |
|----------|---------|----------------|
| `GET /api/plots` | Get all plots | Display on dashboard/map |
| `GET /api/plots/:id` | Get plot details | Plot detail page |
| `GET /api/analysis/:id` | Analyze plot | Show deviation & status |
| `GET /api/analysis/violations` | Get violations | Alerts/notifications |
| `GET /api/analysis/summary` | Get summary stats | Dashboard metrics |

---

## 🛠️ Troubleshooting

### Port Already in Use
If port 5000 is occupied, edit `.env`:
```env
PORT=5001
```

### CORS Issues
CORS is enabled by default. If you face issues, check:
1. Backend is running on the correct port
2. Frontend is making requests to the correct URL

---

**Ready to integrate! Start the backend server and connect your frontend.** 🎉
