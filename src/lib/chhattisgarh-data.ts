/**
 * Chhattisgarh Industrial Land & Industries Data
 */

export const chhattisgarh_industries = [
  {
    id: 'IND-CG-001',
    name: 'Raigarh Steel Industries',
    type: 'Steel Manufacturing',
    sector: 'Raigarh',
    coordinates: [21.8854, 83.4122],
    totalArea: 250,
    occupiedArea: 245,
    status: 'active',
    deviationPercent: -2,
    plots: ['PLT-CG-001', 'PLT-CG-002', 'PLT-CG-003'],
    image: 'https://via.placeholder.com/150?text=Steel'
  },
  {
    id: 'IND-CG-002',
    name: 'Bilaspur Cement Corp',
    type: 'Cement Manufacturing',
    sector: 'Bilaspur',
    coordinates: [21.8040, 82.1502],
    totalArea: 180,
    occupiedArea: 175,
    status: 'active',
    deviationPercent: -3,
    plots: ['PLT-CG-004', 'PLT-CG-005'],
    image: 'https://via.placeholder.com/150?text=Cement'
  },
  {
    id: 'IND-CG-003',
    name: 'Durg Power Generation',
    type: 'Power Plants',
    sector: 'Durg',
    coordinates: [21.1872, 81.2784],
    totalArea: 320,
    occupiedArea: 330,
    status: 'violation',
    deviationPercent: 3.1,
    plots: ['PLT-CG-006', 'PLT-CG-007', 'PLT-CG-008'],
    image: 'https://via.placeholder.com/150?text=Power'
  },
  {
    id: 'IND-CG-004',
    name: 'Korba Thermal Complex',
    type: 'Thermal Power',
    sector: 'Korba',
    coordinates: [22.2775, 82.7061],
    totalArea: 400,
    occupiedArea: 405,
    status: 'violation',
    deviationPercent: 1.25,
    plots: ['PLT-CG-009', 'PLT-CG-010', 'PLT-CG-011', 'PLT-CG-012'],
    image: 'https://via.placeholder.com/150?text=Thermal'
  },
  {
    id: 'IND-CG-005',
    name: 'Rajnandgaon Aluminum',
    type: 'Aluminum Smelting',
    sector: 'Rajnandgaon',
    coordinates: [21.9401, 81.0308],
    totalArea: 200,
    occupiedArea: 200,
    status: 'active',
    deviationPercent: 0,
    plots: ['PLT-CG-013', 'PLT-CG-014'],
    image: 'https://via.placeholder.com/150?text=Aluminum'
  },
  {
    id: 'IND-CG-006',
    name: 'Raipur IT Park',
    type: 'Information Technology',
    sector: 'Raipur',
    coordinates: [21.2458, 81.6304],
    totalArea: 120,
    occupiedArea: 118,
    status: 'active',
    deviationPercent: -1.67,
    plots: ['PLT-CG-015', 'PLT-CG-016'],
    image: 'https://via.placeholder.com/150?text=IT'
  },
  {
    id: 'IND-CG-007',
    name: 'Bhilai Steel Plant',
    type: 'Steel Manufacturing',
    sector: 'Bhilai',
    coordinates: [21.1953, 81.3761],
    totalArea: 280,
    occupiedArea: 290,
    status: 'violation',
    deviationPercent: 3.57,
    plots: ['PLT-CG-017', 'PLT-CG-018', 'PLT-CG-019'],
    image: 'https://via.placeholder.com/150?text=Steel'
  },
  {
    id: 'IND-CG-008',
    name: 'Jagdalpur Mining Ltd',
    type: 'Mining Operations',
    sector: 'Jagdalpur',
    coordinates: [20.8385, 81.1827],
    totalArea: 350,
    occupiedArea: 360,
    status: 'violation',
    deviationPercent: 2.86,
    plots: ['PLT-CG-020', 'PLT-CG-021', 'PLT-CG-022'],
    image: 'https://via.placeholder.com/150?text=Mining'
  }
];

