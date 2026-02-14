import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Search, AlertTriangle, CheckCircle, MapPin, Info, Globe } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import L from 'leaflet';
import { plotsData } from '../lib/plots-data';
import { chhattisgarh_land_parcels, chhattisgarh_industries, chhattisgarh_state_center } from '../lib/chhattisgarh-data';

// Naya Raipur center coordinates
const NAYA_RAIPUR_CENTER: [number, number] = [21.2458, 81.6304];
const CHHATTISGARH_CENTER: [number, number] = chhattisgarh_state_center as [number, number];

// Plot ID to coordinates mapping for accurate positioning - Naya Raipur
const nayaRaipurCoordinates: Record<string, [[number, number], [number, number], [number, number], [number, number]]> = {
  'PLT-001': [[21.2450, 81.6280], [21.2460, 81.6290], [21.2455, 81.6310], [21.2445, 81.6300]],
  'PLT-002': [[21.2460, 81.6310], [21.2470, 81.6320], [21.2465, 81.6340], [21.2455, 81.6330]],
  'PLT-003': [[21.2470, 81.6330], [21.2480, 81.6340], [21.2475, 81.6360], [21.2465, 81.6350]],
  'PLT-004': [[21.2440, 81.6250], [21.2450, 81.6260], [21.2445, 81.6280], [21.2435, 81.6270]],
  'PLT-005': [[21.2450, 81.6200], [21.2460, 81.6210], [21.2455, 81.6230], [21.2445, 81.6220]],
  'PLT-006': [[21.2420, 81.6280], [21.2430, 81.6290], [21.2425, 81.6310], [21.2415, 81.6300]],
  'PLT-007': [[21.2480, 81.6280], [21.2490, 81.6290], [21.2485, 81.6310], [21.2475, 81.6300]],
  'PLT-008': [[21.2410, 81.6240], [21.2420, 81.6250], [21.2415, 81.6270], [21.2405, 81.6260]],
  'PLT-009': [[21.2500, 81.6250], [21.2510, 81.6260], [21.2505, 81.6280], [21.2495, 81.6270]],
  'PLT-010': [[21.2430, 81.6350], [21.2440, 81.6360], [21.2435, 81.6380], [21.2425, 81.6370]],
  'PLT-011': [[21.2520, 81.6300], [21.2530, 81.6310], [21.2525, 81.6330], [21.2515, 81.6320]],
  'PLT-012': [[21.2400, 81.6200], [21.2410, 81.6210], [21.2405, 81.6230], [21.2395, 81.6220]],
  'PLT-013': [[21.2460, 81.6360], [21.2470, 81.6370], [21.2465, 81.6390], [21.2455, 81.6380]],
  'PLT-014': [[21.2490, 81.6200], [21.2500, 81.6210], [21.2495, 81.6230], [21.2485, 81.6220]],
  'PLT-015': [[21.2410, 81.6310], [21.2420, 81.6320], [21.2415, 81.6340], [21.2405, 81.6330]],
  'PLT-2024-150': [[21.6250, 77.2220], [21.6260, 77.2230], [21.6255, 77.2250], [21.6245, 77.2240]], // Sumit's plot
};

// Fix for default markers
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map center updater component
function MapCenterUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface PlotMonitoringMapProps {
  selectedIndustryId?: string;
  onPlotSelect?: (plotId: string) => void;
  onIndustrySelect?: (industryId: string) => void;
}

