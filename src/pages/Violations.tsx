import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Flag, Send, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { StatusBadge } from '../components/dashboard/StatusBadge';
import { SeverityBadge } from '../components/dashboard/SeverityBadge';
import { AutomatedActionModal } from '../components/AutomatedActionModal';
import { mockViolations } from '../lib/mock-data';
import type { Violation } from '../lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Violations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [customViolations, setCustomViolations] = useState<any[]>([]);

  // Load violations from localStorage
  const loadViolations = () => {
    try {
      const stored = localStorage.getItem('violations');
      if (stored) {
        setCustomViolations(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading violations from localStorage:', e);
    }
  };

  useEffect(() => {
    loadViolations();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'violations') {
        loadViolations();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes every 2 seconds (for same-tab updates)
    const interval = setInterval(loadViolations, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Combine mock violations with custom violations from localStorage
  const allViolations = [...mockViolations, ...customViolations];

  const handleActionClick = (violation: Violation) => {
    setSelectedViolation(violation);
    setIsActionModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Violations Management</h1>
          <p className="text-slate-600">Monitor and manage compliance violations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadViolations} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-[#059669] hover:bg-[#059669]/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Violations</p>
            <p className="text-2xl font-bold text-slate-900">{allViolations.length}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-red-700 mb-1">Critical</p>
            <p className="text-2xl font-bold text-red-900">3</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-amber-700 mb-1">Under Investigation</p>
            <p className="text-2xl font-bold text-amber-900">12</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-green-700 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-900">8</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by Plot ID, Industry, or Violation Type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-investigation">Under Investigation</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Violations Table */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <CardTitle className="text-lg font-semibold">Active Violations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Violation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Plot ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date Detected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {allViolations.map((violation) => (
                  <tr key={violation.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-900">{violation.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#059669]">{violation.plotId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{violation.industry || violation.companyName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {violation.type ? 
                          violation.type.split('-').map((word: string) => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')
                          : 'Complaint'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SeverityBadge severity={violation.severity} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{violation.dateDetected}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={violation.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleActionClick(violation)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Automated Action - Email Authority"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Automated Action Modal */}
      <AutomatedActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        violation={selectedViolation}
      />
    </div>
  );
}