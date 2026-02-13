import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Search, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers




const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SatelliteMapProps {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  plotId?: string;
  title?: string;
  height?: string;
}

function MapUpdater({ coordinates }: { coordinates?: { latitude: number; longitude: number } }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView([coordinates.latitude, coordinates.longitude], 14);
    }
  }, [coordinates, map]);

  return null;
}

export function SatelliteMap({
  coordinates = { latitude: 20.1920, longitude: 81.7196 }, // Default to Naya Raipur, Chhattisgarh
  plotId = 'PLT-2024-001',
  title = 'Satellite Map',
  height = '400px'
}: SatelliteMapProps) {
  const [searchInput, setSearchInput] = useState('');
  const [mapCoordinates, setMapCoordinates] = useState(coordinates);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const defaultCoordinates = { latitude: 20.1920, longitude: 81.7196 };
  const activeCoordinates = mapCoordinates || defaultCoordinates;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setSearchError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=1`
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        setMapCoordinates({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        });
        setSearchInput('');
      } else {
        setSearchError('Location not found. Try a different search.');
      }
    } catch (error) {
      setSearchError('Error searching for location.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const latDelta = 0.02;
  const lonDelta = 0.02;
  const bounds = [
    [activeCoordinates.latitude - latDelta, activeCoordinates.longitude - lonDelta],
    [activeCoordinates.latitude + latDelta, activeCoordinates.longitude + lonDelta]
  ] as [[number, number], [number, number]];

  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200 bg-slate-50">
        <div className="space-y-3">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search location (e.g., Naya Raipur, Delhi)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-9 bg-white border-slate-300"
                disabled={isSearching}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchInput.trim()}
              className="px-4 h-9 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Find'
              )}
            </button>
          </form>

          {/* Error Message */}
          {searchError && (
            <p className="text-xs text-red-600">{searchError}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <MapContainer
          center={[activeCoordinates.latitude, activeCoordinates.longitude]}
          zoom={14}
          style={{ height, width: '100%' }}
          className="rounded-b-lg"
        >
          {/* Satellite Tile Layer */}
          <TileLayer
  {...{
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, DigitalGlobe, Earthstar Geographics",
  }}
/>

          {/* Update map when coordinates change */}
          <MapUpdater coordinates={activeCoordinates} />

          {/* Plot Area Rectangle */}
          <Rectangle
            bounds={bounds}
            pathOptions={{
              color: '#037953',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.1,
              dashArray: '5, 5'
            }}
          />

          {/* Center Marker */}
          <Marker position={[activeCoordinates.latitude, activeCoordinates.longitude]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{plotId}</p>
                <p>Lat: {activeCoordinates.latitude.toFixed(4)}</p>
                <p>Lon: {activeCoordinates.longitude.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </CardContent>
    </Card>
  );
}
