/**
 * Reference Plot Data - Approved/Old Land Records
 * This represents the officially approved boundaries and areas for industrial plots
 */

const referencePlots = [
  {
    plotId: 'PLT-001',
    industryName: 'Steel Manufacturing Corp',
    industryType: 'Steel & Iron',
    approvedBoundary: [
      { lat: 28.5355, lng: 77.3910 },
      { lat: 28.5365, lng: 77.3910 },
      { lat: 28.5365, lng: 77.3925 },
      { lat: 28.5355, lng: 77.3925 }
    ],
    approvedArea: 15000, // in square meters
    registrationDate: '2020-03-15',
    licenseNumber: 'IND-2020-001',
    category: 'Heavy Industry'
  },
  {
    plotId: 'PLT-002',
    industryName: 'Pharma Solutions Ltd',
    industryType: 'Pharmaceuticals',
    approvedBoundary: [
      { lat: 28.5370, lng: 77.3930 },
      { lat: 28.5382, lng: 77.3930 },
      { lat: 28.5382, lng: 77.3948 },
      { lat: 28.5370, lng: 77.3948 }
    ],
    approvedArea: 22000,
    registrationDate: '2019-07-22',
    licenseNumber: 'IND-2019-045',
    category: 'Pharmaceuticals'
  },
  {
    plotId: 'PLT-003',
    industryName: 'Green Textiles Inc',
    industryType: 'Textiles',
    approvedBoundary: [
      { lat: 28.5345, lng: 77.3950 },
      { lat: 28.5355, lng: 77.3950 },
      { lat: 28.5355, lng: 77.3965 },
      { lat: 28.5345, lng: 77.3965 }
    ],
    approvedArea: 12000,
    registrationDate: '2021-01-10',
    licenseNumber: 'IND-2021-012',
    category: 'Textiles'
  },
  {
    plotId: 'PLT-004',
    industryName: 'AutoParts Manufacturing',
    industryType: 'Automobile',
    approvedBoundary: [
      { lat: 28.5385, lng: 77.3955 },
      { lat: 28.5400, lng: 77.3955 },
      { lat: 28.5400, lng: 77.3975 },
      { lat: 28.5385, lng: 77.3975 }
    ],
    approvedArea: 28000,
    registrationDate: '2018-11-05',
    licenseNumber: 'IND-2018-078',
    category: 'Manufacturing'
  },
  {
    plotId: 'PLT-005',
    industryName: 'Chemical Industries Pvt Ltd',
    industryType: 'Chemicals',
    approvedBoundary: [
      { lat: 28.5320, lng: 77.3900 },
      { lat: 28.5335, lng: 77.3900 },
      { lat: 28.5335, lng: 77.3920 },
      { lat: 28.5320, lng: 77.3920 }
    ],
    approvedArea: 18500,
    registrationDate: '2020-09-18',
    licenseNumber: 'IND-2020-089',
    category: 'Chemicals'
  },
  {
    plotId: 'PLT-006',
    industryName: 'Electronics Assembly Co',
    industryType: 'Electronics',
    approvedBoundary: [
      { lat: 28.5405, lng: 77.3980 },
      { lat: 28.5415, lng: 77.3980 },
      { lat: 28.5415, lng: 77.3995 },
      { lat: 28.5405, lng: 77.3995 }
    ],
    approvedArea: 10000,
    registrationDate: '2022-02-14',
    licenseNumber: 'IND-2022-023',
    category: 'Electronics'
  },
  {
    plotId: 'PLT-007',
    industryName: 'Food Processing Units',
    industryType: 'Food & Beverages',
    approvedBoundary: [
      { lat: 28.5360, lng: 77.3970 },
      { lat: 28.5372, lng: 77.3970 },
      { lat: 28.5372, lng: 77.3988 },
      { lat: 28.5360, lng: 77.3988 }
    ],
    approvedArea: 16500,
    registrationDate: '2021-06-20',
    licenseNumber: 'IND-2021-056',
    category: 'Food Processing'
  },
  {
    plotId: 'PLT-008',
    industryName: 'Paper Mill Industries',
    industryType: 'Paper & Pulp',
    approvedBoundary: [
      { lat: 28.5340, lng: 77.3935 },
      { lat: 28.5352, lng: 77.3935 },
      { lat: 28.5352, lng: 77.3950 },
      { lat: 28.5340, lng: 77.3950 }
    ],
    approvedArea: 14000,
    registrationDate: '2019-12-08',
    licenseNumber: 'IND-2019-112',
    category: 'Paper & Pulp'
  },
  {
    plotId: 'PLT-009',
    industryName: 'Plastic Manufacturing Hub',
    industryType: 'Plastics',
    approvedBoundary: [
      { lat: 28.5420, lng: 77.4000 },
      { lat: 28.5435, lng: 77.4000 },
      { lat: 28.5435, lng: 77.4020 },
      { lat: 28.5420, lng: 77.4020 }
    ],
    approvedArea: 25000,
    registrationDate: '2020-05-25',
    licenseNumber: 'IND-2020-067',
    category: 'Plastics'
  },
  {
    plotId: 'PLT-010',
    industryName: 'Cement Factory Ltd',
    industryType: 'Cement',
    approvedBoundary: [
      { lat: 28.5310, lng: 77.3880 },
      { lat: 28.5328, lng: 77.3880 },
      { lat: 28.5328, lng: 77.3905 },
      { lat: 28.5310, lng: 77.3905 }
    ],
    approvedArea: 32000,
    registrationDate: '2018-04-12',
    licenseNumber: 'IND-2018-034',
    category: 'Heavy Industry'
  }
];

module.exports = referencePlots;
