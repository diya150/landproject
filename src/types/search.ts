/**
 * Search Types
 * TypeScript types for search functionality
 */

export interface BoundaryCoord {
  lat: number;
  lng: number;
}

export interface PlotData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  boundaryCoords?: BoundaryCoord[];
  industryId: string;
  industryType: string;
  category: string;
  approvedArea?: number;
}

export interface MatchResult {
  matchType: 'exact' | 'fuzzy';
  confidence: number;
  plot: PlotData;
}

export interface SearchResponse {
  success: boolean;
  data: MatchResult | null;
  message: string;
  suggestions?: SearchSuggestion[];
}

export interface SearchSuggestion {
  id: string;
  name: string;
  confidence: number;
  matchedField: 'id' | 'name' | 'industryId';
}

export interface SearchState {
  query: string;
  result: MatchResult | null;
  suggestions: SearchSuggestion[];
  loading: boolean;
  error: string | null;
  matchType: 'exact' | 'fuzzy' | null;
  showSuggestions: boolean;
}
