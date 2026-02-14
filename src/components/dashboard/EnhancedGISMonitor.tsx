import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Loader, AlertCircle, MapPin, Eye, Zap, AlertTriangle, Ruler, Download } from 'lucide-react';
import { industriesData } from '../../lib/industries-data';
import { plotsData, getPlotByIndustryId } from '../../lib/plots-data';
import { getIndustryImagePath } from '../../lib/industry-images';

// Fix for default markers
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PlotFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    plotId: string;
    plotNumber: string;
    industryName: string;
    area: number;
    status: 'active' | 'vacant' | 'unusable' | 'disputed';
  };
}

// Generate GeoJSON features from plots data
function generatePlotFeatures(): FeatureCollection {
  const features = plotsData
    .filter((plot) => {
      // Only include plots with valid boundary coordinates
      return plot.boundaryCoordinates && plot.boundaryCoordinates.length >= 3;
    })
    .map((plot) => {
      // Convert boundaryCoordinates (lat/lng) to GeoJSON format (lng/lat)
      const coordinates = [
        (plot.boundaryCoordinates || []).map((coord) => [coord.lng, coord.lat]),
      ];

      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: coordinates.length > 0 && coordinates[0].length >= 3 ? coordinates : [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
        },
        properties: {
          plotId: plot.id,
          plotNumber: plot.plotNumber,
          industryName: plot.assignedIndustryName || plot.industryName || 'Unknown',
          area: plot.area,
          status: plot.status,
        },
      };
    });

  return {
    type: 'FeatureCollection',
    features,
  };
}

// Map updater component
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
      map.flyTo([center[0], center[1]], zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
}

// Time slider component
function TimeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const months = ['6 months ago', '4 months ago', '2 months ago', 'Today'];
  return (
    <div className="space-y-2">
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        max={3}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-600">
        <span>{months[0]}</span>
        <span className="font-semibold">{months[value]}</span>
        <span>{months[3]}</span>
      </div>
    </div>
  );
}

// Custom component to handle GeoJSON layer with dynamic highlighting
function PlotLayer({
  data,
  highlightedPlotId,
  getStatusColor,
  onEachFeature,
}: {
  data: any;
  highlightedPlotId: string | null;
  getStatusColor: (status: string) => string;
  onEachFeature: (feature: any, layer: L.Layer) => void;
}) {
  const map = useMap();
  const geoJsonRef = useRef<L.GeoJSON>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing layer
    if (geoJsonRef.current) {
      map.removeLayer(geoJsonRef.current);
    }

    // Create new GeoJSON layer
    const geoJson = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        onEachFeature(feature, layer);
      },
      style: (feature) => {
        const isHighlighted = feature?.properties?.plotId === highlightedPlotId;
        if (isHighlighted) {
          return {
            fillColor: '#fbbf24',
            weight: 5,
            opacity: 1,
            color: '#f59e0b',
            fillOpacity: 0.8,
            dashArray: '5, 5',
          };
        }
        return {
          fillColor: getStatusColor(feature?.properties?.status || 'active'),
          weight: 2,
          opacity: 0.7,
          color: '#333',
          fillOpacity: 0.6,
        };
      },
    });

    geoJson.addTo(map);
    geoJsonRef.current = geoJson;

    // Bring highlighted layer to front
    geoJson.eachLayer((layer: any) => {
      if (layer.feature?.properties?.plotId === highlightedPlotId && 'bringToFront' in layer) {
        layer.bringToFront();
      }
    });

    return () => {
      if (geoJsonRef.current) {
        map.removeLayer(geoJsonRef.current);
      }
    };
  }, [data, highlightedPlotId, map, onEachFeature, getStatusColor]);

  return null;
}

