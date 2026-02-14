import React, { useState, useEffect } from 'react';
import { Zap, Search, Download, Image as ImageIcon, MapPin, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { SatelliteMap } from '../components/dashboard/SatelliteMap';
import { industriesData } from '../lib/industries-data';
import GoogleMapReact from 'google-map-react';



// Region definitions with precise boundaries for real map
const INDUSTRIAL_REGIONS = {
  abhanpur: {
    name: 'Abhanpur Industrial Area – Naya Raipur',
    bounds: {
      north: 21.0689,
      south: 21.0640,
      east: 81.7420,
      west: 81.7383,
      minLat: 21.0640,
      maxLat: 21.0689
    },
    center: { lat: 21.0665, lng: 81.7399 },
    zoom: 15,
    blocks: 42,
    totalPlots: 42,
    area: 2.5,
    description: 'Clustered layout with irregular boundaries'
  },
  rawabhata: {
    name: 'RAWABHATA Industrial Region',
    bounds: {
      north: 21.3175,
      south: 21.3130,
      east: 81.6480,
      west: 81.6420,
      minLat: 21.3130,
      maxLat: 21.3175
    },
    center: { lat: 21.3153, lng: 81.6451 },
    zoom: 14,
    blocks: 65,
    totalPlots: 65,
    area: 4.2,
    description: 'Grid-style layout with geometric boundaries'
  }
};

export function ChangeDetection() {
  const [selectedRegion, setSelectedRegion] = useState('abhanpur');
  const [mapFocus, setMapFocus] = useState<'all' | 'selected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'survey' | 'compare'>('survey');
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [selectedPlotDetails, setSelectedPlotDetails] = useState<{
    id: number;
    area: number;
    status: string;
    center: { lat: number; lng: number };
  } | null>(null);
  
  // Complaint management
  const [selectedCompanyForComplaint, setSelectedCompanyForComplaint] = useState('');
  const [complaintReason, setComplaintReason] = useState('');
  const [complaints, setComplaints] = useState<Array<{
    id: string;
    companyName: string;
    reason: string;
    date: string;
    status: string;
  }>>([]);
  
  // Google Map state
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [googleMapReady, setGoogleMapReady] = useState(false);

  // Industry coordinates mapping (Raipur area)
  const industryCoordinates: Record<string, {lat: number; lng: number}> = {
    'Bhilai Steel Manufacturing Ltd.': { lat: 21.0665, lng: 81.7399 },
    'Chhattisgarh Pharma Industries': { lat: 21.0650, lng: 81.7410 },
    'TechCG Electronics Pvt. Ltd.': { lat: 21.0680, lng: 81.7385 },
    'Mahadev Textile Mills': { lat: 21.0645, lng: 81.7420 },
    'Agro Foods Processing Ltd.': { lat: 21.0670, lng: 81.7405 },
    'InfoTech Solutions Hub': { lat: 21.0655, lng: 81.7390 },
    'ChemTech Industries Pvt. Ltd.': { lat: 21.0675, lng: 81.7415 },
    'AutoParts Manufacturing Co.': { lat: 21.0660, lng: 81.7380 },
    'Green Energy Solutions': { lat: 21.0640, lng: 81.7400 },
    'Precision Tools & Dies Ltd.': { lat: 21.0685, lng: 81.7410 },
    'Sarda Energy and Minerals Ltd': { lat: 21.0658, lng: 81.7395 },
    'Sarthak Metals Ltd': { lat: 21.0672, lng: 81.7402 },
    'Mahamaya Sponge Pvt Ltd': { lat: 21.0648, lng: 81.7388 },
    'Nakoda TMT': { lat: 21.0668, lng: 81.7420 },
    'Bansal Metallics': { lat: 21.0662, lng: 81.7398 },
    'BigMint (Steelmint)': { lat: 21.0670, lng: 81.7408 },
    'Textile Park': { lat: 21.0644, lng: 81.7415 },
    'Plastic Park': { lat: 21.0656, lng: 81.7392 },
    'Rail Park': { lat: 21.0674, lng: 81.7411 },
    'Balod Bharda Industry': { lat: 21.0652, lng: 81.7385 },
    'Barabaspur Industry': { lat: 21.0678, lng: 81.7418 },
    'Parasiya Industry': { lat: 21.0642, lng: 81.7405 },
    'Rikhi Industry': { lat: 21.0666, lng: 81.7396 },
    'Tilda Industry': { lat: 21.0684, lng: 81.7412 },
    'Ulakiya Industry': { lat: 21.0658, lng: 81.7388 },
    'KESDA (Industrial Estate)': { lat: 21.0670, lng: 81.7420 },
    'Beekay Engineering Corporation': { lat: 21.0646, lng: 81.7394 },
  };

  const getIndustryCoordinates = (companyName: string) => {
    return industryCoordinates[companyName] || { lat: 21.0665, lng: 81.7399 };
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedPlot(null);
    setSearchQuery('');
  };

  // Generate smart suggestions
  const getSuggestions = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    industriesData.forEach(industry => {
      // Match company name
      if (industry.companyName.toLowerCase().includes(query)) {
        suggestions.add(industry.companyName);
      }
      // Match industry type
      if (industry.industryType.toLowerCase().includes(query)) {
        suggestions.add(industry.industryType);
      }
      // Match location
      if (industry.location.toLowerCase().includes(query)) {
        suggestions.add(industry.location);
      }
    });
    
    return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
  };

  const suggestions = getSuggestions();

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setShowSuggestions(query.trim().length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion.toLowerCase());
    setShowSuggestions(false);
  };

  const handleRaiseComplaint = () => {
    if (!selectedCompanyForComplaint || !complaintReason.trim()) {
      alert('Please select a company and enter a reason');
      return;
    }

    const newComplaint = {
      id: Date.now().toString(),
      companyName: selectedCompanyForComplaint,
      reason: complaintReason,
      date: new Date().toLocaleDateString(),
      status: 'Open'
    };

    setComplaints([...complaints, newComplaint]);
    setSelectedCompanyForComplaint('');
    setComplaintReason('');
    alert('Complaint raised successfully and added to violation list!');
  };

  // Marker component for Google Map
  const MarkerComponent = ({ id, companyName, isSelected, lat, lng }: { id: string; companyName: string; isSelected: boolean; lat?: number; lng?: number }) => (
    <div
      onClick={() => setSelectedMarker(isSelected ? null : id)}
      className="cursor-pointer"
      title={companyName}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
        isSelected ? 'bg-red-600 scale-125' : 'bg-blue-600 hover:scale-110'
      } transition-all duration-200`}>
        <MapPin className="w-4 h-4" />
      </div>
      {isSelected && (
        <div className="absolute bg-white p-2 rounded shadow-lg text-xs font-medium whitespace-nowrap z-50 left-6 top-0">
          {companyName}
        </div>
      )}
    </div>
  );

  const regionData = INDUSTRIAL_REGIONS[selectedRegion as keyof typeof INDUSTRIAL_REGIONS];
  const regionMarkers = Object.entries(INDUSTRIAL_REGIONS).map(([key, data]) => ({
    id: key,
    name: data.name,
    latitude: data.center.lat,
    longitude: data.center.lng,
    description: `${data.totalPlots} plots • ${data.area.toFixed(1)} km²`
  }));
  const combinedBounds: [[number, number], [number, number]] = [
    [
      Math.min(...Object.values(INDUSTRIAL_REGIONS).map((region) => region.bounds.south)),
      Math.min(...Object.values(INDUSTRIAL_REGIONS).map((region) => region.bounds.west))
    ],
    [
      Math.max(...Object.values(INDUSTRIAL_REGIONS).map((region) => region.bounds.north)),
      Math.max(...Object.values(INDUSTRIAL_REGIONS).map((region) => region.bounds.east))
    ]
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Survey Comparison System</h1>
          <p className="mt-2 text-gray-600">Layered geometric comparison: Old Plan | Drone Survey | Live Satellite</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'survey'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📍 Survey Comparison
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'compare'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🖼️ Visual Compare
          </button>
        </div>

        {/* Tab Content: Survey Comparison */}
        {activeTab === 'survey' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left: Real Satellite Map */}
          <div className="xl:col-span-5 space-y-4 min-w-0">
            <SatelliteMap
              title="Live Satellite Map"
              coordinates={{ latitude: regionData.center.lat, longitude: regionData.center.lng }}
              zoom={regionData.zoom}
              bounds={mapFocus === 'all' ? combinedBounds : undefined}
              markers={regionMarkers}
              industryName={regionData.name}
            />
          </div>

          {/* Right: Survey Comparison */}
          <div className="xl:col-span-7 space-y-5 min-w-0">
            {/* Region Selection & Search */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Industrial Regions & Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar with Smart Suggestions */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search company, industry type, or location..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Search className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-900">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(INDUSTRIAL_REGIONS).map(([key, data]) => (
                    <Button
                      key={key}
                      onClick={() => handleRegionChange(key)}
                      className={`${
                        selectedRegion === key
                          ? 'bg-[#059669] text-white hover:bg-[#059669]/90'
                          : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                      } w-full justify-start`}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {data.name}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setMapFocus('all')}
                    className={`${
                      mapFocus === 'all'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Show Both Regions
                  </Button>
                  <Button
                    onClick={() => setMapFocus('selected')}
                    className={`${
                      mapFocus === 'selected'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Focus Selected
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}

        {/* Selected Plot Details */}
        {/* Industry Search Results with Images */}
        {activeTab === 'survey' && searchQuery && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Industry Search Results: "{searchQuery}"
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {(() => {
                const matchedIndustries = industriesData.filter(industry => 
                  industry.companyName.toLowerCase().includes(searchQuery) ||
                  industry.industryType.toLowerCase().includes(searchQuery) ||
                  industry.location.toLowerCase().includes(searchQuery)
                );

                if (matchedIndustries.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No industries found matching "{searchQuery}"</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchedIndustries.map((industry) => {
                      // Map company name to image filename
                      const getImagePath = (companyName: string) => {
                        const nameMap: Record<string, string> = {
                          'Bhilai Steel Manufacturing Ltd.': 'bhilai steel plant block.png',
                          'Chhattisgarh Pharma Industries': 'chhattisgarh pharma industries.png',
                          'TechCG Electronics Pvt. Ltd.': 'techcg electronics.png',
                          'Mahadev Textile Mills': 'textilepark.industry.png',
                          'Agro Foods Processing Ltd.': 'agro foods.png',
                          'InfoTech Solutions Hub': 'infotech solutions.png',
                          'ChemTech Industries Pvt. Ltd.': 'chemtech industries.png',
                          'AutoParts Manufacturing Co.': 'autoparts manufacturing.png',
                          'Green Energy Solutions': 'green energy.png',
                          'Precision Tools & Dies Ltd.': 'precision tools.png',
                          'Sarda Energy and Minerals Ltd': 'sarda energy and minerals ltd.png',
                          'Sarthak Metals Ltd': 'sarthak metals ltd.png',
                          'Mahamaya Sponge Pvt Ltd': 'mahamaya sponge pvt ltd.png',
                          'Nakoda TMT': 'nakoda tmt.png',
                          'Bansal Metallics': 'bansal metallics.png',
                          'BigMint (Steelmint)': 'bigmint (steelmint).png',
                          'Textile Park': 'textilepark.industry.png',
                          'Plastic Park': 'plasticpark.industry.png',
                          'Rail Park': 'railpark.industry.png',
                          'Balod Bharda Industry': 'balod.bharda.industry.png',
                          'Barabaspur Industry': 'barabaspur.industry.png',
                          'Parasiya Industry': 'parasiya.industry.png',
                          'Rikhi Industry': 'rikhi.industry.png',
                          'Tilda Industry': 'tilda.industry.png',
                          'Ulakiya Industry': 'ulakiya.industry.png',
                          'KESDA (Industrial Estate)': 'kesda.industry.png',
                          'Beekay Engineering Corporation': 'beekay engineering corporation.png',
                        };
                        return nameMap[companyName] || 'default-industry.png';
                      };

                      const imagePath = getImagePath(industry.companyName);

                      return (
                        <div key={industry.id} className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          {/* Industry Image */}
                          <div className="relative bg-gray-200 h-48 overflow-hidden">
                            <img
                              src={`/industry-images/${imagePath}`}
                              alt={industry.companyName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Industry+Image';
                              }}
                            />
                            <div className="absolute top-2 right-2 bg-white p-1 rounded shadow-md">
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                industry.complianceStatus === 'Compliant' ? 'bg-green-100 text-green-800' :
                                industry.complianceStatus === 'Violation' ? 'bg-red-100 text-red-800' :
                                industry.complianceStatus === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {industry.complianceStatus}
                              </span>
                            </div>
                          </div>

                          {/* Industry Details */}
                          <div className="p-4 bg-white">
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{industry.companyName}</h3>
                            
                            <div className="space-y-1 text-sm mb-3">
                              <p className="text-gray-600"><strong>Type:</strong> {industry.industryType}</p>
                              <p className="text-gray-600"><strong>Location:</strong> {industry.location}</p>
                              <p className="text-gray-600"><strong>Area:</strong> {industry.area.toLocaleString()} sqm</p>
                              <p className="text-gray-600"><strong>Employees:</strong> {industry.employeeCount}</p>
                              <p className="text-gray-600"><strong>Revenue:</strong> {industry.annualRevenue}</p>
                            </div>

                            {/* Certifications */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {industry.certifications.slice(0, 2).map((cert, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {cert}
                                </span>
                              ))}
                              {industry.certifications.length > 2 && (
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                  +{industry.certifications.length - 2} more
                                </span>
                              )}
                            </div>

                            {/* Contact Info */}
                            <div className="pt-3 border-t border-gray-200 text-xs text-gray-600">
                              <p>Contact: <strong>{industry.contactPerson}</strong></p>
                              <p className="text-blue-600 break-all">{industry.email}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Tab Content: Visual Compare */}
        {activeTab === 'compare' && (
        <div className="space-y-6">
          {/* Comparison Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(INDUSTRIAL_REGIONS).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => handleRegionChange(key)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedRegion === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {data.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">View Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button
                    onClick={() => setMapFocus('all')}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      mapFocus === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Show All Regions
                  </button>
                  <button
                    onClick={() => setMapFocus('selected')}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      mapFocus === 'selected'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Focus Selected
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Search Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Split View: Satellite Map + Industry Photos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Google Map with Industry Markers */}
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="text-base">🗺️ Google Map View - Search Results</CardTitle>
              </CardHeader>
              <CardContent className="h-80 p-0">
                {(() => {
                  const matchedIndustries = searchQuery
                    ? industriesData.filter(industry => 
                        industry.companyName.toLowerCase().includes(searchQuery) ||
                        industry.industryType.toLowerCase().includes(searchQuery) ||
                        industry.location.toLowerCase().includes(searchQuery)
                      )
                    : industriesData.slice(0, 10);

                  const mapCenter = matchedIndustries.length > 0 
                    ? getIndustryCoordinates(matchedIndustries[0].companyName)
                    : { lat: 21.0665, lng: 81.7399 };

                  return (
                    <div className="w-full h-full bg-gray-100 relative">
                      <GoogleMapReact
                        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyC-qM2j4nPjJGaLJADYfR-VYSFvZ-QHoXo' }}
                        center={mapCenter}
                        defaultZoom={15}
                        yesIWantToUseGoogleMapApiInternals
                      >
                        {matchedIndustries.map((industry) => {
                          const coords = getIndustryCoordinates(industry.companyName);
                          return (
                            <MarkerComponent
                              key={industry.id}
                              id={industry.id}
                              companyName={industry.companyName}
                              isSelected={selectedMarker === industry.id}
                              lat={coords.lat}
                              lng={coords.lng}
                            />
                          );
                        })}
                      </GoogleMapReact>
                      {matchedIndustries.length > 0 && (
                        <div className="absolute top-2 left-2 bg-white px-3 py-2 rounded shadow text-xs text-gray-700 z-10">
                          {matchedIndustries.length} location{matchedIndustries.length !== 1 ? 's' : ''} found
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Right: Industry Photos Grid */}
            <Card className="h-96 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">🖼️ Industry Photos</CardTitle>
              </CardHeader>
              <CardContent className="h-80 overflow-y-auto p-3">
                {(() => {
                  const matchedIndustries = searchQuery
                    ? industriesData.filter(industry => 
                        industry.companyName.toLowerCase().includes(searchQuery) ||
                        industry.industryType.toLowerCase().includes(searchQuery) ||
                        industry.location.toLowerCase().includes(searchQuery)
                      )
                    : industriesData.slice(0, 6);

                  if (matchedIndustries.length === 0) {
                    return (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm">No industries found</p>
                      </div>
                    );
                  }

                  // Map company name to image filename
                  const getImagePath = (companyName: string) => {
                    const nameMap: Record<string, string> = {
                      'Bhilai Steel Manufacturing Ltd.': 'bhilai steel plant block.png',
                      'Chhattisgarh Pharma Industries': 'chhattisgarh pharma industries.png',
                      'TechCG Electronics Pvt. Ltd.': 'techcg electronics.png',
                      'Mahadev Textile Mills': 'textilepark.industry.png',
                      'Agro Foods Processing Ltd.': 'agro foods.png',
                      'InfoTech Solutions Hub': 'infotech solutions.png',
                      'ChemTech Industries Pvt. Ltd.': 'chemtech industries.png',
                      'AutoParts Manufacturing Co.': 'autoparts manufacturing.png',
                      'Green Energy Solutions': 'green energy.png',
                      'Precision Tools & Dies Ltd.': 'precision tools.png',
                      'Sarda Energy and Minerals Ltd': 'sarda energy and minerals ltd.png',
                      'Sarthak Metals Ltd': 'sarthak metals ltd.png',
                      'Mahamaya Sponge Pvt Ltd': 'mahamaya sponge pvt ltd.png',
                      'Nakoda TMT': 'nakoda tmt.png',
                      'Bansal Metallics': 'bansal metallics.png',
                      'BigMint (Steelmint)': 'bigmint (steelmint).png',
                      'Textile Park': 'textilepark.industry.png',
                      'Plastic Park': 'plasticpark.industry.png',
                      'Rail Park': 'railpark.industry.png',
                      'Balod Bharda Industry': 'balod.bharda.industry.png',
                      'Barabaspur Industry': 'barabaspur.industry.png',
                      'Parasiya Industry': 'parasiya.industry.png',
                      'Rikhi Industry': 'rikhi.industry.png',
                      'Tilda Industry': 'tilda.industry.png',
                      'Ulakiya Industry': 'ulakiya.industry.png',
                      'KESDA (Industrial Estate)': 'kesda.industry.png',
                      'Beekay Engineering Corporation': 'beekay engineering corporation.png',
                    };
                    return nameMap[companyName] || 'default-industry.png';
                  };

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchedIndustries.map((industry) => {
                        const imagePath = getImagePath(industry.companyName);

                        return (
                          <div key={industry.id} className="group cursor-pointer">
                            <div className="relative bg-gray-300 rounded h-28 overflow-hidden">
                              <img
                                src={`/industry-images/${imagePath}`}
                                alt={industry.companyName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Industry';
                                }}
                              />
                              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-xs font-semibold line-clamp-2">{industry.companyName}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detailed Industry Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold">Company</th>
                      <th className="text-left px-4 py-2 font-semibold">Type</th>
                      <th className="text-left px-4 py-2 font-semibold">Location</th>
                      <th className="text-left px-4 py-2 font-semibold">Area</th>
                      <th className="text-left px-4 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const matchedIndustries = searchQuery
                        ? industriesData.filter(industry => 
                            industry.companyName.toLowerCase().includes(searchQuery) ||
                            industry.industryType.toLowerCase().includes(searchQuery) ||
                            industry.location.toLowerCase().includes(searchQuery)
                          )
                        : industriesData.slice(0, 8);

                      return matchedIndustries.map((industry) => (
                        <tr key={industry.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{industry.companyName}</td>
                          <td className="px-4 py-3">{industry.industryType}</td>
                          <td className="px-4 py-3">{industry.location}</td>
                          <td className="px-4 py-3">{industry.area.toLocaleString()} sqm</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              industry.complianceStatus === 'Compliant' ? 'bg-green-100 text-green-800' :
                              industry.complianceStatus === 'Violation' ? 'bg-red-100 text-red-800' :
                              industry.complianceStatus === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {industry.complianceStatus}
                            </span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

      </div>
    </div>
  );
}
