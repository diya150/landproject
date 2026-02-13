"""
Python-based Fuzzy Matching Microservice
Uses RapidFuzz for intelligent matching against plot data
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from rapidfuzz import fuzz
from rapidfuzz import process
import json
from pathlib import Path

app = FastAPI(title="Land Monitoring Fuzzy Matcher", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response models
class PlotData(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    boundaryCoords: Optional[List[dict]] = None
    industryId: str
    industryType: str
    category: str

class MatchResult(BaseModel):
    matchType: str  # "exact" or "fuzzy"
    confidence: float
    plot: PlotData

class MatchResponse(BaseModel):
    success: bool
    data: Optional[MatchResult] = None
    message: str


# Load reference plots data
def load_reference_plots():
    """Load reference plots from data file or return mock data"""
    try:
        data_path = Path(__file__).parent.parent / "src" / "data" / "referencePlots.js"
        # For now, return mock data structure
        # In production, parse the actual JS file or use a JSON endpoint
        return get_mock_plots()
    except Exception as e:
        print(f"Error loading plots: {e}")
        return get_mock_plots()


def get_mock_plots():
    """Mock data for testing - in production this comes from the database"""
    return [
        {
            "id": "PLT-001",
            "name": "Steel Manufacturing Corp",
            "industryId": "IND-2020-001",
            "industryType": "Steel & Iron",
            "category": "Heavy Industry",
            "latitude": 28.5355,
            "longitude": 77.3910,
            "boundaryCoords": [
                {"lat": 28.5355, "lng": 77.3910},
                {"lat": 28.5365, "lng": 77.3910},
                {"lat": 28.5365, "lng": 77.3925},
                {"lat": 28.5355, "lng": 77.3925}
            ]
        },
        {
            "id": "PLT-002",
            "name": "Pharma Solutions Ltd",
            "industryId": "IND-2019-045",
            "industryType": "Pharmaceuticals",
            "category": "Pharmaceuticals",
            "latitude": 28.5370,
            "longitude": 77.3930,
            "boundaryCoords": [
                {"lat": 28.5370, "lng": 77.3930},
                {"lat": 28.5382, "lng": 77.3930},
                {"lat": 28.5382, "lng": 77.3948},
                {"lat": 28.5370, "lng": 77.3948}
            ]
        },
        {
            "id": "PLT-003",
            "name": "Green Textiles Inc",
            "industryId": "IND-2021-012",
            "industryType": "Textiles",
            "category": "Textiles",
            "latitude": 28.5345,
            "longitude": 77.3950,
            "boundaryCoords": [
                {"lat": 28.5345, "lng": 77.3950},
                {"lat": 28.5355, "lng": 77.3950},
                {"lat": 28.5355, "lng": 77.3965},
                {"lat": 28.5345, "lng": 77.3965}
            ]
        },
        {
            "id": "PLT-004",
            "name": "Cement Works Limited",
            "industryId": "IND-2018-089",
            "industryType": "Cement",
            "category": "Heavy Industry",
            "latitude": 28.5320,
            "longitude": 77.3880,
            "boundaryCoords": [
                {"lat": 28.5320, "lng": 77.3880},
                {"lat": 28.5340, "lng": 77.3880},
                {"lat": 28.5340, "lng": 77.3900},
                {"lat": 28.5320, "lng": 77.3900}
            ]
        },
        {
            "id": "PLT-005",
            "name": "Auto Components Factory",
            "industryId": "IND-2022-056",
            "industryType": "Automobile",
            "category": "Manufacturing",
            "latitude": 28.5390,
            "longitude": 77.3970,
            "boundaryCoords": [
                {"lat": 28.5390, "lng": 77.3970},
                {"lat": 28.5410, "lng": 77.3970},
                {"lat": 28.5410, "lng": 77.3990},
                {"lat": 28.5390, "lng": 77.3990}
            ]
        }
    ]


def perform_exact_match(query: str, plots: List[dict]) -> Optional[dict]:
    """
    Perform case-insensitive exact matching against:
    - Plot ID
    - Industry Name
    - Industry ID
    """
    query_lower = query.lower()
    
    for plot in plots:
        # Exact match on Plot ID
        if plot["id"].lower() == query_lower:
            return plot
        
        # Exact match on Industry Name
        if plot["name"].lower() == query_lower:
            return plot
        
        # Exact match on Industry ID
        if plot["industryId"].lower() == query_lower:
            return plot
    
    return None


def perform_fuzzy_match(query: str, plots: List[dict], threshold: int = 85) -> Optional[dict]:
    """
    Perform fuzzy matching using RapidFuzz
    Returns best match if confidence > threshold
    """
    candidates = []
    
    for plot in plots:
        # Create searchable fields
        searchable_fields = [
            plot["id"],
            plot["name"],
            plot["industryId"],
            plot["industryType"]
        ]
        
        for field in searchable_fields:
            # Use token_sort_ratio for better matching with word order variations
            score = fuzz.token_sort_ratio(query.lower(), field.lower())
            candidates.append((plot, score))
    
    if not candidates:
        return None
    
    # Get best match
    best_match = max(candidates, key=lambda x: x[1])
    plot, score = best_match
    
    # Return only if above threshold
    if score >= threshold:
        return plot, score
    
    return None


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Land Monitoring Fuzzy Matcher",
        "version": "1.0.0"
    }


@app.get("/match", response_model=MatchResponse)
async def match_query(q: str, threshold: int = 85):
    """
    Main matching endpoint
    
    Flow:
    1. Try exact match
    2. If no exact match, try fuzzy match
    3. Return result with confidence score
    """
    if not q or len(q.strip()) < 2:
        raise HTTPException(
            status_code=400,
            detail="Query must be at least 2 characters"
        )
    
    plots = load_reference_plots()
    
    # Step 1: Try exact match
    exact_match = perform_exact_match(q, plots)
    if exact_match:
        return MatchResponse(
            success=True,
            data=MatchResult(
                matchType="exact",
                confidence=100.0,
                plot=PlotData(
                    id=exact_match["id"],
                    name=exact_match["name"],
                    latitude=exact_match["latitude"],
                    longitude=exact_match["longitude"],
                    boundaryCoords=exact_match.get("boundaryCoords"),
                    industryId=exact_match["industryId"],
                    industryType=exact_match["industryType"],
                    category=exact_match["category"]
                )
            ),
            message="Exact match found"
        )
    
    # Step 2: Try fuzzy match
    fuzzy_result = perform_fuzzy_match(q, plots, threshold)
    if fuzzy_result:
        plot, score = fuzzy_result
        return MatchResponse(
            success=True,
            data=MatchResult(
                matchType="fuzzy",
                confidence=float(score),
                plot=PlotData(
                    id=plot["id"],
                    name=plot["name"],
                    latitude=plot["latitude"],
                    longitude=plot["longitude"],
                    boundaryCoords=plot.get("boundaryCoords"),
                    industryId=plot["industryId"],
                    industryType=plot["industryType"],
                    category=plot["category"]
                )
            ),
            message=f"Fuzzy match found with {score}% confidence"
        )
    
    # No match found
    return MatchResponse(
        success=False,
        data=None,
        message=f"No match found for '{q}' with minimum confidence {threshold}"
    )


@app.get("/suggest")
async def suggest_matches(q: str, limit: int = 5):
    """
    Get multiple suggestions for a query
    Returns top N matches sorted by confidence
    """
    if not q or len(q.strip()) < 2:
        raise HTTPException(
            status_code=400,
            detail="Query must be at least 2 characters"
        )
    
    plots = load_reference_plots()
    candidates = []
    
    for plot in plots:
        searchable_fields = [
            (plot["id"], "id"),
            (plot["name"], "name"),
            (plot["industryId"], "industryId"),
        ]
        
        for field, field_type in searchable_fields:
            score = fuzz.token_sort_ratio(q.lower(), field.lower())
            if score >= 60:  # Lower threshold for suggestions
                candidates.append((plot, score, field_type))
    
    # Sort by score and limit
    candidates.sort(key=lambda x: x[1], reverse=True)
    candidates = candidates[:limit]
    
    suggestions = []
    for plot, score, field_type in candidates:
        suggestions.append({
            "id": plot["id"],
            "name": plot["name"],
            "confidence": float(score),
            "matchedField": field_type
        })
    
    return {
        "success": True,
        "suggestions": suggestions,
        "total": len(suggestions)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
