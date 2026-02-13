# Quick Start: Search Feature Setup

## 🚀 5-Minute Setup

### Step 1: Backend Express Server (Running)
✅ Already integrated! Just restart your backend:

```bash
cd backend
npm run dev
# Server should show search endpoint available
```

### Step 2: Start Python Fuzzy Matcher

#### Windows
```bash
# Open PowerShell in backend/python-matcher directory
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python matcher.py
```

#### macOS/Linux
```bash
cd backend/python-matcher
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python matcher.py
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

### Step 3: Frontend (Already Updated!)
✅ Components are integrated! Just run:

```bash
npm run dev
# Frontend at http://localhost:5173
```

## 📦 What Got Added

### Backend Files
- ✅ `backend/src/services/searchService.js` - Search logic
- ✅ `backend/src/controllers/searchController.js` - API handlers
- ✅ `backend/src/routes/searchRoutes.js` - Search endpoints
- ✅ `backend/src/index.js` - Updated with search routes

### Python Files
- ✅ `backend/python-matcher/matcher.py` - FastAPI service
- ✅ `backend/python-matcher/requirements.txt` - Dependencies

### Frontend Files
- ✅ `src/components/dashboard/SearchPanel.tsx` - Search UI
- ✅ `src/components/dashboard/SatelliteMap.tsx` - Updated map
- ✅ `src/services/searchService.ts` - API client
- ✅ `src/types/search.ts` - TypeScript types

## 🧪 Test It

### Test 1: Exact Match (PLT-001)
1. Open http://localhost:5173
2. Navigate to the map with search panel
3. Type: **PLT-001**
4. Press Enter or click Search
5. ✅ Should instantly center map to plot with 100% confidence badge

### Test 2: Fuzzy Match (Typo)
1. Type: **Steil Manufacturing**
2. Press Enter
3. ✅ Should show fuzzy match (~96% confidence)
4. Map animates to plot location

### Test 3: Suggestions
1. Type: **steel** (just start typing)
2. Wait 300ms
3. ✅ Dropdown shows suggestions
4. Click one to search

### Test 4: No Match
1. Type: **Unknown XYZ**
2. Press Enter
3. ✅ Shows error + suggestions

## 🔧 Troubleshooting

### Python Service Won't Start
```bash
# Issue: Module not found
# Solution:
pip install -r requirements.txt

# or if using python3:
pip3 install -r requirements.txt
```

### Port 8001 Already in Use
```bash
# Find process using port 8001 and kill it
# Windows:
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8001
kill -9 <PID>
```

### Backend Can't Connect to Python Service
```bash
# Check if Python service is running
curl http://localhost:8001/health

# If connection refused:
# 1. Verify Python matcher.py is running
# 2. Check PYTHON_MATCHER_URL in backend/.env
# 3. Restart backend server
```

### Suggestions Not Showing
```
Issue: Type query but no dropdown appears
Solution:
- Wait 300ms+ (debounce delay)
- Query must be >= 2 characters
- Check console for errors
```

## 📋 API Verification

### Check Backend Search Endpoint
```bash
curl "http://localhost:5000/api/search?q=PLT-001"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "matchType": "exact",
    "confidence": 100,
    "plot": {
      "id": "PLT-001",
      "name": "Steel Manufacturing Corp",
      "latitude": 28.5355,
      "longitude": 77.3910,
      ...
    }
  },
  "message": "Exact match found"
}
```

### Check Python Service
```bash
curl "http://localhost:8001/health"
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Land Monitoring Fuzzy Matcher",
  "version": "1.0.0"
}
```

## 📊 Feature Overview

| Feature | Status | Location |
|---------|--------|----------|
| Exact Matching | ✅ Done | Backend service |
| Fuzzy Matching | ✅ Done | Python matcher |
| Search UI | ✅ Done | SearchPanel component |
| Map Integration | ✅ Done | SatelliteMap component |
| Polygon Rendering | ✅ Done | Leaflet Polygon |
| Animations | ✅ Done | Leaflet flyTo |
| Suggestions | ✅ Done | Debounced dropdown |
| Error Handling | ✅ Done | All layers |
| Loading States | ✅ Done | UI feedback |

## 🎯 Usage Scenarios

### Scenario 1: User searches by Plot ID
```
1. Opens map page
2. Sees search panel on right
3. Types "PLT-001"
4. Hits Enter
5. Map flies to plot with red polygon
6. Shows match details (Exact, 100%)
```

### Scenario 2: User makes typo
```
1. Types "Steil Manufacturing"
2. System detects no exact match
3. Calls Python fuzzy matcher
4. Gets 96% confidence match
5. Map centers to plot
6. Shows "Fuzzy Match - 96%"
```

### Scenario 3: User browses suggestions
```
1. Types "pharm" (partial match)
2. After 300ms, suggestions dropdown appears
3. Shows 3 suggestions for pharma plots
4. User clicks "Pharma Solutions Ltd"
5. Searches automatically
```

## 🌐 Environment Setup

### Backend .env
```
PYTHON_MATCHER_URL=http://localhost:8001
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend .env
```
VITE_API_URL=http://localhost:5000/api
```

## 📚 Documentation

- Full guide: See `SEARCH_FEATURE_GUIDE.md`
- API docs: See `SEARCH_FEATURE_GUIDE.md#api-documentation`
- TypeScript types: `src/types/search.ts`

## ✨ Next Steps

1. **Test all scenarios** above
2. **Review SEARCH_FEATURE_GUIDE.md** for full documentation
3. **Customize** confidence thresholds if needed
4. **Add more plots** to `backend/src/data/referencePlots.js`
5. **Connect to real database** instead of hardcoded data

## 💡 Tips

- Python service runs independently - can be on separate machine
- Exact matches bypass Python service (faster)
- Confidence > 85% required for fuzzy matches (configurable)
- All API endpoints are REST - easy to integrate with other clients
- Map animations are smooth (2s duration)

---

**All done!** Your search feature is ready to go! 🎉

Any issues? Check troubleshooting section or review SEARCH_FEATURE_GUIDE.md
