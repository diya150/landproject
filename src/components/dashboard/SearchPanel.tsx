import { useEffect, useState, useRef } from 'react';
import { SearchService } from '../../services/searchService';
import { SearchState, MatchResult, SearchSuggestion } from '../../types/search';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader, Search, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface SearchPanelProps {
  onPlotFound: (result: MatchResult) => void;
  defaultQuery?: string;
}

export function SearchPanel({ onPlotFound, defaultQuery = '' }: SearchPanelProps) {
  const [state, setState] = useState<SearchState>({
    query: defaultQuery,
    result: null,
    suggestions: [],
    loading: false,
    error: null,
    matchType: null,
    showSuggestions: false,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Perform search
   */
  const handleSearch = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setState((prev) => ({
        ...prev,
        result: null,
        error: null,
        suggestions: [],
        showSuggestions: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await SearchService.search(query, 85);

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          result: response.data!,
          matchType: response.data!.matchType,
          error: null,
          showSuggestions: false,
          loading: false,
        }));
        onPlotFound(response.data);
      } else {
        setState((prev) => ({
          ...prev,
          result: null,
          matchType: null,
          error: response.message,
          suggestions: response.suggestions || [],
          showSuggestions: response.suggestions ? response.suggestions.length > 0 : false,
          loading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        result: null,
        matchType: null,
        error: 'Failed to search. Please try again.',
        loading: false,
      }));
      console.error('Search error:', error);
    }
  };

  /**
   * Handle input change with debounce for suggestions
   */
  const handleInputChange = (value: string) => {
    setState((prev) => ({ ...prev, query: value }));

    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    if (value.length >= 2) {
      suggestionsTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await SearchService.getSuggestions(value, 5);
          setState((prev) => ({
            ...prev,
            suggestions,
            showSuggestions: suggestions.length > 0,
          }));
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      }, 300);
    } else {
      setState((prev) => ({ ...prev, suggestions: [], showSuggestions: false }));
    }
  };

  /**
   * Handle suggestion selection
   */
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setState((prev) => ({ ...prev, query: suggestion.name }));
    handleSearch(suggestion.name);
  };

  return (
    <div className="flex flex-col gap-4 h-full max-h-[calc(100vh-120px)]">
      {/* Search Input */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Search Plot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Input Group */}
          <div className="flex gap-2">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Enter Plot ID, Industry Name, or Industry ID..."
              value={state.query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(state.query);
                }
              }}
              className="flex-1"
              disabled={state.loading}
            />
            <Button
              onClick={() => handleSearch(state.query)}
              disabled={state.loading || state.query.length < 2}
              className="px-4"
            >
              {state.loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {state.showSuggestions && state.suggestions.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
              <p className="text-xs text-slate-500 px-2 py-1">Suggestions:</p>
              {state.suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.id}-${suggestion.matchedField}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-2 py-2 rounded hover:bg-slate-100 transition-colors text-sm"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium truncate">{suggestion.name}</span>
                    <span className="text-xs ml-2 px-2 py-1 border border-slate-300 bg-white text-slate-700 rounded">
                      {Math.round(suggestion.confidence)}%
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{suggestion.id}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error State */}
      {state.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">No Match Found</p>
              <p className="text-sm text-red-700 mt-1">{state.error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {state.loading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4 flex gap-3">
            <Loader className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Searching...</p>
              <p className="text-sm text-blue-700 mt-1">
                Checking exact and fuzzy matches
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result State */}
      {state.result && (
        <Card className="border-green-200 bg-green-50 flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg font-semibold text-green-900">
                Match Found
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {/* Match Type Badge */}
            <div className="flex gap-2">
              {state.matchType === 'exact' ? (
                <Badge className="bg-green-600">Exact Match</Badge>
              ) : (
                <Badge className="bg-blue-600 flex gap-1">
                  <Zap className="w-3 h-3" />
                  Fuzzy Match
                </Badge>
              )}
              <span className="ml-auto px-2 py-1 text-xs border border-slate-300 bg-white text-slate-700 rounded">
                {Math.round(state.result.confidence)}% confidence
              </span>
            </div>

            {/* Plot Details */}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-600">Plot ID</p>
                <p className="font-semibold text-slate-900">{state.result.plot.id}</p>
              </div>

              <div>
                <p className="text-slate-600">Industry Name</p>
                <p className="font-semibold text-slate-900">{state.result.plot.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-600">Industry Type</p>
                  <p className="font-medium text-slate-900">
                    {state.result.plot.industryType}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Category</p>
                  <p className="font-medium text-slate-900">{state.result.plot.category}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-600">Industry ID</p>
                <p className="font-semibold text-slate-900 break-all">
                  {state.result.plot.industryId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-600">Latitude</p>
                  <p className="font-mono text-slate-900">
                    {state.result.plot.latitude.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Longitude</p>
                  <p className="font-mono text-slate-900">
                    {state.result.plot.longitude.toFixed(6)}
                  </p>
                </div>
              </div>

              {state.result.plot.boundaryCoords && (
                <div>
                  <p className="text-slate-600">Polygon Boundary</p>
                  <p className="text-xs text-slate-500">
                    {state.result.plot.boundaryCoords.length} coordinates
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-green-200">
              <Button
                onClick={() => {
                  setState((prev) => ({ ...prev, query: '', result: null }));
                }}
                variant="outline"
                className="flex-1"
              >
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!state.result && !state.error && !state.loading && (
        <Card className="border-slate-200 bg-slate-50 flex-1 flex items-center justify-center">
          <CardContent className="text-center py-8">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-sm">
              Enter a Plot ID, Industry Name, or Industry ID to search
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Supports both exact and fuzzy matching
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SearchPanel;
