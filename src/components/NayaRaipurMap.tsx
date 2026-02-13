import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Navigation, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';

export function NayaRaipurMap() {
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Naya Raipur coordinates and key landmarks
  const nayaRaipurCenter = { lat: 20.1920, lng: 81.7196 };
  const keyLocations = [
    {
      name: 'Naya Raipur Administrative Center',
      lat: 20.1850,
      lng: 81.7100,
      description: 'Capital Assembly',
    },
    {
      name: 'Mahanadi River',
      lat: 20.165,
      lng: 81.745,
      description: 'Major water body',
    },
    {
      name: 'Industrial Zone (North)',
      lat: 20.2100,
      lng: 81.7200,
      description: 'Manufacturing sector',
    },
    {
      name: 'Raipur Junction',
      lat: 21.1694,
      lng: 81.6298,
      description: 'Old Raipur city',
    },
  ];

  const MapContent = () => (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden rounded-lg">
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
        {/* Water bodies representation */}
        <div
          className="absolute bg-blue-300 opacity-40 rounded-full blur-lg"
          style={{
            left: '75%',
            top: '30%',
            width: '80px',
            height: '200px',
          }}
        />

        {/* Road grid */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {/* Major roads */}
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="#f97316"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="40%"
            y1="0"
            x2="40%"
            y2="100%"
            stroke="#f97316"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="80%"
            y1="0"
            x2="80%"
            y2="100%"
            stroke="#3b82f6"
            strokeWidth="3"
            opacity="0.5"
          />

          {/* Grid streets */}
          {[20, 60].map((x) => (
            <path
              key={`v-${x}`}
              d={`M ${x}% 0 L ${x}% 100%`}
              stroke="#cbd5e1"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="5,5"
            />
          ))}

          {[25, 75].map((y) => (
            <path
              key={`h-${y}`}
              d={`M 0 ${y}% L 100% ${y}%`}
              stroke="#cbd5e1"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="5,5"
            />
          ))}

          {/* River */}
          <path
            d="M 80% 10% Q 82% 30% 81% 50% Q 79% 70% 82% 100%"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
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
          let color = '#3b82f6';

          switch (location.name) {
            case 'Naya Raipur Administrative Center':
              x = 35;
              y = 40;
              color = '#6366f1';
              break;
            case 'Mahanadi River':
              x = 82;
              y = 45;
              color = '#0ea5e9';
              break;
            case 'Industrial Zone (North)':
              x = 45;
              y = 25;
              color = '#ef4444';
              break;
            case 'Raipur Junction':
              x = 30;
              y: 85;
              color = '#f59e0b';
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
            <Navigation className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">20.19°N, 81.72°E</p>
          </div>
        </div>

        {/* Scale indicator */}
        <div className="absolute bottom-6 left-6 bg-white rounded-lg p-3 shadow-lg text-xs">
          <div className="text-slate-600">
            <p className="font-semibold mb-2">Scale</p>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-12 bg-slate-900" />
              <span>5 km</span>
            </div>
          </div>
        </div>

        {/* Urban areas indication */}
        <div className="absolute top-6 left-6 bg-white rounded-lg p-4 shadow-lg max-w-xs">
          <p className="font-semibold text-slate-900 mb-2">Naya Raipur</p>
          <p className="text-xs text-slate-600">
            <strong>Planned Capital City:</strong> Designed and developed as the new capital
            of Chhattisgarh with modern infrastructure and strategic industrial zones.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              <strong>Key Features:</strong>
            </p>
            <ul className="text-xs text-slate-600 mt-1 space-y-1">
              <li>• Strategic location near Raipur</li>
              <li>• Well-developed industrial zones</li>
              <li>• Proximity to Mahanadi River</li>
              <li>• Modern road and rail connectivity</li>
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
                <MapPin className="h-5 w-5 text-blue-600" />
                Naya Raipur Geographic Overview
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
                <MapPin className="h-6 w-6 text-blue-600" />
                Naya Raipur - Detailed Geographic Map
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

export default NayaRaipurMap;
