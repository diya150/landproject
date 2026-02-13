import { Download, TrendingUp, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { complianceTrendData, violationsByTypeData } from '../lib/mock-data';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const regionData = [
  { region: 'Sector A', compliant: 45, violations: 3 },
  { region: 'Sector B', compliant: 38, violations: 7 },
  { region: 'Sector C', compliant: 52, violations: 2 },
  { region: 'Sector D', compliant: 41, violations: 8 },
  { region: 'Sector E', compliant: 36, violations: 4 },
];

const revenueImpactData = [
  { month: 'Aug', impact: 3.2 },
  { month: 'Sep', impact: 2.8 },
  { month: 'Oct', impact: 3.5 },
  { month: 'Nov', impact: 2.9 },
  { month: 'Dec', impact: 4.1 },
  { month: 'Jan', impact: 3.6 },
  { month: 'Feb', impact: 4.2 },
];

export function Reports() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive compliance and performance insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-[#059669] hover:bg-[#059669]/90">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Quick Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Monthly Report</p>
                <p className="text-xs text-slate-500">February 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Compliance Report</p>
                <p className="text-xs text-slate-500">Q1 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Violations Report</p>
                <p className="text-xs text-slate-500">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Executive Summary</p>
                <p className="text-xs text-slate-500">FY 2025-26</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compliance Trends */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-lg font-semibold">Compliance Trends (7 Months)</CardTitle>
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
                  strokeWidth={3}
                  name="Compliant Plots"
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="violations" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Violations"
                  dot={{ fill: '#ef4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Violations by Type */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-lg font-semibold">Violations by Type</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={violationsByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {violationsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Region-wise Analysis */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-lg font-semibold">Region-wise Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="compliant" fill="#10b981" name="Compliant" />
                <Bar dataKey="violations" fill="#ef4444" name="Violations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Impact */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <CardTitle className="text-lg font-semibold">Revenue Impact Estimation (₹M)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueImpactData}>
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
                <Bar dataKey="impact" fill="#FF9933" name="Revenue Loss (₹M)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary Table */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Executive Summary - Key Metrics</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Previous Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Total Plots Monitored</td>
                  <td className="px-6 py-4 text-slate-700">247</td>
                  <td className="px-6 py-4 text-slate-600">242</td>
                  <td className="px-6 py-4 text-green-600 font-medium">+2.1%</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Good</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Compliance Rate</td>
                  <td className="px-6 py-4 text-slate-700">92.4%</td>
                  <td className="px-6 py-4 text-slate-600">89.6%</td>
                  <td className="px-6 py-4 text-green-600 font-medium">+3.1%</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Excellent</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Active Violations</td>
                  <td className="px-6 py-4 text-slate-700">23</td>
                  <td className="px-6 py-4 text-slate-600">28</td>
                  <td className="px-6 py-4 text-green-600 font-medium">-17.9%</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Improving</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Revenue Leakage</td>
                  <td className="px-6 py-4 text-slate-700">₹4.2M</td>
                  <td className="px-6 py-4 text-slate-600">₹3.6M</td>
                  <td className="px-6 py-4 text-red-600 font-medium">+16.7%</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Attention Required</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Avg Resolution Time</td>
                  <td className="px-6 py-4 text-slate-700">18 days</td>
                  <td className="px-6 py-4 text-slate-600">22 days</td>
                  <td className="px-6 py-4 text-green-600 font-medium">-18.2%</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Improving</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}