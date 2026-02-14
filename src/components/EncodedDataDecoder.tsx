import React, { useState, useRef } from 'react';
import { Upload, RotateCcw, Download, Map as MapIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { DataDecoder, LandDataParser, MapGenerator, useDecodedMapStore } from '../services/dataDecoder';
import { SatelliteMap } from './dashboard/SatelliteMap';

export function EncodedDataDecoder() {
  const [encodedInput, setEncodedInput] = useState('');
  const [decodingFormat, setDecodingFormat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    encodedData,
    decodedData,
    regions,
    plots,
    bounds,
    center,
    selectedRegion,
    setEncodedData,
    decodeData,
    selectRegion
  } = useDecodedMapStore();

  const handleDecode = () => {
    setError(null);
    if (!encodedInput.trim()) {
      setError('Please enter encoded data');
      return;
    }

    const result = decodeData(encodedInput);
    if (result.success) {
      setDecodingFormat(result.format || 'unknown');
    } else {
      setError('Failed to decode data. Please check the format.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEncodedInput(content);
    };
    reader.readAsText(file);
  };

  const handleCopyToClipboard = () => {
    if (decodedData) {
      navigator.clipboard.writeText(JSON.stringify(decodedData, null, 2));
    }
  };

  const handleDownload = () => {
    if (decodedData) {
      const dataStr = JSON.stringify(decodedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'decoded-land-data.json';
      link.click();
    }
  };

  const regionArray = Object.entries(regions);
  const currentRegionPlots = selectedRegion ? regions[selectedRegion] || [] : plots;
  const polygons = MapGenerator.generatePolygons(currentRegionPlots);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Encoded Data Decoder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Paste Encoded Data (Base64, Hex, or URL)
            </label>
            <textarea
              value={encodedInput}
              onChange={(e) => setEncodedInput(e.target.value)}
              placeholder="Paste your encoded data here..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDecode}
              disabled={!encodedInput.trim()}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              🔓 Decode Data
            </Button>
            <Button
              onClick={() => {
                setEncodedInput('');
                setDecodingFormat(null);
                setError(null);
              }}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Load File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          {decodingFormat && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✓ Successfully decoded using {decodingFormat.toUpperCase()} format
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {decodedData && (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Decoding Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-blue-600 mb-1">Total Plots</p>
                  <p className="text-2xl font-bold text-blue-900">{plots.length}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-xs text-purple-600 mb-1">Regions Found</p>
                  <p className="text-2xl font-bold text-purple-900">{Object.keys(regions).length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-green-600 mb-1">Decoding Format</p>
                  <p className="text-lg font-bold text-green-900">{decodingFormat?.toUpperCase()}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded">
                  <p className="text-xs text-orange-600 mb-1">Center Point</p>
                  <p className="text-xs font-mono text-orange-900">
                    {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Region Selection */}
          {Object.keys(regions).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Regions ({Object.keys(regions).length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    onClick={() => selectRegion('')}
                    className={`${
                      !selectedRegion
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    All Regions ({plots.length} plots)
                  </Button>
                  {regionArray.map(item => {
                    const [region, regionPlots] = item as [string, any[]];
                    return (
                    <Button
                      key={region}
                      onClick={() => selectRegion(region)}
                      className={`${
                        selectedRegion === region
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {region} ({Array.isArray(regionPlots) ? regionPlots.length : 1})
                    </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map Visualization */}
          {currentRegionPlots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5" />
                  {selectedRegion ? `${selectedRegion} Map` : 'All Regions Map'} - {currentRegionPlots.length} Plots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SatelliteMap
                  title={selectedRegion ? `${selectedRegion} Plotted Map` : 'All Regions'}
                  coordinates={{ latitude: center.lat, longitude: center.lng }}
                  zoom={14}
                  bounds={MapGenerator.generateBounds(currentRegionPlots)}
                  polygons={polygons}
                  industryName={selectedRegion || 'Decoded Land Data'}
                />
              </CardContent>
            </Card>
          )}

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle>Export Decoded Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download as JSON
              </Button>
              <Button
                onClick={handleCopyToClipboard}
                className="w-full bg-slate-600 text-white hover:bg-slate-700"
              >
                📋 Copy to Clipboard
              </Button>
            </CardContent>
          </Card>

          {/* Raw Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Raw Decoded Data (Preview)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded p-4 overflow-x-auto max-h-96 overflow-y-auto">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                  {JSON.stringify(decodedData, null, 2).substring(0, 2000)}
                  {JSON.stringify(decodedData).length > 2000 && '\n... (truncated)'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
