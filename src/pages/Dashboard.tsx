import { Building2, CheckCircle, AlertTriangle, MapPin, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { useState } from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatusBadge } from '../components/dashboard/StatusBadge';
import { RegisterCompanyModal } from '../components/dashboard/RegisterCompanyModal';
import { mockViolations, complianceTrendData } from '../lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Dashboard() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Monitoring Dashboard
          </h1>
          <p className="text-slate-600">
            Real-time industrial land compliance and satellite monitoring system
          </p>
        </div>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          Register Company
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          icon={Building2}
          label="Total Plots"
          value="247"
          variant="default"
        />
        <MetricCard
          icon={CheckCircle}
          label="Compliant"
          value="228"
          variant="success"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Active Violations"
          value="12"
          variant="danger"
        />
        <MetricCard
          icon={MapPin}
          label="High-Risk Zones"
          value="8"
          variant="warning"
        />
        <MetricCard
          icon={DollarSign}
          label="Revenue Impact"
          value="₹4.2M"
          variant="warning"
        />
        <MetricCard
          icon={TrendingUp}
          label="Compliance Rate"
          value="92.4"
          suffix="%"
          change={3.1}
          trend="up"
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* GIS Map Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Satellite Monitoring Map</CardTitle>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded hover:bg-slate-50">
                    Satellite View
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded hover:bg-slate-50">
                    Layers
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded hover:bg-slate-50">
                    Zoom
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
              {/* Mock Map */}
              <div className="aspect-[16/10] relative bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1574169208383-fb087432973a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBtYXAlMjBlYXJ0aCUyMHZpZXd8ZW58MXx8fHwxNzcwODk3NjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Satellite Map"
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Plot Markers */}
                <div className="absolute top-1/4 left-1/3 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 h-4 w-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/2 h-4 w-4 bg-amber-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 h-4 w-4 bg-slate-400 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute bottom-1/4 left-1/4 h-4 w-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg p-4 shadow-lg">
                  <p className="text-xs font-semibold text-slate-700 mb-3">Plot Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-slate-600">Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-slate-600">Violation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                      <span className="text-xs text-slate-600">Under Review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-slate-400 rounded-full"></div>
                      <span className="text-xs text-slate-600">Vacant</span>
                    </div>
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg">
                  <button className="block p-2 border-b border-slate-200 hover:bg-slate-50">
                    <span className="text-lg font-bold text-slate-700">+</span>
                  </button>
                  <button className="block p-2 hover:bg-slate-50">
                    <span className="text-lg font-bold text-slate-700">−</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Analytics Panel */}
        <div className="space-y-6">
          {/* Recent Violations */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-lg font-semibold">Recent Violations</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {mockViolations.slice(0, 4).map((violation) => (
                  <div key={violation.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-900">{violation.plotId}</span>
                      <StatusBadge status={violation.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{violation.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{violation.dateDetected}</span>
                      {violation.deviationPercent && (
                        <span className="font-semibold text-red-600">
                          +{violation.deviationPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded border border-slate-200">
                  📊 Generate Compliance Report
                </button>
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded border border-slate-200">
                  🔍 Schedule Inspection
                </button>
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded border border-slate-200">
                  📢 Issue Notice
                </button>
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded border border-slate-200">
                  🛰️ Request Satellite Update
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance Trends Chart */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <CardTitle className="text-lg font-semibold">Compliance Trends (Last 7 Months)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complianceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="compliant" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Compliant Plots"
              />
              <Line 
                type="monotone" 
                dataKey="violations" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Violations"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Register Company Modal */}
      <RegisterCompanyModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}