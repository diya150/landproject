import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import PlotMonitoringMap from '../components/PlotMonitoringMap';
import NayaRaipurMap from '../components/NayaRaipurMap';
import RawabhataMap from '../components/RawabhataMap';

export function Plots() {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Plot Monitoring Dashboard</h1>
        <p className="text-slate-600">
          Interactive GIS-style visualization of all land plots with real-time compliance tracking
        </p>
      </div>

      {/* Main Plot Monitoring Map */}
      <PlotMonitoringMap
        selectedIndustryId={selectedIndustryId || undefined}
        onPlotSelect={(plotId) => console.log('Selected plot:', plotId)}
        onIndustrySelect={(industryId) => setSelectedIndustryId(industryId)}
      />

      {/* Geographic Overview - Multiple Regions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Geographic Context</h2>
        
        {/* Naya Raipur */}
        <NayaRaipurMap />
        
        {/* Rawabhata */}
        <RawabhataMap />
      </div>

      {/* Information Panel */}
      <Card className="border-slate-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">How to Use This Dashboard</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• <strong>Click on any plot</strong> to view detailed information including compliance status, area, and assigned industry</li>
                <li>• <strong>Hover over plots</strong> to see quick tooltips with essential data</li>
                <li>• <strong>Color coding:</strong> Red = Active Industrial, Grey = Vacant, Orange = Unusable, Yellow = Disputed</li>
                <li>• <strong>From Industries Registry:</strong> Click "View on Map" to highlight that industry's assigned plot</li>
                <li>• <strong>Environmental Indicators:</strong> Check soil quality, water access, and river proximity for each plot</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}