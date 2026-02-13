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
    status: 'active',
    area: 35000,
    shape: { type: 'polygon', points: '600,200 700,195 705,280 595,285' }, // Bhilai Steel Plant Block
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
    shape: { type: 'polygon', points: '600,310 700,305 705,395 595,400' }, // Sarda Energy
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
    shape: { type: 'polygon', points: '600,450 700,445 705,535 595,540' }, // Sarthak Metals
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
    shape: { type: 'polygon', points: '40,300 110,295 115,390 35,395' }, // Mahamaya Sponge
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
    shape: { type: 'polygon', points: '40,450 110,445 115,530 35,535' }, // Nakoda TMT
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
    shape: { type: 'polygon', points: '720,320 780,315 785,410 715,415' }, // Bansal Metallics
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
  {
    id: 'PLT-017',
    plotNumber: 'NRPL-017',
    status: 'active',
    area: 14000,
    shape: { type: 'polygon', points: '100,100 200,95 205,190 95,195' }, // Beekay Engineering
    assignedIndustryId: 'IND-017',
    assignedIndustryName: 'Beekay Engineering Corporation',
    industryType: 'Engineering Manufacturing',
    complianceScore: 90,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-02',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '250m',
    utilizationPurpose: 'Engineering Manufacturing',
  },
  {
    id: 'PLT-018',
    plotNumber: 'NRPL-018',
    status: 'active',
    area: 8000,
    shape: { type: 'polygon', points: '200,100 280,95 285,180 195,185' }, // BigMint
    assignedIndustryId: 'IND-018',
    assignedIndustryName: 'BigMint (Steelmint)',
    industryType: 'Steel e-commerce Platform',
    complianceScore: 97,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-08',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '600m',
    utilizationPurpose: 'Digital Platform & Logistics',
  },
  {
    id: 'PLT-019',
    plotNumber: 'NRPL-019',
    status: 'active',
    area: 22000,
    shape: { type: 'polygon', points: '300,100 420,95 425,200 295,205' }, // Textile Park
    assignedIndustryId: 'IND-019',
    assignedIndustryName: 'Textile Park',
    industryType: 'Textiles',
    complianceScore: 92,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-25',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '150m',
    utilizationPurpose: 'Textile Manufacturing & Processing',
  },
  {
    id: 'PLT-020',
    plotNumber: 'NRPL-020',
    status: 'active',
    area: 18000,
    shape: { type: 'polygon', points: '450,100 570,95 575,205 445,210' }, // Plastic Park
    assignedIndustryId: 'IND-020',
    assignedIndustryName: 'Plastic Park',
    industryType: 'Plastic Manufacturing',
    complianceScore: 82,
    complianceStatus: 'Under Review',
    lastInspectionDate: '2024-01-30',
    constraints: ['Environmental assessment pending'],
    environmentalStatus: 'Yellow',
    soilQuality: 'Fair',
    waterAccess: false,
    riverProximity: '550m',
    utilizationPurpose: 'Plastic Manufacturing & Recycling',
  },
  {
    id: 'PLT-021',
    plotNumber: 'NRPL-021',
    status: 'active',
    area: 20000,
    shape: { type: 'polygon', points: '50,150 150,145 155,260 45,265' }, // Rail Park
    assignedIndustryId: 'IND-021',
    assignedIndustryName: 'Rail Park',
    industryType: 'Railway Components',
    complianceScore: 94,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-03',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '120m',
    utilizationPurpose: 'Railway Component Manufacturing',
  },
  {
    id: 'PLT-022',
    plotNumber: 'NRPL-022',
    status: 'active',
    area: 45000,
    shape: { type: 'polygon', points: '400,350 550,340 560,480 390,490' }, // KESDA Complex
    assignedIndustryId: 'IND-022',
    assignedIndustryName: 'KESDA (Industrial Estate)',
    industryType: 'Industrial Estate',
    complianceScore: 93,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-06',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '400m',
    utilizationPurpose: 'Multi-purpose Industrial Estate',
  },
  {
    id: 'PLT-023',
    plotNumber: 'NRPL-023',
    status: 'active',
    area: 11000,
    shape: { type: 'polygon', points: '650,100 730,95 735,180 645,185' }, // Balod Bharda
    assignedIndustryId: 'IND-023',
    assignedIndustryName: 'Balod Bharda Industry',
    industryType: 'Food Processing',
    complianceScore: 91,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-12',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '300m',
    utilizationPurpose: 'Food Processing & Packaging',
  },
  {
    id: 'PLT-024',
    plotNumber: 'NRPL-024',
    status: 'active',
    area: 19000,
    shape: { type: 'polygon', points: '250,320 380,310 385,430 245,440' }, // Barabaspur
    assignedIndustryId: 'IND-024',
    assignedIndustryName: 'Barabaspur Industry',
    industryType: 'Metal Processing',
    complianceScore: 88,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-04',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: false,
    riverProximity: '450m',
    utilizationPurpose: 'Metal Processing & Treatment',
  },
  {
    id: 'PLT-025',
    plotNumber: 'NRPL-025',
    status: 'active',
    area: 15000,
    shape: { type: 'polygon', points: '700,450 800,445 800,540 700,545' }, // Parasiya
    assignedIndustryId: 'IND-025',
    assignedIndustryName: 'Parasiya Industry',
    industryType: 'Manufacturing',
    complianceScore: 80,
    complianceStatus: 'Under Review',
    lastInspectionDate: '2024-01-18',
    constraints: ['Compliance review pending'],
    environmentalStatus: 'Yellow',
    soilQuality: 'Fair',
    waterAccess: true,
    riverProximity: '350m',
    utilizationPurpose: 'General Manufacturing',
  },
  {
    id: 'PLT-026',
    plotNumber: 'NRPL-026',
    status: 'active',
    area: 17000,
    shape: { type: 'polygon', points: '160,380 280,370 285,480 155,490' }, // Rikhi
    assignedIndustryId: 'IND-026',
    assignedIndustryName: 'Rikhi Industry',
    industryType: 'Steel Manufacturing',
    complianceScore: 92,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-22',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '200m',
    utilizationPurpose: 'Steel Manufacturing & Fabrication',
  },
  {
    id: 'PLT-027',
    plotNumber: 'NRPL-027',
    status: 'active',
    area: 9000,
    shape: { type: 'polygon', points: '480,320 550,315 555,390 475,395' }, // Tilda
    assignedIndustryId: 'IND-027',
    assignedIndustryName: 'Tilda Industry',
    industryType: 'Rice Processing',
    complianceScore: 95,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-02-07',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '280m',
    utilizationPurpose: 'Rice Processing & Packaging',
  },
  {
    id: 'PLT-028',
    plotNumber: 'NRPL-028',
    status: 'active',
    area: 21000,
    shape: { type: 'polygon', points: '330,450 450,440 455,550 325,560' }, // Ulakiya
    assignedIndustryId: 'IND-028',
    assignedIndustryName: 'Ulakiya Industry',
    industryType: 'Steel and Tubes',
    complianceScore: 89,
    complianceStatus: 'Compliant',
    lastInspectionDate: '2024-01-28',
    constraints: [],
    environmentalStatus: 'Green',
    soilQuality: 'Good',
    waterAccess: true,
    riverProximity: '320m',
    utilizationPurpose: 'Steel & Tube Manufacturing',
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
