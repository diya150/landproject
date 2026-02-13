# Industrial Land Monitoring System with Satellite Imagery  

A comprehensive web application for monitoring industrial land plots using real-time satellite imagery (Sentinel 2), AI-powered change detection, and computer vision analysis.

## 🌟 Key Features

### Real-Time Satellite Monitoring
- **Sentinel 2 Integration**: Free satellite data with 10m resolution
- **Multi-Spectral Analysis**: NDVI, NDBI, MNDWI, EVI, BSI indices
- **Multiple Visualization Modes**: RGB, NDVI, False Color imagery
- **5-Day Revisit Frequency**: Regular monitoring capability

### Advanced Change Detection
- **Before/After Comparison**: Interactive slider-based comparison
- **Temporal Analysis**: Track changes over time  
- **Land Use Classification**: Detect urbanization, deforestation, water changes
- **Encroachment Detection**: Identify unauthorized activities
- **AI Confidence Scoring**: Know the reliability of detected changes

### Interactive Maps
- **Satellite Map Visualization**: Leaflet.js-based mapping
- **Plot Boundary Display**: Green rectangle showing plot boundaries
- **Coordinate Information**: Exact location markers with popups
- **Multi-layer Support**: Satellite and street map overlays

### Comprehensive Analysis
- **Violation Detection**: Identify boundary breaches
- **Statistical Summaries**: Aggregate analysis across multiple plots
- **Export Capabilities**: Generate reports in multiple formats
- **Recommendations**: AI-generated action items

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- No additional API keys needed (uses free Copernicus data)

### Installation & Running

```bash
# Install dependencies (both frontend and backend)
npm install

# Backend setup
cd backend
npm install
npm start  # API runs on http://localhost:5000

# Frontend (in new terminal)
cd ..
npm run dev  # Frontend runs on http://localhost:5173
```

Access the application at `http://localhost:5173`

## 📁 Project Structure

```
main_land_project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── analysisController.js
│   │   │   ├── plotController.js
│   │   │   └── satelliteController.js ✨ NEW
│   │   ├── services/
│   │   │   ├── analysisService.js
│   │   │   ├── plotService.js
│   │   │   ├── satelliteService.js ✨ NEW
│   │   │   └── changeDetectionService.js ✨ NEW
│   │   ├── routes/
│   │   │   ├── analysisRoutes.js
│   │   │   ├── plotRoutes.js
│   │   │   └── satelliteRoutes.js ✨ NEW
│   │   └── index.js
│   └── package.json
├── src/
│   ├── components/
│   │   └── dashboard/
│   │       ├── SatelliteMap.tsx ✨ NEW
│   │       └── ...
│   ├── pages/
│   │   ├── ChangeDetection.tsx (Updated)
│   │   └── ...
│   └── main.tsx
├── CHANGE_DETECTION_GUIDE.md ✨ NEW
└── README.md
```

## 🛰️ Satellite Features (NEW)

### Change Detection Page
The enhanced Change Detection page now includes:
- **Real Satellite Imagery**: Live Sentinel 2 data for selected plots
- **Interactive Comparison**: Drag slider to compare before/after
- **Spectral Analysis**: View NDVI, NDBI, MNDWI changes
- **Satellite Map**: See exact plot location and boundaries
- **Data Quality Metrics**: Confidence scores and resolution info

### API Endpoints

**Get Satellite Imagery**
```bash
GET /api/satellite/imagery/:plotId
GET /api/satellite/spectral/ndvi/:plotId
GET /api/satellite/spectral/mndwi/:plotId
GET /api/satellite/spectral/indices/:plotId
GET /api/satellite/spectral/rgb/:plotId
GET /api/satellite/spectral/false-color/:plotId
```

**Detect Changes**
```bash
POST /api/satellite/change-detection/compare
POST /api/satellite/change-detection/temporal
POST /api/satellite/change-detection/land-use
POST /api/satellite/change-detection/encroachment
POST /api/satellite/batch/analyze-area
```

**Available Dates**
```bash
GET /api/satellite/available-dates/:plotId
```

## 🎯 Change Detection Capabilities

