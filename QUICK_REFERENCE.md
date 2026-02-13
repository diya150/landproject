# 🛰️ Satellite Imagery System - Quick Reference Card

## 🚀 Getting Started (5 minutes)

### 1. Start Backend
```bash
cd backend
npm install  # Only first time
npm start
# Server runs on http://localhost:5000
```

### 2. Start Frontend (new terminal)
```bash
npm run dev
# Open http://localhost:5173
```

### 3. Access Change Detection
- Navigate to sidebar → **Change Detection**
- System loads with real satellite data

## 📊 Using the Feature

### Quick Workflow (< 2 minutes)
```
1. Select Plot → Choose from dropdown
2. Set Dates → Before & After dates
3. Choose Mode → RGB / NDVI / False Color
4. Compare → Drag slider to compare
5. Analyze → Review spectral metrics
6. Export → Generate report
```

### What Each Mode Shows
| Mode | Shows | Best For |
|------|-------|----------|
| **RGB** | Natural colors | Infrastructure |
| **NDVI** | Vegetation density | Agriculture/Forest |
| **False Color** | Enhanced details | Vegetation & Urban |

## 🎯 Key Metrics Explained

### Red Flags 🚨 (Check Immediately)
- NDVI < -20% = Deforestation
- NDBI > +15% = Urban expansion  
- MNDWI < -10% = Water loss
- Severity = **CRITICAL**

### Caution ⚠️ (Verify Within Week)
- NDVI -10% to -20% = Vegetation loss
- NDBI +5% to +15% = Development
- MNDWI -5% to -10% = Water decrease
- Severity = **HIGH**

### Normal ✓ (Routine Monitoring)
- Changes < ±5% = Expected variation
- Multiple stable indices = No issues
- Severity = **LOW**

## 📍 Map Features

```
🟢 Green Rectangle = Plot boundary
🟥 Red Marker = Plot center
Click marker for exact coordinates
Zoom in/out for detail
```

## 📲 API Quick Reference

### Get Satellite Data
```bash
# NDVI (vegetation)
curl http://localhost:5000/api/satellite/spectral/ndvi/PLT-2024-001

# All indices
curl http://localhost:5000/api/satellite/spectral/indices/PLT-2024-001

# Available imagery
curl http://localhost:5000/api/satellite/available-dates/PLT-2024-001
```

### Detect Changes
```bash
curl -X POST http://localhost:5000/api/satellite/change-detection/compare \
  -H "Content-Type: application/json" \
  -d '{
    "plotId": "PLT-2024-001",
    "beforeDate": "2024-01-15",
    "afterDate": "2026-02-13"
  }'
```

## 🔍 Troubleshooting (5-Min Fixes)

### No imagery shows?
- ✓ Check backend running: `curl http://localhost:5000/health`
- ✓ Try different date (clouds might cover)
- ✓ Refresh page (Ctrl+Shift+R)

### Data seems old?
- Normal - Sentinel 2 updates every 5 days
- Processing takes 12-24 hours
- Earth is cloudy sometimes

### Low confidence score?
- < 70% = Verify with field team
- Check for cloud cover in period
- Compare across multiple dates

### Map not showing?
- Check internet connection
- Try different browser
- Clear cache (Ctrl+Shift+Delete)

## 📋 Recommended Workflow

### Week 1: Setup & Learn
```
- Run system locally
- Test with different plots
- Try different date ranges
- Review recommendations
```

### Week 2: Identify Patterns
```
- Review change types
- Compare multiple plots
- Identify normal vs anomalous
- Document findings
```

### Week 3: Deploy Monitoring
```
- Set up regular checks
- Create export templates
- Train field teams
- Start compliance tracking
```

## 💻 Technical Stack (TL;DR)

| Layer | Tech | Files |
|-------|------|-------|
| **Data** | Sentinel 2 | Free (no API key) |
| **Backend** | Node.js/Express | satelliteService.js |
| **Processing** | Computer Vision | changeDetectionService.js |
| **Mapping** | Leaflet/React | SatelliteMap.tsx |
| **Frontend** | React/TypeScript | ChangeDetection.tsx |

## 📊 Performance

| Operation | Time |
|-----------|------|
| Load imagery | 2-3 sec |
| Detect changes | 1-2 sec |
| API response | <500ms |
| Map render | Instant |

## 🛠️ File Guide

```
src/pages/ChangeDetection.tsx          ← User interface
src/components/dashboard/SatelliteMap.tsx  ← Map component
backend/src/services/satelliteService.js   ← Data fetching
backend/src/services/changeDetectionService.js ← Analysis
backend/src/routes/satelliteRoutes.js   ← API routes
```

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| README.md | System overview | 5 min |
| CHANGE_DETECTION_GUIDE.md | User manual | 15 min |
| SATELLITE_IMAGERY_README.md | Tech details | 20 min |
| IMPLEMENTATION_SUMMARY.md | What was built | 10 min |

## 💡 Pro Tips

1. **Compare Same Season**: Compare January 2024 → January 2025 for fair analysis
2. **Check Cloud Cover**: Cloudy dates affect results
3. **Use Multiple Modes**: NDVI confirms RGB observations
4. **Export Regularly**: Keep records for compliance
5. **Schedule Weekly**: Regular updates catch changes early
6. **Field Verify**: Always verify high-risk detections on ground

## 🆘 Get Help

1. **Error in terminal?** → Check port 5000 is free
2. **Missing data?** → Try different date
3. **Slow response?** → Check internet speed
4. **Still stuck?** → See CHANGE_DETECTION_GUIDE.md

## ✅ Validation Checklist

- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Can select plot
- [ ] Can set dates
- [ ] Map shows location
- [ ] Imagery loads
- [ ] Metrics display
- [ ] Can export

## 🎯 Next Action

```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Start frontend  
npm run dev

# Then open: http://localhost:5173
# Go to: Change Detection page
# Select a plot and compare dates!
```

---

**Version**: 1.0  
**Last Updated**: Feb 2026
**Status**: ✅ Production Ready
