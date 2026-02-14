# 📊 Encoded Data Decoder & Map Visualizer - Complete Guide

## Overview

The **Encoded Data Decoder** system allows you to:
- ✅ Decode encoded land plot datasets (Base64, Hex, URL encoding)
- ✅ Auto-detect encoding formats automatically
- ✅ Visualize multiple regions on interactive maps
- ✅ Extract and analyze plot information
- ✅ Export decoded data in JSON format

---

## 🎯 Features

### 1. **Multi-Format Support**
- **Base64 Encoding** - Most common format for data transmission
- **Hexadecimal (Hex)** - Alternative encoding method
- **URL Encoding** - Safe transmission format
- **JSON Objects** - Direct structured data
- **Auto-Detection** - System automatically identifies the format

### 2. **Region Management**
- View all plots or filter by specific regions
- Interactive region selection with plot counts
- Dynamic map updates based on selected region

### 3. **Map Visualization**
- Satellite-based geographical maps
- Color-coded plots (active/vacant)
- Plot labels with coordinates
- Zoom and pan capabilities
- Boundary calculations

### 4. **Data Export**
- Download as formatted JSON
- Copy to clipboard
- Full data preservation

---

## 📝 Data Format Specifications

### Required Fields
```json
{
  "id": "plot-001",              // Unique identifier
  "name": "Plot A",               // Display name
  "region": "Abhanpur",          // Region/area name
  "coordinates": [                // GPS coordinates (polygon)
    [21.0665, 81.7390],
    [21.0668, 81.7390],
    [21.0668, 81.7393],
    [21.0665, 81.7393]
  ]
}
```

### Optional Fields
```json
{
  "area": 2500,                   // Size in square meters
  "owner": "Company Name",        // Plot owner
  "status": "active",             // active/vacant/etc
  "compliance": "compliant",      // Compliance status
  "registrationDate": "2024-01-15"
}
```

### Supported Structure Formats

#### Format A: Simple Array
```json
{
  "plots": [
    { "id": 1, "coordinates": [...] },
    { "id": 2, "coordinates": [...] }
  ]
}
```

#### Format B: Regions Object
```json
{
  "regions": {
    "Abhanpur": [
      { "id": 1, "coordinates": [...] },
      { "id": 2, "coordinates": [...] }
    ],
    "Rawabhata": [
      { "id": 3, "coordinates": [...] }
    ]
  }
}
```

---

## 🚀 How to Use

### Step 1: Access the Data Decoder
1. Navigate to your dashboard
2. Click **"Data Decoder"** in the sidebar
3. You'll see the Encoded Data Decoder interface

### Step 2: Provide Encoded Data

#### Option A: Paste Encoded Data
1. Copy your encoded data
2. Paste it into the **"Paste Encoded Data"** text area
3. Click **"🔓 Decode Data"**

#### Option B: Upload File
1. Click **"Load File"** button
2. Select a `.txt`, `.json`, or `.csv` file with encoded data
3. The data will auto-populate in the text area
4. Click **"🔓 Decode Data"**

### Step 3: Review Results
The system will:
- Auto-detect encoding format (Base64/Hex/URL)
- Display success message with format used
- Show summary statistics:
  - Total plots found
  - Number of regions
  - Decoding format used
  - Center coordinates

### Step 4: Visualize on Maps
1. Select **"All Regions"** or choose specific region
2. Interactive map displays with:
   - Plot boundaries (colored polygons)
   - Plot numbers/labels
   - Active/vacant status indicators

### Step 5: Export Data
- Click **"Download as JSON"** to save as file
- Click **"📋 Copy to Clipboard"** to copy formatted data

---

## 🔐 Encoding Examples

### Example 1: Create Base64 Encoded Data

**Original JSON:**
```json
{
  "plots": [
    {
      "id": 1,
      "name": "Plot A",
      "region": "Abhanpur",
      "coordinates": [[21.0665, 81.7390], [21.0668, 81.7390], [21.0668, 81.7393], [21.0665, 81.7393]],
      "area": 2500,
      "owner": "Bhilai Steel",
      "status": "active"
    }
  ]
}
```

**Encode to Base64:**
```bash
# Using Node.js
const data = JSON.stringify({...});
const encoded = Buffer.from(data).toString('base64');
console.log(encoded);
```

