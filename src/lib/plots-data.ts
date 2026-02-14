// Comprehensive plots dataset with 16 land parcels across Naya Raipur
// Based on actual satellite imagery of Naya Raipur industrial zones with realistic shapes
export interface Plot {
  industryName: any;
  coordinates: any;
  id: string;
  plotNumber: string;
  status: 'active' | 'vacant' | 'unusable' | 'disputed';
  area: number; // in square meters
  shape: {
    type: 'rectangle' | 'polygon';
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    points?: string; // SVG polygon points for irregular shapes
    rotation?: number; // For angled plots
  };
  assignedIndustryId?: string; // Reference to industry ID
  assignedIndustryName?: string;
  industryType?: string; // For visual representation
  complianceScore?: number;
  complianceStatus?: 'Compliant' | 'Violation' | 'Under Review' | 'Pending';
  lastInspectionDate?: string;
  constraints?: string[];
  boundaryCoordinates?: {
    lat: number;
    lng: number;
  }[];
  environmentalStatus?: 'Green' | 'Yellow' | 'Amber' | 'Red';
  soilQuality?: 'Good' | 'Fair' | 'Poor';
  waterAccess?: boolean;
  riverProximity?: string; // Distance to river
  utilizationPurpose?: string;
}

export const plotsData: Plot[] = [
  // 16 Active Industrial Plots arranged with better spacing - NO OVERLAPS
  // Grid layout with proper gaps: 4 columns × 4 rows across 800x600 canvas
  {
    id: 'PLT-001',
    plotNumber: 'NRPL-001',
    status: 'active',
    area: 25000,
    shape: { type: 'polygon', points: '10,10 185,10 185,135 10,135' }, // Top-left (Full width: ~175px)
    assignedIndustryId: 'IND-001',
    assignedIndustryName: 'Bhilai Steel Manufacturing Ltd.',
    industryType: 'Steel Manufacturing',
    complianceScore: 92,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-15',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '50m',
    utilizationPurpose: 'Steel Manufacturing & Processing Unit',
  },
  {
    id: 'PLT-002',
    plotNumber: 'NRPL-002',
    status: 'active',
    area: 15000,
    shape: { type: 'polygon', points: '205,10 380,10 380,135 205,135' }, // Top-middle-left
    assignedIndustryId: 'IND-002',
    assignedIndustryName: 'Chhattisgarh Pharma Industries',
    industryType: 'Pharmaceuticals',
    complianceScore: 95,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-01',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '200m',
    utilizationPurpose: 'Pharmaceutical Manufacturing & R&D',
  },
  {
    id: 'PLT-003',
    plotNumber: 'NRPL-003',
    status: 'active',
    area: 12000,
    shape: { type: 'polygon', points: '410,10 585,10 585,135 410,135' }, // Top-middle-right
    assignedIndustryId: 'IND-003',
    assignedIndustryName: 'TechCG Electronics Pvt. Ltd.',
    industryType: 'Electronics',
    complianceScore: 78,
    complianceStatus: 'Under Review',
    lastInspectionDate: '2023-12-20',
    constraints: ['Pending Compliance Review'],
    environmentalStatus: 'Yellow',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '400m',
    utilizationPurpose: 'Electronics Assembly & Testing',
  },
  {
    id: 'PLT-004',
    plotNumber: 'NRPL-004',
    status: 'active',
    area: 18000,
    shape: { type: 'polygon', points: '615,10 790,10 790,135 615,135' }, // Top-right
    assignedIndustryId: 'IND-004',
    assignedIndustryName: 'Mahadev Textile Mills',
    industryType: 'Textiles',
    complianceScore: 88,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-28',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Fair',
    waterAccess: true,
    riverProximity: '300m',
    utilizationPurpose: 'Textile Manufacturing & Dyeing',
  },
  {
    id: 'PLT-005',
    plotNumber: 'NRPL-005',
    status: 'active',
    area: 10000,
    shape: { type: 'polygon', points: '10,155 185,155 185,280 10,280' }, // Second row-left
    assignedIndustryId: 'IND-005',
    assignedIndustryName: 'Agro Foods Processing Ltd.',
    industryType: 'Food Processing',
    complianceScore: 62,
    complianceStatus: 'Violation',
    lastInspectionDate: '2024-01-10',
    constraints: ['Expired Environmental Clearance', 'Water Quality Issues'],
    environmentalStatus: 'Red',
    soilQuality: 'Fair',
    waterAccess: true,
    riverProximity: '100m',
    utilizationPurpose: 'Food Processing & Warehouse',
  },
  {
    id: 'PLT-006',
    plotNumber: 'NRPL-006',
    status: 'active',
    area: 8000,
    shape: { type: 'polygon', points: '205,155 380,155 380,280 205,280' }, // Second row-middle-left
    assignedIndustryId: 'IND-006',
    assignedIndustryName: 'InfoTech Solutions Hub',
    industryType: 'IT Services',
    complianceScore: 96,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-05',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '500m',
    utilizationPurpose: 'IT Office & Development Center',
  },
  {
    id: 'PLT-007',
    plotNumber: 'NRPL-007',
    status: 'active',
    area: 22000,
    shape: { type: 'polygon', points: '410,155 585,155 585,280 410,280' }, // Second row-middle-right
    assignedIndustryId: 'IND-007',
    assignedIndustryName: 'ChemTech Industries Pvt. Ltd.',
    industryType: 'Chemical Manufacturing',
    complianceScore: 85,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-22',
    constraints: [],
    environmentalStatus: 'Amber',
    soilQuality: 'Fair',
    waterAccess: true,
    riverProximity: '250m',
    utilizationPurpose: 'Chemical Manufacturing & Storage',
  },
  {
    id: 'PLT-008',
    plotNumber: 'NRPL-008',
    status: 'active',
    area: 16000,
    shape: { type: 'polygon', points: '615,155 790,155 790,280 615,280' }, // Second row-right
    assignedIndustryId: 'IND-008',
    assignedIndustryName: 'AutoParts Manufacturing Co.',
    industryType: 'Automotive',
    complianceScore: 75,
    complianceStatus: 'Pending',
    lastInspectionDate: '2023-11-15',
    constraints: ['Awaiting Compliance Certification'],
    environmentalStatus: 'Yellow',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '350m',
    utilizationPurpose: 'Automotive Parts Manufacturing',
  },
  {
    id: 'PLT-009',
    plotNumber: 'NRPL-009',
    status: 'active',
    area: 20000,
    shape: { type: 'polygon', points: '10,300 185,300 185,425 10,425' }, // Third row-left
    assignedIndustryId: 'IND-009',
    assignedIndustryName: 'Green Energy Solutions',
    industryType: 'Renewable Energy',
    complianceScore: 94,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-08',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '600m',
    utilizationPurpose: 'Solar Panel Manufacturing',
  },
  {
    id: 'PLT-010',
    plotNumber: 'NRPL-010',
    status: 'active',
    area: 14000,
    shape: { type: 'polygon', points: '205,300 380,300 380,425 205,425' }, // Third row-middle-left
    assignedIndustryId: 'IND-010',
    assignedIndustryName: 'Precision Tools & Dies Ltd.',
    industryType: 'Manufacturing',
    complianceScore: 81,
    complianceStatus: 'Under Review',
    lastInspectionDate: '2024-01-05',
    constraints: ['Annual Audit Pending'],
    environmentalStatus: 'Yellow',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '400m',
    utilizationPurpose: 'Precision Tool Manufacturing & Testing',
  },
  {
    id: 'PLT-011',
    plotNumber: 'NRPL-011',
    status: 'active',
    area: 35000,
    shape: { type: 'polygon', points: '410,300 585,300 585,425 410,425' }, // Third row-middle-right
    assignedIndustryId: 'IND-011',
    assignedIndustryName: 'Bhilai Steel Plant Block',
    industryType: 'Steel Manufacturing',
    complianceScore: 96,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-10',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '100m',
    utilizationPurpose: 'Large-scale Steel Manufacturing',
  },
  {
    id: 'PLT-012',
    plotNumber: 'NRPL-012',
    status: 'active',
    area: 28000,
    shape: { type: 'polygon', points: '615,300 790,300 790,425 615,425' }, // Third row-right
    assignedIndustryId: 'IND-012',
    assignedIndustryName: 'Sarda Energy and Minerals Ltd',
    industryType: 'Mineral Processing',
    complianceScore: 94,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-20',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '300m',
    utilizationPurpose: 'Mineral Processing & Energy',
  },
  {
    id: 'PLT-013',
    plotNumber: 'NRPL-013',
    status: 'active',
    area: 18000,
    shape: { type: 'polygon', points: '10,445 185,445 185,585 10,585' }, // Bottom row-left
    assignedIndustryId: 'IND-013',
    assignedIndustryName: 'Sarthak Metals Ltd',
    industryType: 'Metal Manufacturing',
    complianceScore: 91,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-01',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '400m',
    utilizationPurpose: 'Metal Manufacturing & Processing',
  },
  {
    id: 'PLT-014',
    plotNumber: 'NRPL-014',
    status: 'active',
    area: 25000,
    shape: { type: 'polygon', points: '205,445 380,445 380,585 205,585' }, // Bottom row-middle-left
    assignedIndustryId: 'IND-014',
    assignedIndustryName: 'Mahamaya Sponge Pvt Ltd',
    industryType: 'Sponge Iron Manufacturing',
    complianceScore: 93,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-28',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '200m',
    utilizationPurpose: 'Sponge Iron Manufacturing',
  },
  {
    id: 'PLT-015',
    plotNumber: 'NRPL-015',
    status: 'active',
    area: 12000,
    shape: { type: 'polygon', points: '410,445 585,445 585,585 410,585' }, // Bottom row-middle-right
    assignedIndustryId: 'IND-015',
    assignedIndustryName: 'Nakoda TMT',
    industryType: 'Steel Reinforcement',
    complianceScore: 89,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-05',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Fair',
    waterAccess: true,
    riverProximity: '350m',
    utilizationPurpose: 'Steel Reinforcement Manufacturing',
  },
  {
    id: 'PLT-016',
    plotNumber: 'NRPL-016',
    status: 'active',
    area: 16000,
    shape: { type: 'polygon', points: '615,445 790,445 790,585 615,585' }, // Bottom row-right
    assignedIndustryId: 'IND-016',
    assignedIndustryName: 'Bansal Metallics',
    industryType: 'Non-Ferrous Metals',
    complianceScore: 85,
    complianceStatus: 'Under Review',
    lastInspectionDate: '2024-01-15',
    constraints: ['Pending compliance review'],
    environmentalStatus: 'Yellow',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '500m',
    utilizationPurpose: 'Non-Ferrous Metal Manufacturing',
  },
];

