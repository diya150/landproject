import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MapPin, Building2, TrendingUp, AlertCircle } from 'lucide-react';
import PlotMonitoringMap from '../components/PlotMonitoringMap';
import NayaRaipurMap from '../components/NayaRaipurMap';
import RawabhataMap from '../components/RawabhataMap';
import { IndustriesRegistry } from './IndustriesRegistry';
import { industriesData } from '../lib/industries-data';
import { plotsData, getPlotsStatistics } from '../lib/plots-data';

export function LandMonitoringDashboard() {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('monitor');

  const stats = getPlotsStatistics();

  const handleIndustrySelect = useCallback((industryId: string) => {
    setSelectedIndustryId(industryId);
    // Switch to monitoring tab to show the map with highlighted plot
    setActiveTab('monitor');
  }, []);

  const handlePlotSelect = useCallback((plotId: string) => {
    setSelectedPlotId(plotId);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">
          Industrial Land Monitoring System
        </h1>
        <p className="text-lg text-slate-600">
          Integrated geospatial monitoring and compliance tracking for industrial land plots in Naya Raipur, Chhattisgarh
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-slate-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 mb-1">Active Industrial</p>
                <p className="text-3xl font-bold text-red-600">{stats.active}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 mb-1">Compliant</p>
                <p className="text-3xl font-bold text-green-600">
                  {industriesData.filter(i => i.complianceStatus === 'Compliant').length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 mb-1">Vacant</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.vacant}</p>
              </div>
              <MapPin className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 mb-1">Unusable</p>
                <p className="text-3xl font-bold text-orange-600">{stats.unusable}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 mb-1">Disputed</p>
                <p className="text-3xl font-bold text-purple-600">{stats.disputed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <CardTitle className="text-lg font-semibold">
            Integrated Monitoring &amp; Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-slate-200 bg-slate-100 p-0">
              <TabsTrigger value="monitor">
                <MapPin className="h-4 w-4 mr-2" />
                Plot Monitoring Map
              </TabsTrigger>
              <TabsTrigger value="registry">
                <Building2 className="h-4 w-4 mr-2" />
                Industries Registry
              </TabsTrigger>
              <TabsTrigger value="geography">
                <MapPin className="h-4 w-4 mr-2" />
                Geographic Overview
              </TabsTrigger>
            </TabsList>

            {/* Plot Monitoring Map Tab */}
            <TabsContent value="monitor" className="p-6">
              <div className="space-y-4">
                {selectedIndustryId && (
                  <Card className="border-emerald-200 bg-emerald-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-slate-700">
                        <strong>Selected Industry:</strong> {
                          industriesData.find(i => i.id === selectedIndustryId)?.companyName
                        }
                      </p>
                      <button
                        onClick={() => setSelectedIndustryId(null)}
                        className="text-xs text-emerald-600 hover:text-emerald-800 mt-2"
                      >
                        Clear selection
                      </button>
                    </CardContent>
                  </Card>
                )}
                <PlotMonitoringMap
                  selectedIndustryId={selectedIndustryId || undefined}
                  onPlotSelect={handlePlotSelect}
                  onIndustrySelect={handleIndustrySelect}
                />
              </div>
            </TabsContent>

            {/* Industries Registry Tab */}
            <TabsContent value="registry" className="p-6">
              <IndustriesRegistry onIndustrySelect={handleIndustrySelect} />
            </TabsContent>

            {/* Geographic Overview Tab */}
            <TabsContent value="geography" className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Geographic Context - Industrial Regions
                  </h2>
                  
                  {/* Naya Raipur Region */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-700 mb-3">Naya Raipur Area</h3>
                    <NayaRaipurMap />
                  </div>
                  
                  {/* Rawabhata Region */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-3">Rawabhata Area</h3>
                    <RawabhataMap />
                  </div>
                </div>

                {/* Land Statistics */}
                <Card className="border-slate-200">
                  <CardHeader className="border-b border-slate-200 bg-slate-50">
                    <CardTitle className="text-lg font-semibold">Land Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Total Land Area</p>
                        <p className="text-3xl font-bold text-slate-900">
                          {(stats.totalArea / 1000).toFixed(1)}k m²
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          ({(stats.totalArea / 10000).toFixed(2)} hectares)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Average Compliance Score</p>
                        <p className="text-3xl font-bold text-emerald-600">
                          {stats.averageComplianceScore}%
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Across {industriesData.filter(i => i.complianceStatus === 'Compliant').length} compliant industries
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Total Industries</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {industriesData.length}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Active in {[...new Set(industriesData.map(i => i.district))].length} districts
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Plot Status Breakdown */}
                <Card className="border-slate-200">
                  <CardHeader className="border-b border-slate-200 bg-slate-50">
                    <CardTitle className="text-lg font-semibold">Plot Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-2xl font-bold text-red-600 mb-1">{stats.active}</p>
                        <p className="text-xs text-slate-600">Active Industrial</p>
                        <p className="text-xs text-slate-500 mt-1">Red color</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-2xl font-bold text-gray-600 mb-1">{stats.vacant}</p>
                        <p className="text-xs text-slate-600">Vacant</p>
                        <p className="text-xs text-slate-500 mt-1">Grey color</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-2xl font-bold text-orange-600 mb-1">{stats.unusable}</p>
                        <p className="text-xs text-slate-600">Unusable</p>
                        <p className="text-xs text-slate-500 mt-1">Orange color</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-2xl font-bold text-yellow-600 mb-1">{stats.disputed}</p>
                        <p className="text-xs text-slate-600">Disputed</p>
                        <p className="text-xs text-slate-500 mt-1">Yellow color</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Help & Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900">
            Using the Industrial Land Monitoring System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-sm text-blue-900 space-y-3">
          <div>
            <strong>📍 Plot Monitoring Map:</strong> View all 16 land parcels with color-coded status. Click any plot to see details like assigned industry, compliance score, environmental status, and infrastructure access.
          </div>
          <div>
            <strong>🏢 Industries Registry:</strong> Browse all 10 registered industries with complete details. Click "View on Map" to highlight that industry's assigned land plot on the monitoring map.
          </div>
          <div>
            <strong>🗺️ Geographic Overview:</strong> Explore the broader Naya Raipur region showing key landmarks, road networks, and the Mahanadi River proximity for context.
          </div>
          <div>
            <strong>Color Coding:</strong> Red (Active Industrial) | Grey (Vacant) | Orange (Unusable - Environmental Constraints) | Yellow (Disputed - Legal Issues)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Export as default for router
export default LandMonitoringDashboard;