**Base64 Output:**
```
eyJwbG90cyI6IFt7ImlkIjogMSwgIm5hbWUiOiAiUGxvdCBBIiwgInJlZ2lvbiI6ICJBY...
```

### Example 2: Create Hex Encoded Data

**Encode to Hex:**
```bash
# Using Node.js
const data = JSON.stringify({...});
const encoded = Buffer.from(data).toString('hex');
console.log(encoded);
```

**Hex Output:**
```
7b22706c6f7473223a205b7b226964223a203120202c226e616d65223a205...
```

---

## 📋 Sample Datasets

### Abhanpur Region (3 plots)
```json
{
  "plots": [
    {
      "id": "AB-001",
      "name": "Abhanpur Plot 1",
      "region": "Abhanpur",
      "coordinates": [[21.0665, 81.7390], [21.0668, 81.7390], [21.0668, 81.7393], [21.0665, 81.7393]],
      "area": 2500,
      "owner": "Bhilai Steel Manufacturing Ltd.",
      "status": "active",
      "compliance": "violation"
    },
    {
      "id": "AB-002",
      "name": "Abhanpur Plot 2",
      "region": "Abhanpur",
      "coordinates": [[21.0662, 81.7390], [21.0665, 81.7390], [21.0665, 81.7393], [21.0662, 81.7393]],
      "area": 2200,
      "owner": "Mahadev Textile Mills",
      "status": "active",
      "compliance": "compliant"
    },
    {
      "id": "AB-003",
      "name": "Abhanpur Plot 3",
      "region": "Abhanpur",
      "coordinates": [[21.0659, 81.7390], [21.0662, 81.7390], [21.0662, 81.7393], [21.0659, 81.7393]],
      "area": 2800,
      "owner": "Sarda Energy and Minerals Ltd",
      "status": "active",
      "compliance": "under-review"
    }
  ]
}
```

### Rawabhata Region (3 plots)
```json
{
  "plots": [
    {
      "id": "RA-001",
      "name": "Rawabhata Plot 1",
      "region": "Rawabhata",
      "coordinates": [[21.3153, 81.6445], [21.3156, 81.6445], [21.3156, 81.6448], [21.3153, 81.6448]],
      "area": 1800,
      "owner": "Industrial Plot A",
      "status": "active",
      "compliance": "compliant"
    },
    {
      "id": "RA-002",
      "name": "Rawabhata Plot 2",
      "region": "Rawabhata",
      "coordinates": [[21.3153, 81.6448], [21.3156, 81.6448], [21.3156, 81.6451], [21.3153, 81.6451]],
      "area": 1800,
      "owner": "Industrial Plot B",
      "status": "active",
      "compliance": "compliant"
    },
    {
      "id": "RA-003",
      "name": "Rawabhata Plot 3",
      "region": "Rawabhata",
      "coordinates": [[21.3150, 81.6445], [21.3153, 81.6445], [21.3153, 81.6448], [21.3150, 81.6448]],
      "area": 1800,
      "owner": "Industrial Plot C",
      "status": "active",
      "compliance": "violation"
    }
  ]
}
```

---

## 🔧 Technical Details

### Supported Coordinate Systems
- **WGS84 (EPSG:4326)** - Standard latitude/longitude
- **Format**: [latitude, longitude]
- **Range**: Lat: -90 to 90, Lng: -180 to 180

### Coordinate Validation
- Coordinates must form closed polygons
- Minimum 3 points per polygon
- Coordinates should be in decimal degrees

### Performance
- Supports up to 10,000+ plots
- Automatic region grouping
- Optimized map rendering
- Client-side processing (no server latency)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to decode" | Check format (Base64/Hex only). No spaces. |
| Map not showing | Verify coordinates are valid [lat, lng]. |
| Regions not appearing | Ensure "region" field exists in each plot. |
| Blank plot labels | Add "id" or "name" field to plots. |
| Slow performance | Reduce plot count or optimize geometry. |

---

## 💡 Tips & Best Practices

1. **Always backup** your original encoded data
2. **Validate** coordinates before uploading (realistic lat/lng values)
3. **Use consistent** region naming across all plots
4. **Include metadata** like owner, area, and status for better analysis
5. **Export frequently** to keep local copies of decoded data

---

## 📞 Support

For issues or feature requests, contact the system administrator.

---

## 📄 License & Attribution

This system is part of the Chhattisgarh Industrial Land Monitoring Platform.
All geodata should be properly attributed and used in compliance with local regulations.