// Helper function to get plot by ID
export const getPlotById = (id: string): Plot | undefined => {
  return plotsData.find(plot => plot.id === id);
};

// Helper function to get plots by status
export const getPlotsByStatus = (status: Plot['status']): Plot[] => {
  return plotsData.filter(plot => plot.status === status);
};

// Helper function to get plot assigned to industry
export const getPlotByIndustryId = (industryId: string): Plot | undefined => {
  return plotsData.find(plot => plot.assignedIndustryId === industryId);
};

// Statistics helper
export const getPlotsStatistics = () => {
  return {
    total: plotsData.length,
    active: plotsData.filter(p => p.status === 'active').length,
    vacant: plotsData.filter(p => p.status === 'vacant').length,
    unusable: plotsData.filter(p => p.status === 'unusable').length,
    disputed: plotsData.filter(p => p.status === 'disputed').length,
    totalArea: plotsData.reduce((sum, p) => sum + p.area, 0),
    averageComplianceScore: Math.round(
      plotsData
        .filter(p => p.complianceScore)
        .reduce((sum, p) => sum + (p.complianceScore || 0), 0) / 
      plotsData.filter(p => p.complianceScore).length
    ),
  };
};

// Naya Raipur specific coordinates (center point)
export const NAYA_RAIPUR_CENTER = {
  latitude: 20.1920,
  longitude: 81.7196,
};

// River coordinates for reference (Mahanadi River)
export const RIVER_COORDINATES = {
  start: { latitude: 20.165, longitude: 81.695 },
  end: { latitude: 20.220, longitude: 81.745 },
  name: 'Mahanadi River',
};
