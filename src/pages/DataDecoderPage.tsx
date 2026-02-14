import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { EncodedDataDecoder } from '../components/EncodedDataDecoder';

export function DataDecoder() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Encoded Data Decoder</h1>
          <p className="mt-3 text-gray-600 text-lg">
            Decode encoded land datasets and visualize them on interactive maps
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1">
              <p>✓ Base64 encoding</p>
              <p>✓ Hexadecimal (Hex)</p>
              <p>✓ URL encoding</p>
              <p>✓ JSON objects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Features</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1">
              <p>✓ Auto-detect format</p>
              <p>✓ Multi-region support</p>
              <p>✓ Interactive maps</p>
              <p>✓ Data export</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Data Types</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1">
              <p>✓ Plot coordinates</p>
              <p>✓ Land boundaries</p>
              <p>✓ Regional data</p>
              <p>✓ Custom attributes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Decoder */}
        <EncodedDataDecoder />

        {/* Usage Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 1: Provide Encoded Data</h3>
              <p>Paste your encoded data directly or upload a file containing the encoded content.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 2: Decode</h3>
              <p>Click the "Decode Data" button. The system will auto-detect the encoding format (Base64, Hex, or URL).</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 3: Visualize</h3>
              <p>View the decoded data and select regions to visualize plot maps with geographical coordinates.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 4: Export</h3>
              <p>Download the decoded data as JSON or copy it to your clipboard for further use.</p>
            </div>
          </CardContent>
        </Card>

        {/* Example Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Example Encoded Data Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">Here's what decoded land data should look like:</p>
            <div className="bg-gray-900 rounded p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
{`{
  "plots": [
    {
      "id": 1,
      "name": "Plot A",
      "region": "Region Name",
      "coordinates": [[lat, lng], [lat, lng], ...],
      "area": 2500,
      "owner": "Owner Name",
      "status": "active"
    }
  ]
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
