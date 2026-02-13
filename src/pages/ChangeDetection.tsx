import { useState, useEffect } from 'react';
import { AlertTriangle, Maximize2, Download, Calendar, Loader2, MapPin, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { SeverityBadge } from '../components/dashboard/SeverityBadge';
import { SatelliteMap } from '../components/dashboard/SatelliteMap';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

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
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Satellite Map - Left Column */}
        <div className="lg:col-span-1">
          <SatelliteMap
            coordinates={{ latitude: 20.1920, longitude: 81.7196 }}
            plotId={selectedPlot}
            title="Plot Location (Satellite View)"
            height="300px"
          />
        </div>

        {/* Quick Reference Stats - Right Columns */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-sm font-semibold">Spectral Indices</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {changeDetectionData?.metrics ? (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">NDVI</span>
                    <span className="font-semibold text-slate-900">
                      {(changeDetectionData.metrics.ndviChange * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="border-t border-slate-200"></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">NDBI</span>
                    <span className="font-semibold text-slate-900">
                      {(changeDetectionData.metrics.ndbiChange * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="border-t border-slate-200"></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">MNDWI</span>
                    <span className="font-semibold text-slate-900">
                      {(changeDetectionData.metrics.mndwiChange * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="border-t border-slate-200"></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">EVI</span>
                    <span className="font-semibold text-slate-900">
                      {(changeDetectionData.metrics.eviChange * 100).toFixed(1)}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
}