### Detected Change Types
1. **Deforestation**: Vegetation loss (NDVI < -0.2)
2. **Afforestation**: Vegetation growth (NDVI > +0.2)
3. **Urbanization**: Built-up area expansion (NDBI > +0.15)
4. **Water Loss**: Water body degradation (MNDWI < -0.1)
5. **Soil Exposure**: Bare land increase (BSI > +0.15)

### Severity Levels
- 🟢 **Low**: Minor changes, routine monitoring
- 🟡 **High**: Significant changes, verification needed
- 🔴 **Critical**: Major violations, immediate action required

### Spectral Indices Used
- **NDVI**: (NIR - Red) / (NIR + Red) - Vegetation
- **NDBI**: (SWIR - NIR) / (SWIR + NIR) - Built-up areas
- **MNDWI**: (Green - SWIR) / (Green + SWIR) - Water
- **EVI**: Enhanced Vegetation Index
- **BSI**: Bare Soil Index

## 📊 Technology Stack

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Vite**: Fast build tool
- **Leaflet**: Interactive mapping
- **react-leaflet**: React wrapper for Leaflet

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **CORS**: Cross-origin support
- **Dotenv**: Environment management
- **Nodemon**: Development hot reload

### Data Sources
- **Sentinel 2 L2A**: Free satellite imagery (Copernicus)
- **Esri World Imagery**: Satellite tile layer
- **OpenStreetMap**: Vector tile layer

## 📚 Documentation

### User Guides
- [Change Detection Guide](./CHANGE_DETECTION_GUIDE.md) - How to use satellite monitoring
- [Satellite Imagery README](./backend/SATELLITE_IMAGERY_README.md) - Technical details

### Backend Documentation
- [Analysis API](./backend/README.md)
- [Integration Examples](./backend/INTEGRATION_EXAMPLE.js)

## 🔐 Data Privacy

- ✅ No API keys required (uses public Copernicus data)
- ✅ No personal data collected
- ✅ All analysis performed locally
- ✅ Satellite data is public domain
- ✅ Compliant with privacy regulations

## 🌍 Free Resources

1. **Sentinel 2 Satellite**: 
   - Resolution: 10m
   - Coverage: Global
   - Revisit: 5 days
   - Cost: Free
   - Source: copernicus.eu

2. **Map Tiles**:
   - Esri World Imagery (licensed)
   - OpenStreetMap (ODbL)

## 🛠️ Development

### Available Scripts

```bash
# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# Backend
cd backend
npm start            # Start server
npm run dev          # Start with nodemon (auto-reload)
```

### Backend Environment Variables (Optional)
Create `.env` file in backend directory:
```
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

## 📈 Performance

- **Image Load**: 2-3 seconds
- **Change Detection**: 1-2 seconds
- **API Response**: <500ms
- **Map Rendering**: Instant

## 🚦 Status Checks

```bash
# Health check
curl http://localhost:5000/health

# API documentation
curl http://localhost:5000/
```

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- ML model integration (YOLOv8)
- Additional spectral indices
- Real-time monitoring alerts
- Mobile app version
- Advanced filtering options

## 📝 License

This project encompasses both proprietary infrastructure monitoring code and integration with Copernicus open data (public domain).

## 🆘 Support

### Common Issues

**Backend Won't Start**
- Ensure port 5000 is available
- Check Node.js version (16+)
- Run `npm install` in backend folder

**Satellite Imagery Missing**
- Check plot coordinates are valid
- Verify date isn't in future
- Current date may have cloud cover

**Map Not Showing**
- Check Leaflet CSS is loaded
- Ensure valid coordinates
- Check browser console for errors

**API Errors**
- Verify backend is running (http://localhost:5000/health)
- Check CORS settings
- Verify all required request fields

## 📧 Contact

For support or questions, refer to the documentation files:
- User Guide: `CHANGE_DETECTION_GUIDE.md`
- Technical Docs: `backend/SATELLITE_IMAGERY_README.md`

---

**Last Updated**: February 2026
**Version**: 1.0.0 with Satellite Imagery Support#   l a n d _ c g  
 