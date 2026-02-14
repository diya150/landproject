import { Building2, CheckCircle, AlertTriangle, MapPin, Plus } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Main Content Grid - Analytics Cards (responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <span className="font-semibold text-red-600">+{violation.deviationPercent}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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