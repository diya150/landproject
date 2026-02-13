import { useState, useEffect } from 'react';
import { AlertTriangle, Maximize2, Download, Calendar, Loader2, MapPin, Eye, Search, X, MapPinCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { SeverityBadge } from '../components/dashboard/SeverityBadge';
import { SatelliteMap } from '../components/dashboard/SatelliteMap';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { industriesData } from '../lib/industries-data';
import { plotsData, getPlotByIndustryId } from '../lib/plots-data';

const API_BASE_URL = 'http://localhost:5000/api';

export function ChangeDetection() {
  const [comparisonValue, setComparisonValue] = useState([50]);
  const [loading, setLoading] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState('PLT-2024-001');
  const [beforeDate, setBeforeDate] = useState('2024-01-15');
  const [afterDate, setAfterDate] = useState('2026-02-13');
  const [changeDetectionData, setChangeDetectionData] = useState(null);
  const [satelliteImagery, setSatelliteImagery] = useState(null);
  const [spectralData, setSpectralData] = useState(null);
  const [viewMode, setViewMode] = useState('rgb'); // rgb, ndvi, false-color
  
  // Land Allotted feature states
  const [landSearchTerm, setLandSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedLandPlot, setSelectedLandPlot] = useState(null);
  const [showLandDetails, setShowLandDetails] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Fetch satellite change detection data
  useEffect(() => {
    const fetchChangeDetection = async () => {
      if (!selectedPlot || !beforeDate || !afterDate) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/satellite/change-detection/compare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plotId: selectedPlot, beforeDate, afterDate })
        });

        if (response.ok) {
          const result = await response.json();
          setChangeDetectionData(result.data?.changeDetection);
        }
      } catch (error) {
        console.error('Error fetching change detection data:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchChangeDetection, 500);
    return () => clearTimeout(timer);
  }, [selectedPlot, beforeDate, afterDate]);

  // Fetch satellite imagery
  useEffect(() => {
    const fetchImagery = async () => {
      setLoading(true);
      try {
        const rgbResponse = await fetch(`${API_BASE_URL}/satellite/spectral/rgb/${selectedPlot}`);
        const ndviResponse = await fetch(`${API_BASE_URL}/satellite/spectral/ndvi/${selectedPlot}`);
        const fcResponse = await fetch(`${API_BASE_URL}/satellite/spectral/false-color/${selectedPlot}`);

        if (rgbResponse.ok && ndviResponse.ok && fcResponse.ok) {
          const rgb = await rgbResponse.json();
          const ndvi = await ndviResponse.json();
          const fc = await fcResponse.json();
          
          setSatelliteImagery({
            rgb: rgb.data?.rgb,
            ndvi: ndvi.data?.ndvi,
            falseColor: fc.data?.falseColor
          });
        }
      } catch (error) {
        console.error('Error fetching satellite imagery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImagery();
  }, [selectedPlot, viewMode]);

  // Handle Land Allotted search
  useEffect(() => {
    if (!landSearchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredIndustries = Object.values(industriesData).filter((industry) => {
      const searchLower = landSearchTerm.toLowerCase();
      return (
        industry.companyName.toLowerCase().includes(searchLower) ||
        industry.registrationNumber.toLowerCase().includes(searchLower) ||
        industry.plotNumber.toLowerCase().includes(searchLower)
      );
    });

    setSearchResults(filteredIndustries);
  }, [landSearchTerm]);

  // Handle industry selection for Land Allotted
  const handleSelectIndustry = (industry) => {
    setSelectedIndustry(industry);
    const plot = getPlotByIndustryId(industry.registrationNumber);
    setSelectedLandPlot(plot);
    setShowLandDetails(false);
    setLandSearchTerm('');
    setSearchResults([]);
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#dc2626'; // red
      case 'vacant':
        return '#d1d5db'; // grey
      case 'unusable':
        return '#f59e0b'; // orange
      case 'disputed':
        return '#eab308'; // yellow
      default:
        return '#3b82f6'; // blue
    }
  };

  // Helper function to calculate polygon center
  const calculatePolygonCenter = (pointsString) => {
    const coords = pointsString.split(' ').map((point) => {
      const [x, y] = point.split(',').map(Number);
      return { x, y };
    });

    const centerX =
      coords.reduce((sum, coord) => sum + coord.x, 0) / coords.length;
    const centerY =
      coords.reduce((sum, coord) => sum + coord.y, 0) / coords.length;

    return { x: centerX, y: centerY };
  };

  // Helper function to get industry icon emoji
  const getIndustryIcon = (industryType) => {
    const iconMap = {
      'Steel Manufacturing': '🏭',
      'Pharmaceutical': '💊',
      'Information Technology': '💻',
      'Automotive': '🚗',
      'Textile': '👕',
      'Food Processing': '🍱',
      'Chemical': '⚗️',
      'Power Generation': '⚡',
      'Machinery': '⚙️',
      'Logistics': '📦',
    };
    return iconMap[industryType] || '🏢';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Satellite Change Detection</h1>
          <p className="text-slate-600">Real-time Sentinel 2 satellite imagery analysis with AI-powered detection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Control Panel */}
      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Plot</label>
              <Select value={selectedPlot} onValueChange={setSelectedPlot}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLT-2024-001">PLT-2024-001</SelectItem>
                  <SelectItem value="PLT-2024-005">PLT-2024-005</SelectItem>
                  <SelectItem value="PLT-2024-003">PLT-2024-003</SelectItem>
                  <SelectItem value="PLT-2024-012">PLT-2024-012</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Before Date</label>
              <input
                type="date"
                value={beforeDate}
                onChange={(e) => setBeforeDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">After Date</label>
              <input
                type="date"
                value={afterDate}
                onChange={(e) => setAfterDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">View Mode</label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rgb">RGB True Color</SelectItem>
                  <SelectItem value="ndvi">NDVI Vegetation</SelectItem>
                  <SelectItem value="false-color">False Color (NIR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Detection Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-600 mb-1">Detection Status</p>
            <p className="text-2xl font-bold text-slate-900">
              {changeDetectionData?.changeDetected ? '⚠️ Active' : '✓ Stable'}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {changeDetectionData?.timeframe?.daysDifference || 0} days analyzed
            </p>
          </CardContent>
        </Card>

        <Card className={changeDetectionData?.changeDetected ? 'border-red-200 bg-red-50' : 'border-slate-200'}>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-600 mb-1">Change Type</p>
            <p className="text-lg font-bold text-slate-900">
              {changeDetectionData?.changeType || 'Analyzing...'}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Confidence: {changeDetectionData?.confidence ? `${(changeDetectionData.confidence * 100).toFixed(0)}%` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-600 mb-1">Severity Level</p>
            <div className="flex items-center gap-2">
              <SeverityBadge 
                severity={
                  changeDetectionData?.severity === 'CRITICAL' ? 'critical' :
                  changeDetectionData?.severity === 'HIGH' ? 'high' : 'low'
                } 
                size="lg"
              />
              <span className="font-bold">{changeDetectionData?.severity || 'LOW'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-600 mb-1">Anomaly Score</p>
            <p className="text-2xl font-bold text-slate-900">
              {changeDetectionData?.anomalyScore ? `${(changeDetectionData.anomalyScore * 100).toFixed(0)}%` : 'N/A'}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {changeDetectionData?.anomalyScore > 0.7 ? 'High anomaly' : 'Normal'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Before/After Comparison */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Satellite Imagery Comparison</CardTitle>
            <div className="flex gap-2 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {viewMode.toUpperCase()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-slate-900 overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            ) : (
              <>
                {/* Before Image */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - comparisonValue[0]}% 0 0)` }}
                >
                  <img 
                    src={satelliteImagery?.rgb?.url || 'https://via.placeholder.com/800x600?text=Before+Image'}
                    alt="Before"
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg">
                    <p className="text-xs font-semibold text-slate-900">BEFORE: {beforeDate}</p>
                  </div>
                </div>

                {/* After Image */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 0 0 ${comparisonValue[0]}%)` }}
                >
                  <img 
                    src={
                      viewMode === 'ndvi' ? satelliteImagery?.ndvi?.url :
                      viewMode === 'false-color' ? satelliteImagery?.falseColor?.url :
                      satelliteImagery?.rgb?.url || 'https://via.placeholder.com/800x600?text=After+Image'
                    }
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg">
                    <p className="text-xs font-semibold text-slate-900">AFTER: {afterDate}</p>
                  </div>
                </div>

                {/* Anomaly Markers */}
                {changeDetectionData?.changeDetected && (
                  <>
                    <div className="absolute top-1/3 right-1/4 h-6 w-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute bottom-1/3 left-1/3 h-6 w-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                  </>
                )}

                {/* Slider Line */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                  style={{ left: `${comparisonValue[0]}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-0.5 h-6 bg-slate-400"></div>
                      <div className="w-0.5 h-6 bg-slate-400"></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Slider Control */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <Slider 
              value={comparisonValue}
              onValueChange={setComparisonValue}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-600">Before ({beforeDate})</span>
              <span className="text-xs text-slate-600">After ({afterDate})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map and Quick Stats */}
      <div className={`grid gap-6 ${selectedLandPlot ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}>
        {/* Satellite Map with Land Plot Highlighting */}
        <div className={selectedLandPlot ? 'lg:col-span-1' : ''}>
          <Card className="border-slate-200 overflow-hidden">
            <CardHeader className="border-b border-slate-200 bg-slate-50 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {selectedLandPlot ? (
                  <>
                    <MapPin className="h-4 w-4 text-red-600" />
                    {selectedIndustry?.companyName} - Land Plot Map
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Plot Location (Satellite View)
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {selectedLandPlot ? (
                <div className="bg-slate-100 border border-slate-300 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  {/* Land Plot Satellite Visualization */}
                  <svg viewBox="0 0 800 600" className="w-full h-full" style={{backgroundColor: '#e8f4f8'}}>
                    {/* Satellite Imagery Background */}
                    <defs>
                      <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d1d5db" strokeWidth="0.5" />
                      </pattern>
                      <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7dd3fc" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid Background */}
                    <rect width="800" height="600" fill="url(#gridPattern)" />
                    
                    {/* Mahanadi River */}
                    <path
                      d="M 0 100 Q 200 120, 400 110 T 800 130"
                      fill="none"
                      stroke="url(#riverGradient)"
                      strokeWidth="25"
                      opacity="0.7"
                    />
                    
                    {/* Road Networks */}
                    <g stroke="#9ca3af" strokeWidth="3" opacity="0.6">
                      <line x1="0" y1="200" x2="800" y2="200" />
                      <line x1="400" y1="0" x2="400" y2="600" />
                    </g>
                    
                    {/* Satellite Terrain Patches */}
                    <rect x="50" y="250" width="150" height="150" fill="#86efac" opacity="0.3" />
                    <rect x="300" y="50" width="200" height="120" fill="#fbbf24" opacity="0.2" />
                    <rect x="600" y="350" width="180" height="180" fill="#93c5fd" opacity="0.2" />
                    
                    {/* Selected Land Plot - HIGHLIGHTED */}
                    {selectedLandPlot.shape.points && (
                      <>
                        {/* Plot Polygon with Bold Highlight */}
                        <polygon
                          points={selectedLandPlot.shape.points}
                          fill={getStatusColor(selectedLandPlot.status)}
                          fillOpacity="0.4"
                          stroke={getStatusColor(selectedLandPlot.status)}
                          strokeWidth="4"
                          className="drop-shadow-lg"
                        />
                        {/* Subtle glow effect */}
                        <polygon
                          points={selectedLandPlot.shape.points}
                          fill="none"
                          stroke={getStatusColor(selectedLandPlot.status)}
                          strokeWidth="8"
                          opacity="0.2"
                        />
                        {/* Plot Number Label */}
                        <text
                          x={calculatePolygonCenter(selectedLandPlot.shape.points).x}
                          y={calculatePolygonCenter(selectedLandPlot.shape.points).y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="font-bold text-sm fill-slate-900 drop-shadow"
                          fontSize="16"
                          fontWeight="bold"
                        >
                          {selectedLandPlot.plotNumber}
                        </text>
                        {/* Industry Icon */}
                        <circle
                          cx={calculatePolygonCenter(selectedLandPlot.shape.points).x}
                          cy={calculatePolygonCenter(selectedLandPlot.shape.points).y - 20}
                          r="18"
                          fill="white"
                          stroke="#000"
                          strokeWidth="2"
                        />
                        <text
                          x={calculatePolygonCenter(selectedLandPlot.shape.points).x}
                          cy={calculatePolygonCenter(selectedLandPlot.shape.points).y - 20}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="18"
                        >
                          {getIndustryIcon(selectedLandPlot.industryType)}
                        </text>
                      </>
                    )}
                  </svg>
                </div>
              ) : (
                <div>
                  <SatelliteMap
                    coordinates={{ latitude: 28.6139, longitude: 77.209 }}
                    plotId={selectedPlot}
                    title="Plot Location (Satellite View)"
                    height="300px"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Land Allotted Search Panel - Only show if no land plot selected */}
        {!selectedLandPlot && (
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPinCheck className="h-4 w-4" />
                Land Allotted
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search industry name, plot #, or ID..."
                      value={landSearchTerm}
                      onChange={(e) => setLandSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50">
                      {searchResults.map((industry) => (
                        <div
                          key={industry.registrationNumber}
                          onClick={() => handleSelectIndustry(industry)}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 text-sm"
                        >
                          <p className="font-semibold text-slate-900">{industry.companyName}</p>
                          <p className="text-xs text-slate-500">{industry.registrationNumber}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 text-center py-4">
                  Search for an industry to view allotted land details and map
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Industry Info Panel - Show when land plot is selected */}
        {selectedLandPlot && selectedIndustry && (
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                  {selectedIndustry.companyName}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedIndustry(null);
                    setSelectedLandPlot(null);
                    setLandSearchTerm('');
                    setSearchResults([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Industry Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">REGISTRATION ID</p>
                    <p className="text-sm font-mono text-slate-900">{selectedIndustry.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">INDUSTRY TYPE</p>
                    <p className="text-sm text-slate-900">{selectedIndustry.industryType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">COMPLIANCE STATUS</p>
                    <Badge className="mt-1 bg-green-500">{selectedIndustry.complianceStatus}</Badge>
                  </div>
                </div>

                {/* Plot Details */}
                <div className="space-y-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">PLOT ID</p>
                    <p className="text-sm font-mono font-bold text-blue-900">{selectedLandPlot.plotNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">ALLOTTED AREA</p>
                    <p className="text-sm text-slate-900">{selectedLandPlot.area} hectares</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">STATUS</p>
                    <Badge className="mt-1 bg-green-500">{selectedLandPlot.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  onClick={() => setShowLandDetails(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Full Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedIndustry(null);
                    setSelectedLandPlot(null);
                    setLandSearchTerm('');
                  }}
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Metadata */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-sm font-semibold">Data Quality</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600 mb-1">Source</p>
                <p className="text-sm font-semibold text-slate-900">Sentinel 2 L2A</p>
              </div>
              <div className="border-t border-slate-200"></div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Confidence</p>
                <p className="text-sm font-semibold text-slate-900">
                  {changeDetectionData?.confidence ? `${(changeDetectionData.confidence * 100).toFixed(0)}%` : 'N/A'}
                </p>
              </div>
              <div className="border-t border-slate-200"></div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Time Period</p>
                <p className="text-sm font-semibold text-slate-900">
                  {changeDetectionData?.timeframe?.daysDifference || 0} days
                </p>
              </div>
              <div className="border-t border-slate-200"></div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Resolution</p>
                <p className="text-sm font-semibold text-slate-900">10m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Analysis Results */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Detailed Spectral Analysis */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-lg font-semibold">Detailed Spectral Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {changeDetectionData?.metrics ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-slate-200 rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-medium">NDVI Change</p>
                      <p className="text-lg font-bold text-slate-900">
                        {(changeDetectionData.metrics.ndviChange * 100).toFixed(2)}%
                      </p>
                      <p className="text-xs text-slate-600">Vegetation Index</p>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-medium">NDBI Change</p>
                      <p className="text-lg font-bold text-slate-900">
                        {(changeDetectionData.metrics.ndbiChange * 100).toFixed(2)}%
                      </p>
                      <p className="text-xs text-slate-600">Built-up Index</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-slate-200 rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-medium">MNDWI Change</p>
                      <p className="text-lg font-bold text-slate-900">
                        {(changeDetectionData.metrics.mndwiChange * 100).toFixed(2)}%
                      </p>
                      <p className="text-xs text-slate-600">Water Index</p>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-medium">EVI Change</p>
                      <p className="text-lg font-bold text-slate-900">
                        {(changeDetectionData.metrics.eviChange * 100).toFixed(2)}%
                      </p>
                      <p className="text-xs text-slate-600">Enhanced Vegetation</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Detection Details</p>
                    <p className="text-sm text-blue-700">{changeDetectionData.description}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                  <p className="text-xsmall text-slate-600 mt-2">Loading analysis...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations & Actions */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-lg font-semibold">Analysis & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {changeDetectionData ? (
                <>
                  {/* Summary Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-900 mb-2">🛰️ Satellite Analysis</p>
                    <p className="text-sm text-slate-700">
                      Data source: Sentinel 2 L2A | Confidence: {(changeDetectionData.confidence * 100).toFixed(0)}%
                    </p>
                  </div>

                  {/* Change Status Box */}
                  {changeDetectionData.changeDetected && (
                    <div className={`border rounded-lg p-4 ${
                      changeDetectionData.severity === 'CRITICAL' 
                        ? 'border-red-200 bg-red-50'
                        : 'border-amber-200 bg-amber-50'
                    }`}>
                      <p className="text-sm font-semibold mb-2">
                        {changeDetectionData.severity === 'CRITICAL' 
                          ? '🚨 Critical Change Detected'
                          : '⚠️ Change Detected'}
                      </p>
                      <p className="text-sm text-slate-700">
                        {changeDetectionData.description}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {changeDetectionData.recommendations && changeDetectionData.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-3">Recommended Actions</p>
                      <div className="space-y-2">
                        {changeDetectionData.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                            <div className="h-6 w-6 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                              {idx + 1}
                            </div>
                            <p className="text-sm text-slate-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Quality */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-900 mb-2">Data Quality</p>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div>✓ Multi-spectral analysis</div>
                      <div>✓ AI-powered change detection</div>
                      <div>✓ Sentinel 2 L2A processed imagery</div>
                      <div>✓ Temporal comparison: {changeDetectionData.timeframe?.daysDifference} days</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                  <p className="text-xs text-slate-600 mt-2">Generating recommendations...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Land Allotted Details Slide-in Panel */}
      {showLandDetails && selectedIndustry && selectedLandPlot && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 transition-opacity"
            onClick={() => setShowLandDetails(false)}
          />

          {/* Slide-in Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPinCheck className="h-5 w-5" />
                Land Allotment Details
              </h2>
              <button
                onClick={() => setShowLandDetails(false)}
                className="text-white hover:bg-blue-500 p-1 rounded-full transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Industry Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">INDUSTRY INFORMATION</h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600">Company Name</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedIndustry.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Registration Number</p>
                    <p className="text-sm font-mono text-slate-900">{selectedIndustry.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Industry Type</p>
                    <p className="text-sm text-slate-900">{selectedIndustry.industryType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Compliance Status</p>
                    <Badge
                      className={`mt-1 ${
                        selectedIndustry.complianceStatus === 'Compliant'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {selectedIndustry.complianceStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Compliance Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${selectedIndustry.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {selectedIndustry.complianceScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plot Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">PLOT INFORMATION</h3>
                <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-xs text-slate-600">Plot ID</p>
                    <p className="text-sm font-mono font-semibold text-blue-900">{selectedLandPlot.plotNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Allotted Area</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedLandPlot.area} hectares ({(selectedLandPlot.area * 10000).toFixed(0)} m²)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Land Purpose</p>
                    <p className="text-sm text-slate-900">Industrial Facility: {selectedLandPlot.industryType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Status</p>
                    <Badge className="mt-1 bg-green-500">{selectedLandPlot.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Environmental & Legal */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">ENVIRONMENTAL & COMPLIANCE</h3>
                <div className="space-y-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div>
                    <p className="text-xs text-slate-600">Environmental Status</p>
                    <Badge className="mt-1 bg-blue-500">{selectedLandPlot.environmentalStatus}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Environmental Clearance Validity</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedIndustry.environmentalClearance?.validUntil || 'Active'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Last Inspection Date</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedIndustry.lastInspection || 'No recent inspection'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">CONTACT INFORMATION</h3>
                <div className="space-y-2 bg-slate-50 p-4 rounded-lg">
                  {selectedIndustry.contacts?.primary && (
                    <div>
                      <p className="text-xs text-slate-600">Primary Contact</p>
                      <p className="text-sm text-slate-900">{selectedIndustry.contacts.primary.name}</p>
                      <p className="text-xs text-slate-500">{selectedIndustry.contacts.primary.phone}</p>
                    </div>
                  )}
                  {selectedIndustry.location && (
                    <div>
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="text-sm text-slate-900">{selectedIndustry.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sticky bottom-0 bg-gradient-to-t from-white pt-4">
                <Button onClick={() => setShowLandDetails(false)} className="w-full bg-blue-600 hover:bg-blue-700">
                  View on Map & Close
                </Button>
                <Button variant="outline" onClick={() => setShowLandDetails(false)} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}