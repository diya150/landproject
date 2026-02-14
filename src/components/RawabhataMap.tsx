import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Navigation, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';

export function RawabhataMap() {
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Rawabhata coordinates and key landmarks
  const rawabhataCenter = { lat: 21.3153, lng: 81.6451 };
  const keyLocations = [
    {
      name: 'Rawabhata Industrial Hub',
      lat: 21.3153,
      lng: 81.6451,
      description: 'Primary industrial zone',
    },
    {
      name: 'Central Processing Zone',
      lat: 21.3165,
      lng: 81.6445,
      description: 'Manufacturing sector',
    },
    {
      name: 'Logistics & Warehouse District',
      lat: 21.3140,
      lng: 81.6460,
      description: 'Storage & distribution',
    },
    {
      name: 'Administrative Complex',
      lat: 21.3160,
      lng: 81.6470,
      description: 'Industrial office area',
    },
  ];

  const MapContent = () => (
    <div className="bg-gradient-to-br from-purple-50 to-amber-50 relative overflow-hidden rounded-lg">
      {/* Map Container - Using embedded map representation */}
      <div
        className="w-full h-96 relative"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 49%, #cbd5e1 49%, #cbd5e1 51%, transparent 51%),
            linear-gradient(0deg, transparent 49%, #cbd5e1 49%, #cbd5e1 51%, transparent 51%)
          `,
          backgroundSize: '50px 50px',
        }}
      >
        {/* Green belt representation */}
        <div
          className="absolute bg-green-300 opacity-30 rounded-full blur-lg"
          style={{
            left: '15%',
            top: '20%',
            width: '100px',
            height: '120px',
          }}
        />

        {/* Road grid */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {/* Major roads - Grid layout */}
          <line
            x1="0"
            y1="30%"
            x2="100%"
            y2="30%"
            stroke="#f97316"
            strokeWidth="3"
            opacity="0.7"
          />
          <line
            x1="0"
            y1="70%"
            x2="100%"
            y2="70%"
            stroke="#f97316"
            strokeWidth="3"
            opacity="0.7"
          />
          <line
            x1="30%"
            y1="0"
            x2="30%"
            y2="100%"
            stroke="#ef4444"
            strokeWidth="2.5"
            opacity="0.6"
          />
          <line
            x1="70%"
            y1="0"
            x2="70%"
            y2="100%"
            stroke="#ef4444"
            strokeWidth="2.5"
            opacity="0.6"
          />

          {/* Grid streets - More organized pattern */}
          {[15, 45, 55, 85].map((x) => (
            <path
              key={`v-${x}`}
              d={`M ${x}% 0 L ${x}% 100%`}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              opacity="0.4"
              strokeDasharray="4,4"
            />
          ))}

          {[15, 45, 55, 85].map((y) => (
            <path
              key={`h-${y}`}
              d={`M 0 ${y}% L 100% ${y}%`}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              opacity="0.4"
              strokeDasharray="4,4"
            />
          ))}

          {/* Railway line */}
          <path
            d="M 0 85% L 100% 85%"
            stroke="#64748b"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
            strokeDasharray="10,5"
          />

          {/* Cardinal directions */}
          <text x="95%" y="8%" fontSize="12" fontWeight="bold" fill="#64748b">
            N
          </text>
        </svg>

        {/* Key Locations */}
        {keyLocations.map((location, idx) => {
          // Calculate position on map (convert lat/lng to percentages)
          // Rough estimation for visualization
          let x = 50;
          let y = 50;
          let color = '#8b5cf6';

          switch (location.name) {
            case 'Rawabhata Industrial Hub':
              x = 50;
              y = 50;
              color = '#8b5cf6';
              break;
            case 'Central Processing Zone':
              x = 45;
              y = 35;
              color = '#ec4899';
              break;
            case 'Logistics & Warehouse District':
              x = 60;
              y = 65;
              color = '#f59e0b';
              break;
            case 'Administrative Complex':
              x = 72;
              y: 42;
              color = '#3b82f6';
              break;
            default:
              break;
          }

          return (
            <div key={idx}>
              {/* Location marker */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform"
                  style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                  title={location.name}
                />
              </div>

              {/* Label */}
              {idx < 3 && (
                <div
                  className="absolute text-xs font-semibold whitespace-nowrap pointer-events-none"
                  style={{
                    left: `${x}%`,
                    top: `${y + 12}%`,
                    transform: 'translateX(-50%)',
                    color: '#1e293b',
                    textShadow: '0 0 4px white',
                  }}
                >
                  {location.name}
                </div>
              )}
            </div>
          );
        })}

        {/* Compass */}
        <div className="absolute bottom-6 right-6 bg-white rounded-lg p-3 shadow-lg">
          <div className="text-center">
            <Navigation className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">21.32°N, 81.65°E</p>
          </div>
        </div>

        {/* Scale indicator */}
        <div className="absolute bottom-6 left-6 bg-white rounded-lg p-3 shadow-lg text-xs">
          <div className="text-slate-600">
            <p className="font-semibold mb-2">Scale</p>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-12 bg-slate-900" />
              <span>2 km</span>
            </div>
          </div>
        </div>

        {/* Urban areas indication */}
        <div className="absolute top-6 left-6 bg-white rounded-lg p-4 shadow-lg max-w-xs">
          <p className="font-semibold text-slate-900 mb-2">Rawabhata Industrial Region</p>
          <p className="text-xs text-slate-600">
            <strong>Strategic Industrial Zone:</strong> A dedicated industrial region with 
            organized grid-style layout featuring 65 land plots designed for modern 
            manufacturing and logistics operations.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              <strong>Key Features:</strong>
            </p>
            <ul className="text-xs text-slate-600 mt-1 space-y-1">
              <li>• 65 geometrically planned plots (4.2 km²)</li>
              <li>• Grid-style layout for efficiency</li>
              <li>• Modern road and rail connectivity</li>
              <li>• Integrated logistics infrastructure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {!showFullscreen && (
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Rawabhata Geographic Overview
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowFullscreen(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <MapContent />
          </CardContent>
        </Card>
      )}

      {/* Fullscreen modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <Card className="border-slate-200 w-full h-full max-w-6xl">
            <CardHeader className="border-b border-slate-200 bg-slate-50 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <MapPin className="h-6 w-6 text-purple-600" />
                Rawabhata - Detailed Geographic Map
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFullscreen(false)}
              >
                Close
              </Button>
            </CardHeader>
            <CardContent className="p-6 h-96">
              <MapContent />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default RawabhataMap;
