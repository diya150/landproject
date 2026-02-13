import { useParams, Link } from 'react-router';
import { ArrowLeft, AlertTriangle, MapPin, Calendar, Building2, FileText, Flag, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatusBadge } from '../components/dashboard/StatusBadge';
import { mockPlots } from '../lib/mock-data';
import { Progress } from '../components/ui/progress';

export function PlotDetail() {
  const { id } = useParams();
  
  // Mock plot data - in real app would fetch by ID
  const plot = mockPlots[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/plots">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{plot.id}</h1>
            <p className="text-slate-600">{plot.allotteeName}</p>
          </div>
        </div>
        <StatusBadge status={plot.status} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Map & Imagery */}
        <div className="lg:col-span-2 space-y-6">
          {/* Satellite Comparison */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Plot Visualization</CardTitle>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-[#059669] text-white rounded">
                    Current View
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded hover:bg-slate-50">
                    Historical
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded hover:bg-slate-50">
                    Overlay
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video relative bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1561471828-96e54774b225?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBpbmR1c3RyaWFsJTIwYXJlYXxlbnwxfHx8fDE3NzA4OTc2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Satellite view"
                  className="w-full h-full object-cover"
                />
                
                {/* Boundary Overlay */}
                <div className="absolute inset-0 border-4 border-red-500 m-8 opacity-60"></div>
                <div className="absolute inset-0 border-4 border-green-500 border-dashed m-12 opacity-60"></div>
                
                {/* Info Box */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-8 bg-red-500"></div>
                    <span className="text-xs font-medium">Current Boundary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-8 border-2 border-green-500 border-dashed"></div>
                    <span className="text-xs font-medium">Allotted Boundary</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Violation Analysis */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-lg font-semibold">Violation Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Deviation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Boundary Deviation</span>
                    <span className="text-sm font-bold text-red-600">+8.4%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">
                    420 sq.m excess area detected on eastern perimeter
                  </p>
                </div>

                {/* Unauthorized Construction */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900 mb-1">
                        Unauthorized Structure Detected
                      </p>
                      <p className="text-xs text-red-700">
                        AI-based satellite analysis identified potential unauthorized construction 
                        in the northeastern sector. Field inspection recommended.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Change Detection Timeline */}
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Change Detection Timeline</p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-slate-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-slate-900">Initial Compliance</p>
                        <p className="text-xs text-slate-500">Mar 2020 - Dec 2023</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-slate-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-slate-900">Minor Deviation Detected</p>
                        <p className="text-xs text-slate-500">Jan 2024</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Critical Violation</p>
                        <p className="text-xs text-slate-500">Jan 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Plot Information */}
        <div className="space-y-6">
          {/* Plot Details */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-lg font-semibold">Plot Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Plot ID</label>
                  <p className="text-sm font-semibold text-slate-900">{plot.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Allottee Name</label>
                  <p className="text-sm font-semibold text-slate-900">{plot.allotteeName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Industry Type</label>
                  <p className="text-sm font-semibold text-slate-900">{plot.industryType}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Allotted Area</label>
                    <p className="text-sm font-semibold text-slate-900">{plot.allottedArea} sq.m</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Current Area</label>
                    <p className="text-sm font-semibold text-red-600">{plot.currentArea} sq.m</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Compliance Score</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={plot.complianceScore} className="h-2" />
                    <span className="text-sm font-bold text-slate-900">{plot.complianceScore}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Allotted Date</label>
                    <p className="text-sm text-slate-900">{plot.allottedDate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Last Inspection</label>
                    <p className="text-sm text-slate-900">{plot.lastInspection}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-lg font-semibold">Administrative Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Flag className="h-4 w-4 mr-2" />
                Flag Violation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Inspection
              </Button>
              <Button className="w-full justify-start bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Issue Notice
              </Button>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-200 bg-slate-50">
              <CardTitle className="text-lg font-semibold">Location</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>Lat: {plot.location.lat}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>Lng: {plot.location.lng}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}