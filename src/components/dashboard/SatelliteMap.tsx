import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Loader, AlertCircle, MapPin } from 'lucide-react';
import { getIndustryImagePath } from '../../lib/industry-images';

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
  industryId?: string;
  industryName?: string;
}

interface LocationResult {
  lat: number;
  lon: number;
  name: string;
  address?: string;
}

/**
 * Map updater component - handles smooth transitions
 */
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      // Smooth animation to new coordinates
      map.flyTo([center[0], center[1]], zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
}

/**
 * Main Satellite Map with location search integrated
 */
export function SatelliteMap({
  coordinates = { latitude: 28.5355, longitude: 77.3910 }, // Default to demo area
  plotId = 'PLT-2024-001',
  title = 'Search Location on Satellite Map',
  height = '600px',
  industryId,
  industryName
}: SatelliteMapProps) {
  const defaultCoordinates = { latitude: 28.5355, longitude: 77.3910 };
  const activeCoordinates = coordinates || defaultCoordinates;

  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    activeCoordinates.latitude,
    activeCoordinates.longitude,
  ]);
  const [mapZoom, setMapZoom] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundLocation, setFoundLocation] = useState<LocationResult | null>(null);

  /**
   * Search for location using Nominatim (OpenStreetMap)
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use Nominatim geocoding API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Failed to search location');
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setError(`No location found for "${searchQuery}"`);
        setFoundLocation(null);
        return;
      }

      const location = data[0];
      const lat = parseFloat(location.lat);
      const lon = parseFloat(location.lon);

      setFoundLocation({
        lat,
        lon,
        name: location.name,
        address: location.display_name,
      });

      // Update map center with smooth animation
      setMapCenter([lat, lon]);
      setMapZoom(16);
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search location. Please try again.');
      setFoundLocation(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 h-full flex flex-col">
      <CardHeader className="border-b border-slate-200 bg-slate-50">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-3 flex-1 overflow-hidden">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a location (address, city, place name)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading}
            className="px-4"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Found Location Info */}
        {foundLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-green-900 text-sm">{foundLocation.name}</p>
                <p className="text-xs text-green-700 truncate">{foundLocation.address}</p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-green-600 font-mono">
                    Lat: {foundLocation.lat.toFixed(6)}
                  </span>
                  <span className="text-green-600 font-mono">
                    Lon: {foundLocation.lon.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <MapContainer
          style={{ height: '100%', width: '100%', minHeight: '400px' }}
          className="rounded-lg flex-1"
          center={mapCenter}
          zoom={mapZoom}
        >
          {/* Satellite Tile Layer */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; <a href='https://www.esri.com/'>Esri</a>"
          />

          {/* Map updater for smooth animations */}
          <MapUpdater center={mapCenter} zoom={mapZoom} />

          {/* Marker for found location */}
          {foundLocation && (
            <Marker position={[foundLocation.lat, foundLocation.lon]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{foundLocation.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{foundLocation.address}</p>
                  <div className="text-xs font-mono mt-2 space-y-1">
                    <p>Lat: {foundLocation.lat.toFixed(6)}</p>
                    <p>Lon: {foundLocation.lon.toFixed(6)}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Default marker */}
          <Marker position={mapCenter}>
            <Popup>
              {(() => {
                const imagePath = industryId ? getIndustryImagePath(industryId) : null;
                return (
                  <div className="text-sm max-w-xs">
                    {imagePath && (
                      <div className="mb-2 w-32 h-24 rounded overflow-hidden border border-slate-300">
                        <img
                          src={imagePath}
                          alt={industryName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <p className="font-semibold">{industryName || plotId}</p>
                    <p className="text-xs">
                      Lat: {mapCenter[0].toFixed(6)}
                    </p>
                    <p className="text-xs">
                      Lon: {mapCenter[1].toFixed(6)}
                    </p>
                  </div>
                );
              })()}
            </Popup>
          </Marker>
        </MapContainer>
      </CardContent>
    </Card>
  );
}
