// Comprehensive plots dataset with 16 land parcels across Naya Raipur
// Based on actual satellite imagery of Naya Raipur industrial zones with realistic shapes
export interface Plot {
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
  // 10 Active Industrial Plots (Red) - Assigned to Industries
  // Based on real Naya Raipur satellite map coordinates (viewBox: 0 0 800 600)
  {
    id: 'PLT-001',
    plotNumber: 'NRPL-001',
    status: 'active',
    area: 25000,
    shape: { type: 'polygon', points: '130,160 240,155 245,280 125,285' }, // Large active plot near river
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
    shape: { type: 'polygon', points: '260,170 360,165 365,270 255,275' }, // Mid-sized active
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
    shape: { type: 'polygon', points: '390,175 480,172 485,265 385,268' }, // Electronics plot
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
    shape: { type: 'polygon', points: '550,180 680,175 685,280 545,285' }, // Large textile zone
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
    shape: { type: 'polygon', points: '130,310 200,305 205,395 125,400' }, // Food processing
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
    shape: { type: 'polygon', points: '260,320 330,315 335,390 255,395' }, // IT services
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
    shape: { type: 'polygon', points: '390,315 550,310 560,400 385,405' }, // Large chemical zone
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
    shape: { type: 'polygon', points: '130,440 250,435 255,530 125,535' }, // Automotive zone
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
    shape: { type: 'polygon', points: '280,445 420,440 425,535 275,540' }, // Green energy
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
    shape: { type: 'polygon', points: '450,450 560,445 565,535 445,540' }, // Precision tools
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

  // 3 Vacant Plots (Light Grey)
  {
    id: 'PLT-011',
    plotNumber: 'NRPL-011',
    status: 'vacant',
    area: 12000,
    shape: { type: 'polygon', points: '600,200 700,195 705,280 595,285' }, // Vacant east
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '450m',
    utilizationPurpose: 'Available for Industrial Allocation',
  },
  {
    id: 'PLT-012',
    plotNumber: 'NRPL-012',
    status: 'vacant',
    area: 11000,
    shape: { type: 'polygon', points: '600,310 700,305 705,395 595,400' }, // Vacant central
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '550m',
    utilizationPurpose: 'Available for Industrial Allocation',
  },
  {
    id: 'PLT-013',
    plotNumber: 'NRPL-013',
    status: 'vacant',
    area: 9000,
    shape: { type: 'polygon', points: '600,450 700,445 705,535 595,540' }, // Vacant south
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Fair',
    waterAccess: true,
    riverProximity: '500m',
    utilizationPurpose: 'Available for Industrial Allocation',
  },

  // 2 Unusable Plots (Orange) - Environmental or Terrain Constraints
  {
    id: 'PLT-014',
    plotNumber: 'NRPL-014',
    status: 'unusable',
    area: 8500,
    shape: { type: 'polygon', points: '40,300 110,295 115,390 35,395' }, // Flood zone near river
    constraints: ['Low-lying terrain', 'Flood-prone area', 'Inadequate drainage'],
    environmentalStatus: 'Red',
    soilQuality: 'Poor',
    waterAccess: true,
    riverProximity: '10m',
    utilizationPurpose: 'Not suitable for industrial use',
  },
  {
    id: 'PLT-015',
    plotNumber: 'NRPL-015',
    status: 'unusable',
    area: 7500,
    shape: { type: 'polygon', points: '40,450 110,445 115,530 35,535' }, // Heritage zone
    constraints: ['Archaeological site', 'Heritage protection zone'],
    environmentalStatus: 'Amber',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '50m',
    utilizationPurpose: 'Protected heritage area - no industrial use',
  },

  // 1 Disputed Plot (Yellow) - Legal/Boundary Issues
  {
    id: 'PLT-016',
    plotNumber: 'NRPL-016',
    status: 'disputed',
    area: 13000,
    shape: { type: 'polygon', points: '720,320 780,315 785,410 715,415' }, // Disputed east boundary
    constraints: ['Boundary dispute with neighboring state', 'Legal proceedings ongoing', 'Allocation suspended'],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '700m',
    utilizationPurpose: 'Pending legal resolution',
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
