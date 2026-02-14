/**
 * Universal Data Decoder and Map Generator
 * Supports: Base64, Hex, URL encoding, and various land data formats
 */

import { create } from 'zustand';

// Decoder utilities
export const DataDecoder = {
  // Decode Base64
  decodeBase64: (encoded: string): string => {
    try {
      return atob(encoded);
    } catch {
      return '';
    }
  },

  // Decode Hex
  decodeHex: (encoded: string): string => {
    try {
      let hex = encoded.toString();
      let str = '';
      for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    } catch {
      return '';
    }
  },

  // Decode URL encoding
  decodeURL: (encoded: string): string => {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return '';
    }
  },

  // Auto-detect and decode
  autoDecode: (encoded: string): any => {
    // Try Base64
    let decoded = DataDecoder.decodeBase64(encoded);
    if (decoded && decoded.length > 0) {
      try {
        return { data: JSON.parse(decoded), format: 'base64', success: true };
      } catch {
        return { data: decoded, format: 'base64', success: true };
      }
    }

    // Try Hex
    decoded = DataDecoder.decodeHex(encoded);
    if (decoded && decoded.length > 0) {
      try {
        return { data: JSON.parse(decoded), format: 'hex', success: true };
      } catch {
        return { data: decoded, format: 'hex', success: true };
      }
    }

    // Try URL
    decoded = DataDecoder.decodeURL(encoded);
    if (decoded && decoded.length > 0 && decoded !== encoded) {
      try {
        return { data: JSON.parse(decoded), format: 'url', success: true };
      } catch {
        return { data: decoded, format: 'url', success: true };
      }
    }

    return { data: null, format: 'unknown', success: false };
  }
};

// Land plot parser
export const LandDataParser = {
  // Parse land plot coordinates
  parsePlotCoordinates: (data: any): any => {
    if (!data) return [];

    const plots: any[] = [];

    // Handle array of objects
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        if (item.coordinates) {
          plots.push({
            id: item.id || index + 1,
            name: item.name || `Plot ${index + 1}`,
            coordinates: item.coordinates,
            area: item.area || 0,
            location: item.location || '',
            owner: item.owner || 'Unknown',
            status: item.status || 'active',
            ...item
          });
        }
      });
    }
    // Handle single object
    else if (data.coordinates) {
      plots.push({
        id: data.id || 1,
        name: data.name || 'Plot 1',
        coordinates: data.coordinates,
        area: data.area || 0,
        ...data
      });
    }
    // Handle nested structure
    else if (data.plots) {
      return LandDataParser.parsePlotCoordinates(data.plots);
    }

    return plots;
  },

  // Extract regions from data
  extractRegions: (data: any): { [key: string]: any[] } => {
    const regions: { [key: string]: any[] } = {};

    if (Array.isArray(data)) {
      data.forEach(item => {
        const region = item.region || item.location || 'Unknown';
        if (!regions[region]) {
          regions[region] = [];
        }
        regions[region].push(item);
      });
    } else if (data.plots) {
      return LandDataParser.extractRegions(data.plots);
    } else if (data.regions) {
      Object.entries(data.regions).forEach(([region, plots]) => {
        regions[region] = Array.isArray(plots) ? plots : [plots];
      });
    }

    return regions;
  }
};

// Map generation utilities
export const MapGenerator = {
  // Generate map bounds from coordinates
  generateBounds: (plots: any[]): [[number, number], [number, number]] => {
    if (plots.length === 0) return [[0, 0], [0, 0]];

    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    plots.forEach(plot => {
      if (plot.coordinates && Array.isArray(plot.coordinates)) {
        plot.coordinates.forEach((coord: any) => {
          if (Array.isArray(coord)) {
            const [lat, lng] = coord;
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
          }
        });
      }
    });

    if (!isFinite(minLat)) return [[0, 0], [0, 0]];

    return [[minLat, minLng], [maxLat, maxLng]];
  },

  // Generate center point for map
  generateCenter: (plots: any[]): { lat: number; lng: number } => {
    if (plots.length === 0) return { lat: 0, lng: 0 };

    let sumLat = 0, sumLng = 0, count = 0;

    plots.forEach(plot => {
      if (plot.coordinates && Array.isArray(plot.coordinates)) {
        plot.coordinates.forEach((coord: any) => {
          if (Array.isArray(coord)) {
            const [lat, lng] = coord;
            sumLat += lat;
            sumLng += lng;
            count++;
          }
        });
      }
    });

    return {
      lat: count > 0 ? sumLat / count : 0,
      lng: count > 0 ? sumLng / count : 0
    };
  },

  // Generate polygon data for mapping
  generatePolygons: (plots: any[]) => {
    return plots.map((plot, index) => ({
      id: plot.id || index,
      name: plot.name || `Plot ${index + 1}`,
      coordinates: plot.coordinates || [],
      color: plot.status === 'active' ? '#3b82f6' : '#9ca3af',
      fillColor: plot.status === 'active' ? '#dbeafe' : '#f3f4f6',
      label: String(plot.id || index + 1),
      meta: {
        area: `${plot.area || 0} sqm`,
        owner: plot.owner || 'Unknown',
        status: plot.status || 'active'
      }
    }));
  }
};

// Zustand store for decoded data
interface DecodedMapState {
  encodedData: string;
  decodedData: any;
  regions: { [key: string]: any[] };
  selectedRegion: string | null;
  plots: any[];
  bounds: [[number, number], [number, number]];
  center: { lat: number; lng: number };
  setEncodedData: (encoded: string) => void;
  decodeData: (encoded: string) => { success: boolean; format?: string; plotCount?: number };
  selectRegion: (region: string) => void;
  getRegionPlots: () => any[];
}

export const useDecodedMapStore = create<DecodedMapState>((set, get) => ({
  encodedData: '',
  decodedData: null,
  regions: {},
  selectedRegion: null,
  plots: [],
  bounds: [[0, 0], [0, 0]],
  center: { lat: 0, lng: 0 },

  setEncodedData: (encoded: string) => set({ encodedData: encoded }),

  decodeData: (encoded: string) => {
    const result = DataDecoder.autoDecode(encoded);
    if (result.success) {
      const plots = LandDataParser.parsePlotCoordinates(result.data);
      const regions = LandDataParser.extractRegions(result.data);
      const bounds = MapGenerator.generateBounds(plots);
      const center = MapGenerator.generateCenter(plots);

      set({
        decodedData: result.data,
        plots,
        regions,
        bounds,
        center,
        encodedData: encoded
      });

      return { success: true, format: result.format, plotCount: plots.length };
    }
    return { success: false };
  },

  selectRegion: (region: string) => set({ selectedRegion: region }),

  getRegionPlots: () => {
    const state = get();
    if (!state.selectedRegion) return state.plots;
    return state.regions[state.selectedRegion] || [];
  }
}));

export default {
  DataDecoder,
  LandDataParser,
  MapGenerator,
  useDecodedMapStore
};
