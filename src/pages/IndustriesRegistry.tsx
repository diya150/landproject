import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Download, Building2, MapPin, Phone, Mail, TrendingUp, Users, Calendar, FileCheck, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatusBadge } from '../components/dashboard/StatusBadge';
import { Button } from '../components/ui/button';
import { industriesData, Industry } from '../lib/industries-data';
import { getPlotByIndustryId } from '../lib/plots-data';
import { getIndustryImagePath } from '../lib/industry-images';

export function IndustriesRegistry({ onIndustrySelect }: { onIndustrySelect?: (industryId: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get unique districts and industry types
  const districts = ['All', ...Array.from(new Set(industriesData.map(ind => ind.district)))];
  const industryTypes = ['All', ...Array.from(new Set(industriesData.map(ind => ind.industryType)))];

  // Filter industries
  const filteredIndustries = industriesData.filter(industry => {
    const matchesSearch = 
      industry.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = filterDistrict === 'All' || industry.district === filterDistrict;
    const matchesIndustry = filterIndustry === 'All' || industry.industryType === filterIndustry;
    const matchesStatus = filterStatus === 'All' || industry.complianceStatus === filterStatus;

    return matchesSearch && matchesDistrict && matchesIndustry && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: industriesData.length,
    compliant: industriesData.filter(i => i.complianceStatus === 'Compliant').length,
    violations: industriesData.filter(i => i.complianceStatus === 'Violation').length,
    underReview: industriesData.filter(i => i.complianceStatus === 'Under Review').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Industries Registry
        </h1>
        <p className="text-slate-600">
          Comprehensive database of all registered industries in Chhattisgarh
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Industries</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Compliant</p>
                <p className="text-3xl font-bold text-green-600">{stats.compliant}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Violations</p>
                <p className="text-3xl font-bold text-red-600">{stats.violations}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Under Review</p>
                <p className="text-3xl font-bold text-amber-600">{stats.underReview}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by company name, plot number, or registration..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {industryTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Violation">Violation</option>
                <option value="Under Review">Under Review</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {filteredIndustries.length} of {industriesData.length} industries
            </p>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Industries List */}
      <div className="space-y-4">
        {filteredIndustries.map((industry) => {
          const assignedPlot = getPlotByIndustryId(industry.id);
          const isSelected = selectedIndustryId === industry.id;
          
          return (
            <Card
              key={industry.id}
              className={`border-slate-200 hover:shadow-md transition-all cursor-pointer ${
                isSelected ? 'border-emerald-500 border-2 shadow-lg' : ''
              }`}
              onClick={() => {
                setSelectedIndustryId(industry.id);
                onIndustrySelect?.(industry.id);
              }}
            >
              <CardContent className="p-0">
                {/* Industry Image - Top Section */}
                {(() => {
                  const imagePath = getIndustryImagePath(industry.id);
                  return imagePath ? (
                    <div className="relative w-full h-48 bg-slate-200 overflow-hidden rounded-t-lg border-b border-slate-200">
                      <img
                        src={imagePath}
                        alt={industry.companyName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x400?text=' + encodeURIComponent(industry.companyName);
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="inline-block bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-slate-900">
                          {industry.industryType}
                        </span>
                      </div>
                    </div>
                  ) : null;
                })()}

                <div className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Main Information */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-emerald-500' : 'bg-emerald-100'
                      }`}>
                        <Building2 className={`h-6 w-6 ${
                          isSelected ? 'text-white' : 'text-emerald-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1 truncate">
                          {industry.companyName}
                        </h3>
                        <p className="text-sm text-slate-600 mb-1">{industry.registrationNumber}</p>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={industry.complianceStatus} size="sm" />
                          <span className="text-xs text-slate-500">{industry.industryType}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Plot Details */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600 truncate">{industry.location}</p>
                        <p className="text-xs text-slate-500">{industry.district}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-600">
                        <strong className="text-slate-900">Plot:</strong> {industry.plotNumber}
                      </span>
                      <span className="text-slate-600">
                        <strong className="text-slate-900">Area:</strong> {industry.area.toLocaleString()} m²
                      </span>
                    </div>
                    {assignedPlot && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-xs text-emerald-700 font-semibold">
                          📍 Land Parcel: {assignedPlot.plotNumber} ({assignedPlot.status})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact & Additional Info */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{industry.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 truncate">{industry.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {industry.employeeCount} employees
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="lg:col-span-1 flex items-center justify-end">
                    <Button
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      className="whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndustryId(industry.id);
                        onIndustrySelect?.(industry.id);
                        // Navigate to land-monitoring page with the selected industry
                        navigate(`/land-monitoring?industryId=${industry.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View on Map
                    </Button>
                  </div>
                </div>

                {/* Expandable Details */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="grid md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-slate-500 mb-1">Production Capacity</p>
                      <p className="text-slate-700 font-medium">{industry.productionCapacity}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Environmental Clearance</p>
                      <p className="text-slate-700 font-medium">{industry.environmentalClearance}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Last Inspection</p>
                      <p className="text-slate-700 font-medium">
                        {new Date(industry.lastInspectionDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-slate-500 text-xs mb-1">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {industry.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>                </div>              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIndustries.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium mb-1">No industries found</p>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