export function EnhancedGISMonitor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
  const [selectedPlot, setSelectedPlot] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<typeof industriesData>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.1815, 79.9864]); // Central India
  const [mapZoom, setMapZoom] = useState(8);
  const [timeSlider, setTimeSlider] = useState(3); // Today
  const [monitoringMode, setMonitoringMode] = useState<'live' | 'compare' | 'detection' | 'violations' | 'boundaries'>('live');
  const [showViolationAlerts, setShowViolationAlerts] = useState(false);
  const [highlightedPlotId, setHighlightedPlotId] = useState<string | null>(null);

  // Generate GeoJSON features for all plots
  const geoJsonData = generatePlotFeatures();

  // Get color based on plot status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#dc2626'; // red
      case 'vacant':
        return '#d1d5db'; // light grey
      case 'disputed':
        return '#eab308'; // yellow
      case 'unusable':
        return '#f97316'; // orange
      default:
        return '#3b82f6'; // blue
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const results = industriesData.filter(industry =>
      industry.companyName.toLowerCase().includes(searchLower) ||
      industry.registrationNumber.toLowerCase().includes(searchLower) ||
      industry.id.toLowerCase().includes(searchLower)
    );

    setSearchResults(results);
  };

  // Handle industry selection
  const handleSelectIndustry = (industry: any) => {
    setSelectedIndustry(industry);
    const plot = getPlotByIndustryId(industry.id);
    setSelectedPlot(plot);
    setHighlightedPlotId(plot?.id ?? null);
    
    // Auto-zoom to plot
    const lat = 23.1815 + (Math.random() - 0.5) * 5;
    const lon = 79.9864 + (Math.random() - 0.5) * 8;
    setMapCenter([lat, lon]);
    setMapZoom(14);
  };

  // GeoJSON feature binding (popup only)
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const popupContent = `
      <div style="width: 250px;">
        <h4 style="font-weight: bold; margin-bottom: 8px;">${feature.properties.plotNumber}</h4>
        <p style="font-size: 12px; margin: 4px 0;"><strong>Industry:</strong> ${feature.properties.industryName}</p>
        <p style="font-size: 12px; margin: 4px 0;"><strong>Area:</strong> ${feature.properties.area} ha</p>
        <p style="font-size: 12px; margin: 4px 0;"><strong>Status:</strong> <span style="color: ${getStatusColor(feature.properties.status)};"><strong>${feature.properties.status}</strong></span></p>
      </div>
    `;

    if (layer instanceof L.Polygon) {
      layer.bindPopup(popupContent);
    }
  };

  // Get tile URL based on monitoring mode
  const getTileUrl = () => {
    switch (monitoringMode) {
      case 'detection':
        // NDVI layer for change detection
        return 'https://gibs.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_Corrected_Reflectance_TrueColor/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg';
      case 'compare':
        // High-resolution satellite for comparison
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'boundaries':
        // Topo map for clear boundary visualization
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      case 'violations':
        // Standard satellite for violations overlay
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'live':
      default:
        // Latest Sentinel-2 imagery
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Controls */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Advanced GIS Monitoring System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search industry by name or registration number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                    {searchResults.map((industry) => (
                      <div
                        key={industry.id}
                        onClick={() => handleSelectIndustry(industry)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                      >
                        {getIndustryImagePath(industry.id) && (
                          <img
                            src={getIndustryImagePath(industry.id)!}
                            alt={industry.companyName}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{industry.companyName}</p>
                          <p className="text-xs text-slate-500">{industry.registrationNumber}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Monitoring Mode Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={monitoringMode === 'live' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMonitoringMode('live')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Live Monitoring
              </Button>
              <Button
                variant={monitoringMode === 'compare' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMonitoringMode('compare')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Compare Dates
              </Button>
              <Button
                variant={monitoringMode === 'detection' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMonitoringMode('detection')}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Change Detection
              </Button>
              <Button
                variant={monitoringMode === 'violations' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMonitoringMode('violations')}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Violations / Alerts
              </Button>
              <Button
                variant={monitoringMode === 'boundaries' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMonitoringMode('boundaries')}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Plot Boundaries
              </Button>
            </div>

            {/* Time Slider for Historical Data */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm font-semibold text-slate-900 mb-3">Historical Timeline</p>
              <TimeSlider value={timeSlider} onChange={setTimeSlider} />
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-xs font-medium text-slate-700">Industry Allotted</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <div className="w-4 h-4 rounded bg-gray-400"></div>
                <span className="text-xs font-medium text-slate-700">Vacant</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                <div className="w-4 h-4 rounded bg-yellow-400"></div>
                <span className="text-xs font-medium text-slate-700">Disputed</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                <div className="w-4 h-4 rounded bg-orange-500"></div>
                <span className="text-xs font-medium text-slate-700">Unusable</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Map View */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div style={{ height: '600px', width: '100%' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                >
                  {/* Base Satellite Layer - Changes based on monitoring mode */}
                  <TileLayer
                    url={getTileUrl()}
                    attribution={monitoringMode === 'detection' ? '&copy; NASA GIBS' : monitoringMode === 'boundaries' ? '&copy; Esri' : '&copy; Esri, DigitalGlobe'}
                    maxZoom={20}
                  />

                  {/* Map Updater */}
                  <MapUpdater center={mapCenter} zoom={mapZoom} />

                  {/* GeoJSON Plot Layer with Highlighting */}
                  <PlotLayer
                    data={geoJsonData}
                    highlightedPlotId={highlightedPlotId}
                    getStatusColor={getStatusColor}
                    onEachFeature={onEachFeature}
                  />

                  {/* Violation Alerts Overlay - Show when violations mode active */}
                  {monitoringMode === 'violations' && selectedPlot && (
                    <>
                      <Marker position={[mapCenter[0] + 0.02, mapCenter[1] + 0.01]}>
                        <Popup>
                          <div className="text-xs">
                            <p className="font-semibold text-red-600">⚠️ Construction Activity Detected</p>
                            <p>Unauthorized expansion zone</p>
                          </div>
                        </Popup>
                      </Marker>
                      <Marker position={[mapCenter[0] - 0.015, mapCenter[1] - 0.02]}>
                        <Popup>
                          <div className="text-xs">
                            <p className="font-semibold text-orange-600">🌱 Vegetation Loss Area</p>
                            <p>12% vegetation decrease</p>
                          </div>
                        </Popup>
                      </Marker>
                    </>
                  )}

                  {/* Change Detection Markers - Show when detection mode active */}
                  {monitoringMode === 'detection' && selectedPlot && (
                    <>
                      <Marker position={[mapCenter[0] + 0.02, mapCenter[1] + 0.01]}>
                        <Popup>
                          <div className="text-xs">
                            <p className="font-semibold text-red-600">🔴 Change Detected</p>
                            <p>NDVI change: -12%</p>
                          </div>
                        </Popup>
                      </Marker>
                      <Marker position={[mapCenter[0] - 0.015, mapCenter[1] - 0.02]}>
                        <Popup>
                          <div className="text-xs">
                            <p className="font-semibold text-orange-600">🟠 Secondary Detection</p>
                            <p>Boundary shift detected</p>
                          </div>
                        </Popup>
                      </Marker>
                    </>
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Industry/Plot Details */}
        <div className="space-y-4">
          {selectedIndustry && selectedPlot ? (
            <>
              {/* Industry Card */}
              <Card className="border-emerald-300">
                <CardHeader className="border-b border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
                  <CardTitle className="text-sm font-semibold">Selected Industry</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {getIndustryImagePath(selectedIndustry.id) && (
                    <img
                      src={getIndustryImagePath(selectedIndustry.id)!}
                      alt={selectedIndustry.companyName}
                      className="w-full h-48 rounded-lg object-cover border border-slate-300"
                    />
                  )}
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">COMPANY NAME</p>
                    <p className="text-sm font-bold text-slate-900">{selectedIndustry.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">REGISTRATION</p>
                    <p className="text-sm font-mono text-slate-900">{selectedIndustry.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">TYPE</p>
                    <p className="text-sm text-slate-900">{selectedIndustry.industryType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">COMPLIANCE</p>
                    <Badge className="mt-1 bg-green-500">{selectedIndustry.complianceStatus}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Plot Card */}
              <Card className="border-blue-300">
                <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="text-sm font-semibold">Allotted Plot</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">PLOT ID</p>
                    <p className="text-sm font-mono font-bold text-blue-900">{selectedPlot.plotNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">AREA</p>
                    <p className="text-sm font-bold text-slate-900">{selectedPlot.area} hectares</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">STATUS</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: getStatusColor(selectedPlot.status) }}
                      ></div>
                      <span className="text-sm font-semibold capitalize text-slate-900">
                        {selectedPlot.status}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Plot Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedIndustry(null);
                        setSelectedPlot(null);
                        setHighlightedPlotId(null);
                      }}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Alerts */}
              {selectedIndustry.complianceStatus === 'Violation' && (
                <Card className="border-red-300">
                  <CardHeader className="border-b border-red-200 bg-red-50">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-900">
                      <AlertTriangle className="h-4 w-4" />
                      Compliance Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-xs text-red-800">
                      Unauthorized expansion detected beyond plot boundaries. Immediate inspection required.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-slate-200">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600">
                  Search for an industry to view its allotted plot and satellite data
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Change Detection Info */}
      {monitoringMode === 'detection' && (
        <Card className="border-orange-300">
          <CardHeader className="border-b border-orange-200 bg-orange-50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-4 w-4" />
              Change Detection Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid md:grid-cols-4 gap-3 text-xs">
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <p className="font-semibold text-red-900">Construction Activity</p>
                <p className="text-red-700 mt-1">5 anomalies detected</p>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="font-semibold text-green-900">Vegetation Loss</p>
                <p className="text-green-700 mt-1">12% decrease</p>
              </div>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-900">Water Spread</p>
                <p className="text-blue-700 mt-1">No change detected</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="font-semibold text-yellow-900">Boundary Encroachment</p>
                <p className="text-yellow-700 mt-1">0.5 ha unauthorized</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Satellite imagery comparison removed per request */}
    </div>
  );
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: any[];
}
