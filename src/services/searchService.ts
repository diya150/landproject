/**
 * Search API Service
 * Frontend client for search API
 */

import { SearchResponse, SearchSuggestion, MatchResult } from '../types/search';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class SearchService {
  /**
   * Search for a plot
   */
  static async search(query: string, threshold: number = 85): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&threshold=${threshold}&suggestions=true&limit=5`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Get search suggestions
   */
  static async getSuggestions(query: string, limit: number = 5): Promise<SearchSuggestion[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get suggestions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }

  /**
   * Get all available plots
   */
  static async getAllPlots() {
    try {
      const response = await fetch(`${API_BASE_URL}/search/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get plots: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get plots error:', error);
      return [];
    }
  }
}

export default SearchService;