export const chhattisgarh_land_parcels = [
  { id: 'PLT-CG-001', industry: 'IND-CG-001', name: 'Raigarh Plot 1', area: 85, coordinates: [[21.8850, 83.4100], [21.8860, 83.4100], [21.8860, 83.4150], [21.8850, 83.4150]], status: 'active' },
  { id: 'PLT-CG-002', industry: 'IND-CG-001', name: 'Raigarh Plot 2', area: 90, coordinates: [[21.8865, 83.4100], [21.8875, 83.4100], [21.8875, 83.4150], [21.8865, 83.4150]], status: 'active' },
  { id: 'PLT-CG-003', industry: 'IND-CG-001', name: 'Raigarh Plot 3', area: 75, coordinates: [[21.8850, 83.4160], [21.8860, 83.4160], [21.8860, 83.4220], [21.8850, 83.4220]], status: 'active' },
  
  { id: 'PLT-CG-004', industry: 'IND-CG-002', name: 'Bilaspur Plot 1', area: 95, coordinates: [[21.8030, 82.1480], [21.8050, 82.1480], [21.8050, 82.1550], [21.8030, 82.1550]], status: 'active' },
  { id: 'PLT-CG-005', industry: 'IND-CG-002', name: 'Bilaspur Plot 2', area: 80, coordinates: [[21.8060, 82.1480], [21.8080, 82.1480], [21.8080, 82.1550], [21.8060, 82.1550]], status: 'active' },
  
  { id: 'PLT-CG-006', industry: 'IND-CG-003', name: 'Durg Plot 1', area: 110, coordinates: [[21.1860, 81.2750], [21.1890, 81.2750], [21.1890, 81.2850], [21.1860, 81.2850]], status: 'violation' },
  { id: 'PLT-CG-007', industry: 'IND-CG-003', name: 'Durg Plot 2', area: 105, coordinates: [[21.1900, 81.2750], [21.1930, 81.2750], [21.1930, 81.2850], [21.1900, 81.2850]], status: 'violation' },
  { id: 'PLT-CG-008', industry: 'IND-CG-003', name: 'Durg Plot 3', area: 115, coordinates: [[21.1860, 81.2860], [21.1890, 81.2860], [21.1890, 81.2950], [21.1860, 81.2950]], status: 'violation' },
  
  { id: 'PLT-CG-009', industry: 'IND-CG-004', name: 'Korba Plot 1', area: 125, coordinates: [[22.2760, 82.7020], [22.2800, 82.7020], [22.2800, 82.7140], [22.2760, 82.7140]], status: 'violation' },
  { id: 'PLT-CG-010', industry: 'IND-CG-004', name: 'Korba Plot 2', area: 120, coordinates: [[22.2810, 82.7020], [22.2850, 82.7020], [22.2850, 82.7140], [22.2810, 82.7140]], status: 'violation' },
  { id: 'PLT-CG-011', industry: 'IND-CG-004', name: 'Korba Plot 3', area: 130, coordinates: [[22.2760, 82.7150], [22.2800, 82.7150], [22.2800, 82.7270], [22.2760, 82.7270]], status: 'violation' },
  { id: 'PLT-CG-012', industry: 'IND-CG-004', name: 'Korba Plot 4', area: 125, coordinates: [[22.2810, 82.7150], [22.2850, 82.7150], [22.2850, 82.7270], [22.2810, 82.7270]], status: 'violation' },
  
  { id: 'PLT-CG-013', industry: 'IND-CG-005', name: 'Rajnandgaon Plot 1', area: 105, coordinates: [[21.9390, 81.0280], [21.9420, 81.0280], [21.9420, 81.0380], [21.9390, 81.0380]], status: 'active' },
  { id: 'PLT-CG-014', industry: 'IND-CG-005', name: 'Rajnandgaon Plot 2', area: 95, coordinates: [[21.9430, 81.0280], [21.9460, 81.0280], [21.9460, 81.0380], [21.9430, 81.0380]], status: 'active' },
  
  { id: 'PLT-CG-015', industry: 'IND-CG-006', name: 'Raipur IT Plot 1', area: 65, coordinates: [[21.2450, 81.6280], [21.2470, 81.6280], [21.2470, 81.6360], [21.2450, 81.6360]], status: 'active' },
  { id: 'PLT-CG-016', industry: 'IND-CG-006', name: 'Raipur IT Plot 2', area: 55, coordinates: [[21.2480, 81.6280], [21.2500, 81.6280], [21.2500, 81.6360], [21.2480, 81.6360]], status: 'active' },
  
  { id: 'PLT-CG-017', industry: 'IND-CG-007', name: 'Bhilai Plot 1', area: 100, coordinates: [[21.1940, 81.3730], [21.1980, 81.3730], [21.1980, 81.3850], [21.1940, 81.3850]], status: 'violation' },
  { id: 'PLT-CG-018', industry: 'IND-CG-007', name: 'Bhilai Plot 2', area: 110, coordinates: [[21.1990, 81.3730], [21.2030, 81.3730], [21.2030, 81.3850], [21.1990, 81.3850]], status: 'violation' },
  { id: 'PLT-CG-019', industry: 'IND-CG-007', name: 'Bhilai Plot 3', area: 80, coordinates: [[21.1940, 81.3860], [21.1980, 81.3860], [21.1980, 81.3970], [21.1940, 81.3970]], status: 'violation' },
  
  { id: 'PLT-CG-020', industry: 'IND-CG-008', name: 'Jagdalpur Plot 1', area: 130, coordinates: [[20.8370, 81.1800], [20.8410, 81.1800], [20.8410, 81.1930], [20.8370, 81.1930]], status: 'violation' },
  { id: 'PLT-CG-021', industry: 'IND-CG-008', name: 'Jagdalpur Plot 2', area: 120, coordinates: [[20.8420, 81.1800], [20.8460, 81.1800], [20.8460, 81.1930], [20.8420, 81.1930]], status: 'violation' },
  { id: 'PLT-CG-022', industry: 'IND-CG-008', name: 'Jagdalpur Plot 3', area: 110, coordinates: [[20.8370, 81.1940], [20.8410, 81.1940], [20.8410, 81.2070], [20.8370, 81.2070]], status: 'violation' },
];

export const chhattisgarh_centers = {
  'Raigarh': [21.8854, 83.4122],
  'Bilaspur': [21.8040, 82.1502],
  'Durg': [21.1872, 81.2784],
  'Korba': [22.2775, 82.7061],
  'Rajnandgaon': [21.9401, 81.0308],
  'Raipur': [21.2458, 81.6304],
  'Bhilai': [21.1953, 81.3761],
  'Jagdalpur': [20.8385, 81.1827]
};

export const chhattisgarh_state_center = [21.2787, 81.8661]; // Chhattisgarh center