export function PlotMonitoringMapInteractive({
  selectedIndustryId,
  onPlotSelect,
  onIndustrySelect,
}: PlotMonitoringMapProps) {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'vacant' | 'unusable' | 'disputed'>('all');
  const [region, setRegion] = useState<'naya-raipur' | 'chhattisgarh'>('naya-raipur');

  // Get plots based on region
  const regionPlots = useMemo(() => {
    if (region === 'chhattisgarh') {
      // Convert Chhattisgarh land parcels to plot format
      return chhattisgarh_land_parcels.map(parcel => {
        const industry = chhattisgarh_industries.find(i => i.id === parcel.industry);
        return {
          id: parcel.id,
          plotNumber: parcel.name,
          status: parcel.status as 'active' | 'vacant' | 'unusable' | 'disputed',
          area: parcel.area * 4047, // Convert acres to m²
          assignedIndustryId: industry?.id,
          assignedIndustryName: industry?.name,
          industryType: industry?.type,
          complianceStatus: parcel.status === 'violation' ? 'Violation' as const : 'Compliant' as const,
          complianceScore: parcel.status === 'violation' ? 45 : 85,
          environmentalStatus: parcel.status === 'violation' ? 'Red' as const : 'Green' as const,
          boundaryCoordinates: parcel.coordinates.map(([lat, lng]) => ({ lat, lng })),
        };
      });
    }
    return plotsData.map(p => ({
      ...p,
      status: p.status as 'active' | 'vacant' | 'unusable' | 'disputed'
    }));
  }, [region]);

  // Filter plots based on search and status
  const filteredPlots = useMemo(() => {
    return regionPlots.filter(plot => {
      const matchesSearch = 
        plot.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.assignedIndustryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || plot.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, regionPlots]);

  // Get status color for display
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': '#dc2626',
      'vacant': '#d1d5db',
      'unusable': '#f59e0b',
      'disputed': '#eab308',
    };
    return colors[status] || '#999';
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-red-100 text-red-800',
      'vacant': 'bg-gray-100 text-gray-800',
      'unusable': 'bg-orange-100 text-orange-800',
      'disputed': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get compliance badge color
  const getComplianceBadgeColor = (status?: string) => {
    const colors: Record<string, string> = {
      'Compliant': 'bg-green-100 text-green-800',
      'Violation': 'bg-red-100 text-red-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Pending': 'bg-gray-100 text-gray-800',
    };
    return colors[status || 'Pending'] || 'bg-gray-100 text-gray-800';
  };

  const selectedPlotData = selectedPlot ? regionPlots.find(p => p.id === selectedPlot) : null;

  // Get map center and zoom based on region
  const mapCenter = region === 'chhattisgarh' ? CHHATTISGARH_CENTER : NAYA_RAIPUR_CENTER;
  const mapZoom = region === 'chhattisgarh' ? 8 : 14;

  // Get coordinates for a plot based on region
  const getPlotCoordinates = (plotId: string) => {
    if (region === 'chhattisgarh') {
      const parcel = chhattisgarh_land_parcels.find(p => p.id === plotId);
      if (parcel) {
        return parcel.coordinates as [[number, number], [number, number], [number, number], [number, number]];
      }
    } else {
      return nayaRaipurCoordinates[plotId];
    }
  };

  return (
    <div className="space-y-6">
      {/* Region Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              View By Region:
            </span>
            <Button
              onClick={() => { setRegion('naya-raipur'); setSelectedPlot(null); }}
              className={`${region === 'naya-raipur' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              Naya Raipur
            </Button>
            <Button
              onClick={() => { setRegion('chhattisgarh'); setSelectedPlot(null); }}
              className={`${region === 'chhattisgarh' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              Chhattisgarh State
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {region === 'chhattisgarh' ? 'Chhattisgarh Industrial Plots' : 'Naya Raipur Industrial Plots'} - Interactive Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Real-time geographic visualization of all land plots with accurate positioning, compliance tracking, and industry assignments.
          </p>
          {region === 'chhattisgarh' && (
            <p className="text-sm text-green-700 mt-2">
              Showing 22 land parcels from 8 major industries across Chhattisgarh sectors
            </p>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 mb-1">Total Plots</p>
            <p className="text-2xl font-bold text-blue-600">{filteredPlots.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 mb-1">Active</p>
            <p className="text-2xl font-bold text-red-600">{filteredPlots.filter(p => p.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 mb-1">Vacant</p>
            <p className="text-2xl font-bold text-gray-600">{filteredPlots.filter(p => p.status === 'vacant').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 mb-1">Violations</p>
            <p className="text-2xl font-bold text-yellow-600">{filteredPlots.filter(p => p.status === 'disputed' || p.complianceStatus === 'Violation').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Search Plots</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by plot number, industry name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Filter by Status</label>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setFilterStatus('all')}
                className={`${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                All
              </Button>
              <Button
                onClick={() => setFilterStatus('active')}
                className={`${filterStatus === 'active' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                Active
              </Button>
              <Button
                onClick={() => setFilterStatus('vacant')}
                className={`${filterStatus === 'vacant' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                Vacant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <MapContainer
              style={{ height: '100%', width: '100%' }}
              zoom={mapZoom}
              center={mapCenter}
              {...({} as any)}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                {...({} as any)}
              />

              <MapCenterUpdater center={mapCenter} zoom={mapZoom} />

              {/* Plot Polygons */}
              {filteredPlots.map(plot => {
                const coords = getPlotCoordinates(plot.id);
                const isSelected = selectedPlot === plot.id;

                if (!coords) return null;

                return (
                  <Polygon
                    key={plot.id}
                    positions={coords}
                    pathOptions={{
                      color: getStatusColor(plot.status),
                      fillColor: getStatusColor(plot.status),
                      fillOpacity: isSelected ? 0.8 : 0.6,
                      weight: isSelected ? 3 : 2,
                      dashArray: plot.status === 'disputed' ? '5, 5' : undefined,
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedPlot(plot.id);
                        onPlotSelect?.(plot.id);
                      }
                    }}
                  >
                    <Popup>
                      <div className="text-sm space-y-1">
                        <p className="font-bold">{plot.plotNumber}</p>
                        <p className="text-xs text-gray-600">{plot.assignedIndustryName || 'Vacant'}</p>
                        <p className="text-xs">Area: {plot.area.toLocaleString()} m²</p>
                        <Badge className={getStatusBadgeColor(plot.status)}>
                          {plot.status}
                        </Badge>
                      </div>
                    </Popup>
                  </Polygon>
                );
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Plots List */}
      <Card>
        <CardHeader>
          <CardTitle>Plots List ({filteredPlots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredPlots.map(plot => (
              <div
                key={plot.id}
                onClick={() => setSelectedPlot(plot.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPlot === plot.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">{plot.plotNumber}</h3>
                    <p className="text-xs text-gray-600">{plot.id}</p>
                  </div>
                  <Badge className={getStatusBadgeColor(plot.status)}>
                    {plot.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-700 mb-2">{plot.assignedIndustryName || 'Unassigned'}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <p className="text-gray-500">Area</p>
                    <p className="font-medium">{(plot.area / 1000).toFixed(1)} m²</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Compliance</p>
                    <p className="font-medium">{plot.complianceScore || 'N/A'}%</p>
                  </div>
                </div>
                {plot.complianceStatus && (
                  <Badge className={getComplianceBadgeColor(plot.complianceStatus)}>
                    {plot.complianceStatus}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Plot Details */}
      {selectedPlotData && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Selected Plot Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Plot Number</p>
                <p className="font-semibold text-sm">{selectedPlotData.plotNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Plot ID</p>
                <p className="font-semibold text-sm">{selectedPlotData.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Area</p>
                <p className="font-semibold text-sm">{(selectedPlotData.area / 1000).toFixed(2)} m²</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <Badge className={getStatusBadgeColor(selectedPlotData.status)}>
                  {selectedPlotData.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-600">Industry</p>
                <p className="font-semibold text-sm">{selectedPlotData.assignedIndustryName || 'Vacant'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Type</p>
                <p className="font-semibold text-sm">{selectedPlotData.industryType || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white rounded border">
              <div>
                <p className="text-xs text-gray-600">Compliance Score</p>
                <p className="font-bold text-lg">{selectedPlotData.complianceScore || 'N/A'}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <Badge className={getComplianceBadgeColor(selectedPlotData.complianceStatus)}>
                  {selectedPlotData.complianceStatus || 'Pending'}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-600">Environmental</p>
                <p className="font-semibold text-sm">{selectedPlotData.environmentalStatus || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4" />
            Map Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-xs">Active Industrial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#d1d5db' }}></div>
              <span className="text-xs">Vacant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-xs">Unusable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#eab308' }}></div>
              <span className="text-xs">Disputed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PlotMonitoringMapInteractive;
