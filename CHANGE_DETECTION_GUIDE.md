# Change Detection User Guide

## Quick Start

### Accessing the Change Detection Page
1. Navigate to the application dashboard
2. Click on **"Change Detection"** in the left navigation menu
3. The page loads with real-time satellite data

### Basic Workflow

#### Step 1: Select a Plot
- Use the **"Select Plot"** dropdown at the top
- Choose from available plots (PLT-2024-001, PLT-2024-005, etc.)
- The map automatically updates to show the plot location

#### Step 2: Set Date Range
- **Before Date**: Reference date (earlier capture)
- **After Date**: Comparison date (recent capture)
- Default range is 1 year for trend analysis

#### Step 3: Choose Visualization Mode
- **RGB True Color**: Standard satellite view (natural colors)
- **NDVI Vegetation**: Green=vegetation, Red=bare soil
- **False Color (NIR)**: Red=vegetation, Blue=vegetation, Cyan=water

#### Step 4: Analyze Results
- Drag the **slider** to compare before/after images
- Review **Spectral Change Metrics** showing index changes
- Check **Data Quality** for confidence and resolution info
- Read **Analysis & Recommendations** for actionable insights

### Understanding the Metrics

#### Summary Cards
| Metric | Meaning |
|--------|---------|
| Detection Status | Whether changes were detected (Active/Stable) |
| Change Type | Type of detected change (Vegetation, Urban, etc.) |
| Severity Level | Risk assessment (Low/High/Critical) |
| Anomaly Score | Likelihood of violation (0-100%) |

#### Spectral Indices
- **NDVI Change**: Vegetation health changes (+positive = greener)
- **NDBI Change**: Urban expansion (+positive = more buildings)
- **MNDWI Change**: Water coverage (+positive = more water)
- **EVI Change**: Enhanced vegetation indicator
- **BSI Change**: Exposed soil (+positive = more bare soil)

### Interpreting Results

#### Green Indicators (Good)
- ✓ Stable values indicate no major changes
- ✓ NDVI increasing = vegetation recovery
- ✓ MNDWI stable = water bodies protected

#### Yellow/Amber Alerts (Caution)
- ⚠️ Moderate NDVI decrease = possible vegetation loss
- ⚠️ NDBI increase = possible development
- ⚠️ Seasonal changes (normal in agriculture)

#### Red Flags (Critical)
- 🚨 Sudden vegetation loss > 20%
- 🚨 Rapid urban expansion
- 🚨 Water body degradation
- 🚨 Deforestation patterns

### Interactive Features

#### Slider Comparison
- Drag the vertical slider left/right to compare images
- Left side shows "BEFORE" date
- Right side shows "AFTER" date
- Anomalies marked with red circles

#### Satellite Map
- Shows exact plot location
- Green rectangle = plot boundary
- Center marker = plot center point
- Click marker for coordinates

#### Tooltips
- Hover over any metric for more details
- View data source and confidence scores
- Check temporal coverage

### Common Use Cases

#### Case 1: Monitor Industrial Expansion
1. Select plot with industrial area
2. Set dates 6 months apart
3. Check NDBI change (built-up index)
4. Review satellite imagery

**Expected Results**: NDBI increase indicates new construction

#### Case 2: Track Deforestation
1. Select agricultural/forest plot
2. Set dates 3-12 months apart
3. Focus on NDVI values
4. Cross-reference with satellite images

**Expected Results**: Negative NDVI change indicates tree loss

#### Case 3: Verify Water Body Status
1. Select plot near water body
2. Set dates 6 months apart
3. Check MNDWI values
4. Look for water body changes

**Expected Results**: Stable MNDWI indicates protected water

#### Case 4: Check Land Use Changes
1. Select plot suspected of illegal activity
2. Set dates 1-2 years apart
3. Review all spectral indices
4. Check recommendations

**Expected Results**: Multiple negative indices suggest land conversion

### Tips & Best Practices

1. **Date Selection**
   - Use at least 3-month intervals for significant changes
   - Avoid cloud-filled dates (check availability)
   - Account for seasonal variations

2. **Multi-ViewMode Analysis**
   - Compare same plot in RGB and NDVI modes
   - False Color mode best for vegetation
   - RGB mode best for infrastructure

3. **Understanding Confidence**
   - 90%+ confidence: High reliability
   - 70-90%: Good reliability
   - 50-70%: Moderate, verify with ground truth
   - <50%: Low confidence, needs field verification

4. **Seasonal Considerations**
   - Summer typically shows higher NDVI
   - Winter shows lower vegetation indices
   - Agricultural areas seasonal variations
   - Urban areas relatively stable

5. **Report Generation**
   - Use "Export Report" button for documentation
   - Include date range and findings
   - Share with field teams for verification
   - Archive for compliance records

### Troubleshooting

#### Q: No imagery appears
**A:** 
- Check internet connection
- Try different date (cloud cover may block)
- Refresh page
- Ensure plot exists in system

#### Q: High anomaly score but no visible changes
**A:**
- Sensor noise or calibration effects
- Small-scale changes not visible at 10m resolution
- Recommend field verification
- Check temporal trends over longer period

#### Q: Satellite data seems older than expected
**A:**
- Sentinel 2 has 5-day revisit time
- Cloud cover delays processing
- Processing takes 12-24 hours
- Data is rarely real-time

#### Q: Different results on different dates for same plot
**A:**
- Normal - atmospheric conditions vary
- Cloud shadows affect readings
- Seasonal changes occur
- Compare similar dates across years for fair comparison

### Exporting Your Analysis

1. Click **"Export Report"** button
2. Choose report format:
   - PDF (with maps and charts)
   - CSV (raw data)
   - GeoJSON (boundaries)
   - JSON (full analysis)

3. Include in your documentation:
   - Date range analyzed
   - Severity assessment
   - Change type identified
   - Recommendations
   - Confidence score

### Next Steps After Analysis

1. **Low Risk**: Schedule quarterly check
2. **Medium Risk**: 
   - Send compliance notice
   - Schedule verification visit within 1 month
3. **High/Critical Risk**:
   - Immediate field inspection required
   - Consider enforcement action
   - Document findings with photos/videos

### Data Accuracy Notes

- **Resolution**: 10 meters (size of pixel)
- **Accuracy**: ±50-100 meters for features
- **Temporal Frequency**: Every 5 days
- **Cloud Coverage**: Varies by location/season
- **Processing Time**: 12-24 hours from capture

### Support

For questions or issues:
- Check the main README.md
- Review SATELLITE_IMAGERY_README.md for technical details
- Contact support team with troubleshooting steps
- Include plot ID and date range in reports
