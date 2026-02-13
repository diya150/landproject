import React, { useState, useMemo } from 'react';
import { MapPin, AlertCircle, CheckCircle, HelpCircle, Clock, Zap, Leaf, Factory, Pill, Cpu, Shirt, UtensilsCrossed, Code, Zap as Battery, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { plotsData, getPlotByIndustryId, RIVER_COORDINATES } from '../lib/plots-data';
import { industriesData } from '../lib/industries-data';

interface PlotMonitoringMapProps {
  selectedIndustryId?: string;
  onPlotSelect?: (plotId: string) => void;
  onIndustrySelect?: (industryId: string) => void;
}

const statusColors = {
  active: '#dc2626', // Red for active industrial use
  vacant: '#d1d5db', // Light grey for vacant
  unusable: '#f59e0b', // Orange for environmental constraints
  disputed: '#eab308', // Yellow for disputed
};

const environmentalColors = {
  'Green': '#22c55e',
  'Yellow': '#eab308',
  'Amber': '#f97316',
  'Red': '#dc2626',
};

// Industry type to icon mapping for 2D visualization
const industryIconMap: Record<string, string> = {
  'Steel Manufacturing': '🏭',
  'Pharmaceuticals': '💊',
  'Electronics': '💻',
  'Textiles': '👔',
  'Food Processing': '🍱',
  'IT Services': '⚙️',
  'Chemical Manufacturing': '⚗️',
  'Automotive': '🚗',
  'Renewable Energy': '⚡',
  'Manufacturing': '🔧',
  'Default': '🏭',
};

export function PlotMonitoringMap({
  selectedIndustryId,
  onPlotSelect,
  onIndustrySelect,
}: PlotMonitoringMapProps) {
  const [hoveredPlot, setHoveredPlot] = useState<string | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);

  const selectedPlotData = useMemo(() => {
    if (selectedIndustryId) {
      return getPlotByIndustryId(selectedIndustryId);
    }
    return selectedPlot ? plotsData.find(p => p.id === selectedPlot) : null;
  }, [selectedIndustryId, selectedPlot]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Active Industrial Use',
      vacant: 'Vacant - Available',
      unusable: 'Unusable - Environmental Constraints',
      disputed: 'Disputed - Legal Conflict',
    };
    return labels[status] || status;
  };

  const getIndustryIcon = (industryType?: string) => {
    if (!industryType) return industryIconMap['Default'];
    return industryIconMap[industryType] || industryIconMap['Default'];
  };

  const getComplianceBadge = (status?: string, score?: number) => {
    if (!status) return null;
    
    const colors: Record<string, string> = {
      'Compliant': 'bg-green-100 text-green-800',
      'Violation': 'bg-red-100 text-red-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Pending': 'bg-blue-100 text-blue-800',
    };

    return (
      <div className="flex items-center gap-2">
        <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
          {status}
        </Badge>
        {score && (
          <span className="text-sm font-semibold">Score: {score}/100</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 overflow-hidden">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Naya Raipur Industrial Land Parcels - 2D Geographic View
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gradient-to-b from-amber-50 to-green-50 overflow-auto">
                {/* SVG Canvas - Real Map Background */}
                <svg
                  viewBox="0 0 800 600"
                  className="w-full h-auto min-h-[600px]"
                  style={{ backgroundColor: '#e8dcc8' }}
                >
                  {/* Land/Ground base */}
                  <rect width="800" height="600" fill="#d2b48c" opacity="0.3" />
                  
                  {/* Satellite map simulation - terrain patches */}
                  <g opacity="0.15">
                    <rect x="0" y="0" width="200" height="300" fill="#8b7355" />
                    <rect x="250" y="50" width="300" height="400" fill="#9a8b72" />
                    <rect x="600" y="100" width="200" height="500" fill="#a89968" />
                    <rect x="0" y="350" width="500" height="250" fill="#b8a878" />
                  </g>

                  {/* Mahanadi River - left side */}
                  <defs>
                    <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%">
                      <stop offset="0%" style={{ stopColor: '#4b7ba7', stopOpacity: 0.7 }} />
                      <stop offset="100%" style={{ stopColor: '#2d5a8c', stopOpacity: 0.5 }} />
                    </linearGradient>
                  </defs>
                  
                  <path
                    d="M 10,0 Q 30,100 20,200 Q 25,300 15,400 Q 35,500 20,600"
                    stroke="url(#riverGradient)"
                    strokeWidth="35"
                    fill="none"
                    opacity="0.8"
                  />
                  <text x="50" y="300" fontSize="14" fill="#1e40af" fontWeight="bold" opacity="0.8">
                    Mahanadi River
                  </text>

                  {/* Road network - primary roads */}
                  <g stroke="#e8e8e8" strokeWidth="8" opacity="0.6">
                    {/* Vertical roads */}
                    <line x1="120" y1="0" x2="120" y2="600" /> {/* Left main road */}
                    <line x1="250" y1="0" x2="250" y2="600" /> {/* Central road 1 */}
                    <line x1="380" y1="0" x2="380" y2="600" /> {/* Central road 2 */}
                    <line x1="530" y1="0" x2="530" y2="600" /> {/* East road */}
                    
                    {/* Horizontal roads */}
                    <line x1="0" y1="140" x2="800" y2="140" /> {/* Top road */}
                    <line x1="0" y1="280" x2="800" y2="280" /> {/* Middle road */}
                    <line x1="0" y1="420" x2="800" y2="420" /> {/* Bottom road */}
                  </g>

                  {/* Secondary road network - dashed */}
                  <g stroke="#d0d0d0" strokeWidth="4" opacity="0.4" strokeDasharray="5,5">
                    <line x1="60" y1="0" x2="60" y2="600" />
                    <line x1="180" y1="0" x2="180" y2="600" />
                    <line x1="320" y1="0" x2="320" y2="600" />
                    <line x1="450" y1="0" x2="450" y2="600" />
                    <line x1="600" y1="0" x2="600" y2="600" />
                    <line x1="0" y1="70" x2="800" y2="70" />
                    <line x1="0" y1="210" x2="800" y2="210" />
                    <line x1="0" y1="350" x2="800" y2="350" />
                    <line x1="0" y1="490" x2="800" y2="490" />
                  </g>

                  {/* Plot polygons on real map coordinates */}
                  {plotsData.map((plot) => {
                    const isSelected =
                      selectedPlotData?.id === plot.id ||
                      (selectedIndustryId && plot.assignedIndustryId === selectedIndustryId);
                    const isHovered = hoveredPlot === plot.id;

                    return (
                      <g key={plot.id}>
                        {/* Plot polygon with realistic positioning */}
                        {plot.shape.type === 'polygon' && plot.shape.points ? (
                          <polygon
                            points={plot.shape.points}
                            fill={statusColors[plot.status]}
                            opacity={isHovered || isSelected ? 0.9 : 0.75}
                            stroke={isSelected ? '#000' : '#555'}
                            strokeWidth={isSelected ? 3 : 2}
                            className="cursor-pointer transition-all hover:filter hover:brightness-110"
                            onClick={() => {
                              setSelectedPlot(plot.id);
                              onPlotSelect?.(plot.id);
                            }}
                            onMouseEnter={() => setHoveredPlot(plot.id)}
                            onMouseLeave={() => setHoveredPlot(null)}
                            style={{ filter: isHovered ? 'brightness(1.15)' : 'none' }}
                          />
                        ) : (
                          <rect
                            x={plot.shape.x}
                            y={plot.shape.y}
                            width={plot.shape.width}
                            height={plot.shape.height}
                            fill={statusColors[plot.status]}
                            opacity={isHovered || isSelected ? 0.9 : 0.75}
                            stroke={isSelected ? '#000' : '#555'}
                            strokeWidth={isSelected ? 3 : 2}
                            rx="2"
                            className="cursor-pointer transition-all hover:filter hover:brightness-110"
                            onClick={() => {
                              setSelectedPlot(plot.id);
                              onPlotSelect?.(plot.id);
                            }}
                            onMouseEnter={() => setHoveredPlot(plot.id)}
                            onMouseLeave={() => setHoveredPlot(null)}
                            style={{ filter: isHovered ? 'brightness(1.15)' : 'none' }}
                          />
                        )}

                        {/* 2D Industry Icon - Rendered on active plots */}
                        {plot.status === 'active' && plot.assignedIndustryId && (
                          <g>
                            {/* Icon background circle */}
                            <circle
                              cx={plot.shape.points ? 
                                // Calculate center from polygon points
                                (Number(plot.shape.points.split(' ')[0].split(',')[0]) + 
                                 Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 :
                                (plot.shape.x || 0) + (plot.shape.width || 0) / 2
                              }
                              cy={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[1]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[1])) / 2 :
                                (plot.shape.y || 0) + (plot.shape.height || 0) / 2
                              }
                              r="14"
                              fill="#fff"
                              stroke="#000"
                              strokeWidth="2"
                            />
                            {/* Industry Icon Text */}
                            <text
                              x={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[0]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 :
                                (plot.shape.x || 0) + (plot.shape.width || 0) / 2
                              }
                              y={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[1]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[1])) / 2 + 5 :
                                (plot.shape.y || 0) + (plot.shape.height || 0) / 2 + 5
                              }
                              textAnchor="middle"
                              fontSize="18"
                              pointerEvents="none"
                            >
                              {getIndustryIcon(plot.industryType)}
                            </text>
                          </g>
                        )}

                        {/* Plot ID label */}
                        <text
                          x={plot.shape.points ?
                            (Number(plot.shape.points.split(' ')[0].split(',')[0]) +
                             Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 :
                            (plot.shape.x || 0) + (plot.shape.width || 0) / 2
                          }
                          y={plot.shape.points ?
                            (Number(plot.shape.points.split(' ')[0].split(',')[1]) +
                             Number(plot.shape.points.split(' ')[2].split(',')[1])) / 2 - 30 :
                            (plot.shape.y || 0) + (plot.shape.height || 0) / 2 - 30
                          }
                          textAnchor="middle"
                          fontSize={isSelected ? '13' : isHovered ? '12' : '11'}
                          fontWeight={isSelected ? 'bold' : '600'}
                          fill="#000"
                          pointerEvents="none"
                        >
                          {plot.id}
                        </text>

                        {/* Violation indicator badge */}
                        {plot.status === 'active' && plot.complianceStatus === 'Violation' && (
                          <circle
                            cx={plot.shape.points ?
                              (Number(plot.shape.points.split(' ')[1].split(',')[0]) +
                               Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 :
                              (plot.shape.x || 0) + (plot.shape.width || 0) - 5
                            }
                            cy={plot.shape.points ?
                              (Number(plot.shape.points.split(' ')[1].split(',')[1]) +
                               Number(plot.shape.points.split(' ')[0].split(',')[1])) / 2 :
                              (plot.shape.y || 0) + 5
                            }
                            r="8"
                            fill="#dc2626"
                            stroke="#fff"
                            strokeWidth="2"
                          />
                        )}

                        {/* Hover tooltip */}
                        {isHovered && (
                          <g>
                            <rect
                              x={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[0]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 + 15 :
                                (plot.shape.x || 0) + (plot.shape.width || 0) + 10
                              }
                              y={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[1]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[1])) / 2 - 45 :
                                (plot.shape.y || 0)
                              }
                              width="200"
                              height="90"
                              fill="#fff"
                              stroke="#333"
                              strokeWidth="1"
                              rx="4"
                              opacity="0.95"
                            />
                            <text
                              x={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[0]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 + 20 :
                                (plot.shape.x || 0) + (plot.shape.width || 0) + 15
                              }
                              y={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[1]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[1])) / 2 - 30 :
                                (plot.shape.y || 0) + 15
                              }
                              fontSize="11"
                              fontWeight="bold"
                              fill="#000"
                            >
                              {plot.plotNumber}
                            </text>
                            <text
                              x={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[0]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 + 20 :
                                (plot.shape.x || 0) + (plot.shape.width || 0) + 15
                              }
                              y={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[1]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[1])) / 2 - 15 :
                                (plot.shape.y || 0) + 30
                              }
                              fontSize="10"
                              fill="#333"
                            >
                              Area: {(plot.area / 1000).toFixed(1)}k m²
                            </text>
                            <text
                              x={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[0]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 + 20 :
                                (plot.shape.x || 0) + (plot.shape.width || 0) + 15
                              }
                              y={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[1]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[1])) / 2 : 
                                (plot.shape.y || 0) + 45
                              }
                              fontSize="10"
                              fill="#333"
                            >
                              {getStatusLabel(plot.status).substring(0, 25)}
                            </text>
                            <text
                              x={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[0]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[0])) / 2 + 20 :
                                (plot.shape.x || 0) + (plot.shape.width || 0) + 15
                              }
                              y={plot.shape.points ?
                                (Number(plot.shape.points.split(' ')[0].split(',')[1]) +
                                 Number(plot.shape.points.split(' ')[2].split(',')[1])) / 2 + 15 :
                                (plot.shape.y || 0) + 60
                              }
                              fontSize="9"
                              fill="#666"
                            >
                              {plot.assignedIndustryName ? 
                                plot.assignedIndustryName.substring(0, 20) + '...' : 'Unassigned'}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel - Selected Plot Details */}
        <div className="lg:col-span-1 space-y-4">
          {selectedPlotData ? (
            <>
              {/* Plot Card */}
              <Card className="border-slate-200 sticky top-6">
                <CardHeader className="border-b border-slate-200 bg-slate-50">
                  <CardTitle className="text-lg font-semibold">
                    {selectedPlotData.plotNumber}
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    {getStatusLabel(selectedPlotData.status)}
                  </p>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Area */}
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                      Area
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedPlotData.area.toLocaleString()} m² ({(selectedPlotData.area / 1000).toFixed(2)} hectares)
                    </p>
                  </div>

                  {/* Status Badge */}
                  {selectedPlotData.status === 'active' && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                        Compliance
                      </p>
                      {getComplianceBadge(
                        selectedPlotData.complianceStatus,
                        selectedPlotData.complianceScore
                      )}
                    </div>
                  )}

                  {/* Industry Information */}
                  {selectedPlotData.assignedIndustryId && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                        Assigned Industry
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedPlotData.assignedIndustryName}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => onIndustrySelect?.(selectedPlotData.assignedIndustryId!)}
                      >
                        View Industry Details
                      </Button>
                    </div>
                  )}

                  {/* Environmental Status */}
                  {selectedPlotData.status !== 'vacant' && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                        Environmental Status
                      </p>
                      <Badge
                        style={{
                          backgroundColor: environmentalColors[selectedPlotData.environmentalStatus || 'Green'],
                          color: '#fff',
                        }}
                      >
                        {selectedPlotData.environmentalStatus || 'Green'}
                      </Badge>
                    </div>
                  )}

                  {/* Utilities */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase">
                      Utilities & Access
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        Water Access: {selectedPlotData.waterAccess ? 'Yes' : 'No'}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        River: {selectedPlotData.riverProximity}
                      </p>
                      <p className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        Soil: {selectedPlotData.soilQuality}
                      </p>
                    </div>
                  </div>

                  {/* Constraints */}
                  {selectedPlotData.constraints && selectedPlotData.constraints.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Constraints
                      </p>
                      <ul className="space-y-1 text-sm">
                        {selectedPlotData.constraints.map((constraint, i) => (
                          <li key={i} className="text-slate-600 flex gap-2">
                            <span className="text-red-500">•</span>
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Last Inspection */}
                  {selectedPlotData.lastInspectionDate && (
                    <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Last Inspection: {new Date(selectedPlotData.lastInspectionDate).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-slate-200">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">
                  Click on any plot to view details
                </p>
              </CardContent>
            </Card>
          )}

          {/* Statistics Panel */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-sm font-semibold">Plot Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Active Industrial:</span>
                <span className="font-semibold text-red-600">10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vacant:</span>
                <span className="font-semibold text-gray-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Unusable:</span>
                <span className="font-semibold text-orange-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Disputed:</span>
                <span className="font-semibold text-yellow-600">1</span>
              </div>
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total Area:</span>
                  <span>176.5k m²</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PlotMonitoringMap;
