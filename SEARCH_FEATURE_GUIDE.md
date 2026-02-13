# Plot Search & Matching Feature Documentation

## Overview

This feature implements **intelligent plot search and matching** with two-tier matching strategy:
1. **Exact Matching** - Instant case-insensitive matching
2. **Fuzzy Matching** - Python-based smart matching using RapidFuzz

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React/TypeScript)              │
│  ┌──────────────────────────┬──────────────────────────────┐   │
│  │    SatelliteMap.tsx      │    SearchPanel.tsx           │   │
│  │  (Left: Leaflet Map)     │  (Right: Search Interface)   │   │
│  │  - Map with polygon      │  - Search input              │   │
│  │  - Animated transitions  │  - Suggestions dropdown      │   │
│  │  - Marker rendering      │  - Match results display     │   │
│  └──────────────────────────┴──────────────────────────────┘   │
│           ↓ onPlotFound(MatchResult)                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    /api/search?q=query
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express/Node.js)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SearchController + SearchService                        │  │
│  │  1. Try exact match (instant)                            │  │
│  │  2. Call Python service if no match                      │  │
│  │  3. Return result with confidence score                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓ If no exact match                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                   /match?query=search_term
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│           PYTHON MICROSERVICE (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Fuzzy Matcher Service (Port 8001)                       │  │
│  │  - Load reference plots                                  │  │
│  │  - Use RapidFuzz for intelligent matching                │  │
│  │  - Return best match + confidence score                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
backend/
├── python-matcher/
│   ├── requirements.txt      # Python dependencies
│   └── matcher.py            # FastAPI fuzzy matching service
├── src/
│   ├── controllers/
│   │   └── searchController.js
│   ├── routes/
│   │   └── searchRoutes.js
│   └── services/
│       └── searchService.js
└── src/index.js              # Updated with search routes

src/
├── components/
│   └── dashboard/
│       ├── SatelliteMap.tsx   # Updated: Left map + Right search panel
│       └── SearchPanel.tsx    # New: Search UI component
├── services/
│   └── searchService.ts       # Frontend API client
└── types/
    └── search.ts              # TypeScript types
```

## Setup Instructions

### 1. Backend Setup

#### Add Search Routes to Express App

Update `backend/src/index.js`:
```javascript
const searchRoutes = require('./routes/searchRoutes');
app.use('/api/search', searchRoutes);
```

#### Environment Variables

Create `.env` in backend root:
```
PYTHON_MATCHER_URL=http://localhost:8001
NODE_ENV=development
PORT=5000
```

### 2. Python Microservice Setup

#### Install Python (if not already installed)

Download from [python.org](https://www.python.org/downloads/)

#### Create Virtual Environment

```bash
cd backend/python-matcher

# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Run Python Service

```bash
python matcher.py
```

The service will be available at: `http://localhost:8001`

### 3. Frontend Setup

No additional setup needed! The SearchPanel component is already integrated into SatelliteMap.

## API Documentation

### Backend Endpoints

#### 1. Search Endpoint

```
GET /api/search?q=query&threshold=85&suggestions=true&limit=5
```

**Parameters:**
- `q` (required): Search query (Plot ID, Industry Name, or Industry ID)
- `threshold` (optional): Fuzzy matching confidence threshold (0-100, default: 85)
- `suggestions` (optional): Return suggestions if no match (default: false)
- `limit` (optional): Number of suggestions to return (default: 5)

**Response:**
```json
{
  "success": true,
  "data": {
    "matchType": "exact|fuzzy",
    "confidence": 100,
    "plot": {
      "id": "PLT-001",
      "name": "Steel Manufacturing Corp",
      "latitude": 28.5355,
      "longitude": 77.3910,
      "boundaryCoords": [
        { "lat": 28.5355, "lng": 77.3910 },
        { "lat": 28.5365, "lng": 77.3910 },
        ...
      ],
      "industryId": "IND-2020-001",
      "industryType": "Steel & Iron",
      "category": "Heavy Industry"
    }
  },
  "message": "Exact match found",
  "suggestions": []
}
```

#### 2. Suggestions Endpoint

```
GET /api/search/suggestions?q=query&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "PLT-001",
      "name": "Steel Manufacturing Corp",
      "confidence": 95,
      "matchedField": "name"
    },
    ...
  ],
  "total": 3
}
```

#### 3. Get All Plots Endpoint

```
GET /api/search/all
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "PLT-001",
      "name": "Steel Manufacturing Corp",
      "latitude": 28.5355,
      "longitude": 77.3910,
      ...
    },
    ...
  ],
  "total": 5
}
```

### Python Service Endpoints

#### 1. Match Endpoint

```
GET /match?q=query&threshold=85
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matchType": "fuzzy",
    "confidence": 92.5,
    "plot": { ... }
  },
  "message": "Fuzzy match found with 92.5% confidence"
}
```

#### 2. Suggestions Endpoint

```
GET /suggest?q=query&limit=5
```

**Response:**
```json
{
  "success": true,
  "suggestions": [
    {
      "id": "PLT-001",
      "name": "Steel Manufacturing Corp",
      "confidence": 95,
      "matchedField": "name"
    },
    ...
  ],
  "total": 3
}
```

## Usage Examples

### Frontend: Search for a Plot

```typescript
import { SearchService } from '@/services/searchService';

// Search with threshold
const result = await SearchService.search('Steel Manufacturing', 85);

if (result.success) {
  console.log(`Found: ${result.data.plot.name}`);
  console.log(`Match Type: ${result.data.matchType}`);
  console.log(`Confidence: ${result.data.confidence}%`);
}
```

### Frontend: Get Suggestions

```typescript
const suggestions = await SearchService.getSuggestions('steel', 5);
console.log(`Found ${suggestions.length} suggestions`);
```

## Frontend Features

### SearchPanel Component

Located in `src/components/dashboard/SearchPanel.tsx`

**Features:**
- ✅ Real-time search input
- ✅ Debounced suggestions (300ms)
- ✅ Match type indicator (Exact/Fuzzy)
- ✅ Confidence score display
- ✅ Loading state
- ✅ Error handling
- ✅ No results state
- ✅ Click on suggestion to search

**States Handled:**
1. **Empty State**: Initial state with placeholder text
2. **Loading State**: Search in progress
3. **Success State**: Match found with full details
4. **Error State**: No match found with suggestions
5. **Suggestions State**: Dropdown list while typing

### SatelliteMap Component Updates

**New Features:**
- ✅ Split view: Map (left) + Search Panel (right)
- ✅ Smooth `flyTo()` animations to matched plot coordinates
- ✅ Polygon rendering for plot boundaries
- ✅ Dynamic marker with plot information
- ✅ Automatic zoom adjustment (16 for exact, 15 for fuzzy)
- ✅ Interactive popup with match details

**Props:**
```typescript
interface SatelliteMapProps {
  coordinates?: { latitude: number; longitude: number };
  plotId?: string;
  title?: string;
  height?: string;
}
```

## Matching Strategy

### Exact Match (Instant)
- **Speed**: O(n) - Fast
- **Matching Against**: 
  - Plot ID (case-insensitive)
  - Industry Name (case-insensitive)
  - License Number / Industry ID (case-insensitive)
- **Confidence**: 100%
- **Executed**: Synchronously in backend

### Fuzzy Match (If Exact Match Fails)
- **Speed**: Slightly slower
- **Algorithm**: Token Sort Ratio from RapidFuzz
- **Matching Against**:
  - Plot ID
  - Industry Name
  - Industry ID
  - Industry Type
- **Confidence**: Variable (0-100)
- **Threshold**: 85% (configurable)
- **Executed**: By Python microservice

### Token Sort Ratio (Why it's used?)
- ✅ Handles word order variations
- ✅ Tolerant of typos and misspellings
- ✅ Fast for small datasets
- ✅ Familiar in industry (Spotify, Uber use similar)

**Examples:**
```
"Steel Manufacturing" vs "Manufacturing Steel" → 100% match
"Stile Manufacturing" vs "Steel Manufacturing" → 96% match
"PHM Solutions" vs "Pharma Solutions Ltd" → 88% match
```

## Testing the Feature

### Test Case 1: Exact Match
```
Query: PLT-001
Expected: Instant match, Confidence: 100%
```

### Test Case 2: Industry Name Exact
```
Query: Steel Manufacturing Corp
Expected: Instant match, Confidence: 100%
```

### Test Case 3: Typo/Fuzzy
```
Query: Steil Manufacturing
Expected: Fuzzy match with ~96% confidence
```

### Test Case 4: Partial Name
```
Query: Steel
Expected: Suggestions dropdown with Steel-related plots
```

### Test Case 5: No Match
```
Query: Unknown Industry XYZ
Expected: Error + Suggestions dropdown
```

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Exact Match | <1ms | Synchronous, fastest path |
| Fuzzy Match | 10-50ms | Depends on dataset size |
| Suggestions | 15-100ms | Returns top N matches |
| Map Animation | 2s | Leaflet flyTo() duration |

## Error Handling

### Frontend Error States

1. **Network Error**: Shows "Failed to search. Please try again."
2. **No Match**: Shows error message + suggestions
3. **Short Query**: Allows only queries >= 2 characters
4. **Timeout**: 5-second timeout on API calls

### Backend Error Responses

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Python Service Error Handling

- Invalid query: Returns 400 Bad Request
- Service down: Backend catches and returns 500
- No match within threshold: Returns success=false with suggestions

## Customization

### Change Confidence Threshold

```typescript
// Frontend
await SearchService.search(query, 75); // Lower threshold = more fuzzy matches

// Backend
await SearchService.search(query, { threshold: 75 });

// API
fetch('/api/search?q=query&threshold=75');
```

### Change Map Zoom Levels

In `SatelliteMap.tsx`:
```typescript
const newZoom = result.matchType === 'exact' ? 18 : 14; // Adjust zoom levels
```

### Change Animation Duration

In `MapUpdater` component:
```typescript
map.flyTo([...], zoom, { duration: 1 }); // 1 second animation
```

### Add More Searchable Fields

1. Update `referencePlots.js` data structure
2. Modify `searchService.js` exactMatch()
3. Update Python `matcher.py` to include new fields

## Troubleshooting

### Issue: Python service not starting

**Solution:**
- Ensure Python 3.8+ is installed
- Check virtual environment is activated
- Verify port 8001 is not in use

### Issue: "Cannot POST /api/search"

**Solution:**
- Ensure searchRoutes are imported in backend/src/index.js
- Restart backend server
- Check routes are mounted at `/api/search`

### Issue: Suggestions not showing

**Solution:**
- Wait 300ms+ after typing (debounce)
- Ensure query is >= 2 characters
- Python service must be running

### Issue: Map not centering on match

**Solution:**
- Check coordinates in search result
- Verify Leaflet library is loaded
- Ensure MapUpdater receives correct center data

## Performance Optimization Tips

1. **Use Exact Match Path**: Most queries should hit exact match (faster)
2. **Cache Results**: Consider caching frequent searches
3. **Debounce Suggestions**: Already implemented (300ms)
4. **Lazy Load Python**: Start Python service only when needed
5. **Connection Pool**: Reuse HTTP connections to Python service

## Security Considerations

1. **Input Validation**: Query validated in both backend and Python
2. **Timeout**: 5-second timeout prevents hanging requests
3. **CORS**: Enabled in Python service (configure as needed)
4. **SQL Injection**: Not applicable (no database queries in queries)
5. **Error Messages**: Production should limit error details

## Future Enhancements

- [ ] Cache search results with Redis
- [ ] Support for advanced search filters
- [ ] Search history / Recent searches
- [ ] Batch search API
- [ ] Export search results to CSV
- [ ] Search analytics tracking
- [ ] Machine learning model for ranking
- [ ] Integration with external data sources

## Dependencies

### Frontend
- React 18+
- Leaflet
- TypeScript
- Lucide React (icons)

### Backend
- Express.js
- Axios
- cors
- dotenv

### Python
- FastAPI
- Uvicorn
- RapidFuzz
- Pydantic

## License

This feature is part of the Industrial Land Monitoring System project.

## Support

For issues or questions:
1. Check troubleshooting section
2. Review API responses for detailed errors
3. Check browser console for frontend errors
4. Check backend logs for server errors
