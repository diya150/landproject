import { Link } from 'react-router';
import { Search, Filter, Eye, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { StatusBadge } from '../components/dashboard/StatusBadge';
import { mockPlots } from '../lib/mock-data';

export function Plots() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Plot Monitoring</h1>
        <p className="text-slate-600">Monitor and inspect all industrial land plots</p>
      </div>

      {/* Search & Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by Plot ID, Allottee, or Industry..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plots Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlots.map((plot) => (
          <Card key={plot.id} className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-[#059669]">{plot.id}</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">{plot.industryType}</p>
                </div>
                <StatusBadge status={plot.status} size="sm" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">Allottee</p>
                <p className="text-sm font-semibold text-slate-900">{plot.allotteeName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Allotted</p>
                  <p className="text-sm font-semibold text-slate-900">{plot.allottedArea} m²</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Current</p>
                  <p className={`text-sm font-semibold ${plot.currentArea > plot.allottedArea ? 'text-red-600' : 'text-green-600'}`}>
                    {plot.currentArea} m²
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-slate-500 uppercase">Compliance Score</p>
                  <p className="text-sm font-bold text-slate-900">{plot.complianceScore}%</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      plot.complianceScore >= 90 ? 'bg-green-500' :
                      plot.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${plot.complianceScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="h-3 w-3" />
                <span>{plot.location.lat}, {plot.location.lng}</span>
              </div>

              <Link to={`/plots/${plot.id}`}>
                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}