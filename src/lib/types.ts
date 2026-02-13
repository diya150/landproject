export interface PlotData {
  id: string;
  allotteeName: string;
  allottedArea: number;
  currentArea: number;
  status: 'compliant' | 'violation' | 'under-review' | 'vacant';
  complianceScore: number;
  location: {
    lat: number;
    lng: number;
  };
  industryType: string;
  allottedDate: string;
  lastInspection: string;
  violations?: Violation[];
}

export interface Violation {
  id: string;
  plotId: string;
  type: 'boundary-encroachment' | 'unauthorized-construction' | 'land-use-change' | 'environmental';
  severity: 'low' | 'medium' | 'high' | 'critical';
  dateDetected: string;
  status: 'pending' | 'under-investigation' | 'resolved' | 'escalated';
  description: string;
  deviationPercent?: number;
  industry: string;
}

export interface Alert {
  id: string;
  type: 'violation' | 'system' | 'compliance' | 'risk';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  plotId?: string;
  isRead: boolean;
}

export interface MetricData {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  suffix?: string;
}
