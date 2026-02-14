import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Input } from './ui/input';
import L from 'leaflet';
import { chhattisgarh_industries, chhattisgarh_land_parcels, chhattisgarh_state_center } from '../lib/chhattisgarh-data';

// Fix for default markers
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ViolationIcon = L.icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiNlZjNiNGQiLz48dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+ITwvdGV4dD48L3N2Zz4=",
  iconSize: [32, 41],
  iconAnchor: [16, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map center updater component
function MapCenterUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export function Chhattisgarh2DMap() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'violation'>('all');

  // Filter industries based on search and status
  const filteredIndustries = useMemo(() => {
    return chhattisgarh_industries.filter(ind => {
      const matchesSearch = ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ind.sector.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || ind.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  // Get plots for selected industry or all
  const displayParcels = selectedIndustry
    ? chhattisgarh_land_parcels.filter(p => {
        const ind = chhattisgarh_industries.find(i => i.id === selectedIndustry);
        return ind?.plots.includes(p.id);
      })
    : chhattisgarh_land_parcels;

  // Calculate statistics
  const stats = useMemo(() => {
    const activeCount = filteredIndustries.filter(i => i.status === 'active').length;
    const violationCount = filteredIndustries.filter(i => i.status === 'violation').length;
    const totalArea = filteredIndustries.reduce((sum, i) => sum + i.totalArea, 0);
    const occupiedArea = filteredIndustries.reduce((sum, i) => sum + i.occupiedArea, 0);
    return { activeCount, violationCount, totalArea, occupiedArea };
  }, [filteredIndustries]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Chhattisgarh Industrial Land Parcels - Geographic View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Interactive map showing industrial land parcels, compliance status, and spatial distribution across Chhattisgarh sectors.
          </p>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 mb-1">Total Industries</p>
            <p className="text-2xl font-bold text-blue-600">{filteredIndustries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 mb-1">Active Status</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 mb-1">Violations</p>
            <p className="text-2xl font-bold text-red-600">{stats.violationCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 mb-1">Total Land (acres)</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalArea}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Search Industries & Sectors</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by industry name or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Filter by Status</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setFilterStatus('all')}
                className={`${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                All
              </Button>
              <Button
                onClick={() => setFilterStatus('active')}
                className={`${filterStatus === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                Active
              </Button>
              <Button
                onClick={() => setFilterStatus('violation')}
                className={`${filterStatus === 'violation' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                Violations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden" style={{ height: '500px' }}>
            <MapContainer
              style={{ height: '100%', width: '100%' }}
              zoom={8}
              center={chhattisgarh_state_center as [number, number]}
              {...({} as any)}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                {...({} as any)}
              />

              <MapCenterUpdater center={chhattisgarh_state_center as [number, number]} zoom={8} />

              {/* Industry Markers */}
              {filteredIndustries.map((industry) => {
                const MarkerComponent = Marker as any;
                return (
                  <MarkerComponent
                    key={industry.id}
                    position={[industry.coordinates[0], industry.coordinates[1]]}
                    icon={industry.status === 'violation' ? ViolationIcon : DefaultIcon}
                    eventHandlers={{
                      click: () => setSelectedIndustry(industry.id)
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{industry.name}</p>
                        <p className="text-xs text-gray-600">{industry.type}</p>
                        <Badge className={industry.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {industry.status}
                        </Badge>
                      </div>
                    </Popup>
                  </MarkerComponent>
                );
              })}

              {/* Land Parcels Polygons */}
              {displayParcels.map((parcel) => {
                const industry = chhattisgarh_industries.find(i => i.id === parcel.industry);
                return (
                  <Polygon
                    key={parcel.id}
                    positions={parcel.coordinates as [[number, number], [number, number], [number, number], [number, number]]}
                    pathOptions={{
                      color: industry?.status === 'violation' ? '#ef4444' : '#3b82f6',
                      fillColor: industry?.status === 'violation' ? '#fee2e2' : '#dbeafe',
                      fillOpacity: 0.6,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1">
                        <p className="font-bold">{parcel.name}</p>
                        <p>{industry?.name}</p>
                        <p className="text-gray-600">Area: {parcel.area} acres</p>
                        <Badge className={parcel.status === 'active' ? 'bg-green-100 text-green-800 text-xs' : 'bg-red-100 text-red-800 text-xs'}>
                          {parcel.status}
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

      {/* Industries List - Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle>Industries ({filteredIndustries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredIndustries.map((industry) => (
              <div
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedIndustry === industry.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-gray-900">{industry.name}</h3>
                  <Badge className={industry.status === 'active' ? 'bg-green-100 text-green-800 text-xs' : 'bg-red-100 text-red-800 text-xs'}>
                    {industry.status === 'active' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                    {industry.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{industry.type}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Sector</p>
                    <p className="font-medium">{industry.sector}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Plots</p>
                    <p className="font-medium">{industry.plots.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Area</p>
                    <p className="font-medium">{industry.totalArea} ac</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Occupied</p>
                    <p className="font-medium">{industry.occupiedArea} ac</p>
                  </div>
                </div>
                {industry.deviationPercent !== 0 && (
                  <Alert className={`mt-3 ${industry.deviationPercent > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <AlertDescription className={`text-xs ${industry.deviationPercent > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {industry.deviationPercent > 0 ? '+' : ''}{industry.deviationPercent}% land usage deviation
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Industry Details */}
      {selectedIndustry && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Selected Industry Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const industry = chhattisgarh_industries.find(i => i.id === selectedIndustry);
              if (!industry) return null;
              
              const industryParcels = chhattisgarh_land_parcels.filter(p => p.industry === industry.id);
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Industry Name</p>
                      <p className="font-semibold text-sm">{industry.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Type</p>
                      <p className="font-semibold text-sm">{industry.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Sector</p>
                      <p className="font-semibold text-sm">{industry.sector}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <Badge className={industry.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {industry.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm mb-3">Land Parcels</h4>
                    <div className="space-y-2">
                      {industryParcels.map(parcel => (
                        <div key={parcel.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div>
                            <p className="text-sm font-medium">{parcel.name}</p>
                            <p className="text-xs text-gray-600">{parcel.area} acres</p>
                          </div>
                          <Badge className={parcel.status === 'active' ? 'bg-green-100 text-green-800 text-xs' : 'bg-red-100 text-red-800 text-xs'}>
                            {parcel.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded border">
                    <div>
                      <p className="text-xs text-gray-600">Total Allocated</p>
                      <p className="font-bold text-lg">{industry.totalArea}</p>
                      <p className="text-xs text-gray-500">acres</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Currently Occupied</p>
                      <p className="font-bold text-lg">{industry.occupiedArea}</p>
                      <p className="text-xs text-gray-500">acres</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Deviation</p>
                      <p className={`font-bold text-lg ${industry.deviationPercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {industry.deviationPercent > 0 ? '+' : ''}{industry.deviationPercent}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
