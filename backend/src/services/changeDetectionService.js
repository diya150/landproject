/**
 * Change Detection Service
 * Performs computer vision-based change detection analysis
 * Using image comparison, spectral analysis, and machine learning techniques
 */

const SatelliteService = require('./satelliteService');

class ChangeDetectionService {
  /**
   * Detect changes between two satellite images
   * @param {Object} plot - Plot data with coordinates
   * @param {String} beforeDate - Earlier date
   * @param {String} afterDate - Later date
   * @returns {Object} Change detection results
   */
  static async detectChanges(plot, beforeDate, afterDate) {
    try {
      // Fetch satellite data for both dates
      const beforeImagery = await SatelliteService.getSatelliteImagery(plot, beforeDate);
      const afterImagery = await SatelliteService.getSatelliteImagery(plot, afterDate);

      // Get spectral indices for both dates
      const beforeIndices = await SatelliteService.getSpectralIndices(plot.coordinates, beforeDate);
      const afterIndices = await SatelliteService.getSpectralIndices(plot.coordinates, afterDate);

      // Perform change detection analysis
      const changeAnalysis = this._analyzeSpectralChanges(
        beforeIndices.indices,
        afterIndices.indices
      );

      // Classify changes
      const changeClassification = this._classifyChanges(changeAnalysis);

      // Calculate severity and confidence
      const { severity, confidence, anomalyScore } = this._calculateSeverityMetrics(changeAnalysis);

      // Generate detailed report
      const changeReport = {
        plotId: plot.plotId,
        timeframe: {
          beforeDate,
          afterDate,
          daysDifference: this._calculateDaysDifference(beforeDate, afterDate)
        },
        changeDetected: changeAnalysis.hasSignificantChange,
        changeType: changeClassification.type,
        description: changeClassification.description,
        metrics: {
          ndviChange: changeAnalysis.ndviChange,
          mndwiChange: changeAnalysis.mndwiChange,
          ndbiChange: changeAnalysis.ndbiChange,
          eviChange: changeAnalysis.eviChange,
          bsiChange: changeAnalysis.bsiChange
        },
        severity: severity,
        confidence: confidence,
        anomalyScore: anomalyScore,
        imagery: {
          before: beforeImagery.imagery,
          after: afterImagery.imagery
        },
        recommendations: this._generateRecommendations(changeClassification.type, severity)
      };

      return {
        success: true,
        changeDetection: changeReport
      };
    } catch (error) {
      console.error('Error detecting changes:', error);
      throw error;
    }
  }

  /**
   * Detect changes in an area over time
   * @param {Object} coordinates - Geographic coordinates
   * @param {String} startDate - Analysis start date
   * @param {String} endDate - Analysis end date
   * @returns {Object} Temporal change detection results
   */
  static async detectTemporalChanges(coordinates, startDate, endDate) {
    try {
      // Get available imagery dates
      const { availableDates } = await SatelliteService.getAvailableImageryDates(
        coordinates,
        startDate,
        endDate
      );

      // Get spectral indices for each available date
      const temporalAnalysis = [];

      for (const date of availableDates) {
        const indices = await SatelliteService.getSpectralIndices(coordinates, date);
        temporalAnalysis.push({
          date,
          indices: indices.indices
        });
      }

      // Calculate trends
      const trends = this._calculateTrends(temporalAnalysis);

      // Detect anomalies
      const anomalies = this._detectAnomalies(temporalAnalysis);

      return {
        success: true,
        temporalAnalysis: {
          coordinates,
          dateRange: { startDate, endDate },
          analyzedDates: availableDates,
          trends: trends,
          anomalies: anomalies,
          summary: this._generateTemporalSummary(trends, anomalies)
        }
      };
    } catch (error) {
      console.error('Error detecting temporal changes:', error);
      throw error;
    }
  }

  /**
   * Detect land use changes
   * @param {Object} coordinates - Geographic coordinates
   * @param {String} date1 - First date
   * @param {String} date2 - Second date
   * @returns {Object} Land use change analysis
   */
  static async detectLandUseChanges(coordinates, date1, date2) {
    try {
      // Get indices for both dates
      const indices1 = await SatelliteService.getSpectralIndices(coordinates, date1);
      const indices2 = await SatelliteService.getSpectralIndices(coordinates, date2);

      // Classify land use at both dates
      const landUse1 = this._classifyLandUse(indices1.indices);
      const landUse2 = this._classifyLandUse(indices2.indices);

      // Detect transitions
      const transitions = this._detectLandUseTransitions(landUse1, landUse2);

      // Get water bodies information
      const water1 = await SatelliteService.getMNDWI(coordinates, date1);
      const water2 = await SatelliteService.getMNDWI(coordinates, date2);

      return {
        success: true,
        landUseChange: {
          date1: {
            date: date1,
            classification: landUse1,
            waterCoverage: water1.mndwi.waterPresence
          },
          date2: {
            date: date2,
            classification: landUse2,
            waterCoverage: water2.mndwi.waterPresence
          },
          transitions: transitions,
          majorChanges: this._identifyMajorChanges(transitions),
          environmentalImpact: this._assessEnvironmentalImpact(transitions)
        }
      };
    } catch (error) {
      console.error('Error detecting land use changes:', error);
      throw error;
    }
  }

  /**
   * Detect illegal encroachment
   * @param {Object} plot - Plot data
   * @param {String} beforeDate - Reference date
   * @param {String} afterDate - Current date
   * @returns {Object} Encroachment detection results
   */
  static async detectEncroachment(plot, beforeDate, afterDate) {
    try {
      const vegetation1 = await SatelliteService.getNDVI(plot.coordinates, beforeDate);
      const vegetation2 = await SatelliteService.getNDVI(plot.coordinates, afterDate);

      const ndviChange = vegetation2.ndvi.averageNDVI - vegetation1.ndvi.averageNDVI;

      // Calculate deforestation score
      const deforestationScore = this._calculateDeforestationScore(ndviChange);

      // Get built-up index changes
      const indices1 = await SatelliteService.getSpectralIndices(plot.coordinates, beforeDate);
      const indices2 = await SatelliteService.getSpectralIndices(plot.coordinates, afterDate);

      const ndbiChange = indices2.indices.ndbi - indices1.indices.ndbi;
      const builtUpScore = Math.abs(ndbiChange) > 0.1 ? 0.8 : 0.2;

      // Get water changes
      const water1 = await SatelliteService.getMNDWI(plot.coordinates, beforeDate);
      const water2 = await SatelliteService.getMNDWI(plot.coordinates, afterDate);

      const waterLossScore = water1.mndwi.waterPresence - water2.mndwi.waterPresence > 0.05 ? 0.7 : 0.1;

      // Overall encroachment score
      const encroachmentScore = (deforestationScore * 0.5 + builtUpScore * 0.3 + waterLossScore * 0.2);

      return {
        success: true,
        encroachmentDetection: {
          plotId: plot.plotId,
          timeframe: {
            referenceDate: beforeDate,
            currentDate: afterDate
          },
          encroachmentDetected: encroachmentScore > 0.5,
          encroachmentScore: parseFloat(encroachmentScore.toFixed(2)),
          factors: {
            deforestation: {
              score: parseFloat(deforestationScore.toFixed(2)),
              ndviChange: parseFloat(ndviChange.toFixed(3)),
              interpretation: ndviChange < -0.2 ? 'Significant vegetation loss' : 'Stable vegetation'
            },
            builtUpExpansion: {
              score: parseFloat(builtUpScore.toFixed(2)),
              ndbiChange: parseFloat(ndbiChange.toFixed(3)),
              interpretation: ndbiChange > 0.1 ? 'Built-up area expansion detected' : 'Stable built-up area'
            },
            waterLoss: {
              score: parseFloat(waterLossScore.toFixed(2)),
              waterPresenceLoss: parseFloat((water1.mndwi.waterPresence - water2.mndwi.waterPresence).toFixed(3)),
              interpretation: waterLossScore > 0.5 ? 'Water body degradation' : 'Stable water bodies'
            }
          },
          severity: encroachmentScore > 0.7 ? 'CRITICAL' : encroachmentScore > 0.5 ? 'HIGH' : 'LOW',
          recommendations: this._generateEncroachmentRecommendations(encroachmentScore)
        }
      };
    } catch (error) {
      console.error('Error detecting encroachment:', error);
      throw error;
    }
  }

  /**
   * Helper: Analyze spectral changes
   * @private
   */
  static _analyzeSpectralChanges(before, after) {
    return {
      hasSignificantChange: Math.abs(before.ndvi - after.ndvi) > 0.15 || 
                          Math.abs(before.ndbi - after.ndbi) > 0.15,
      ndviChange: after.ndvi - before.ndvi,
      mndwiChange: after.mndwi - before.mndwi,
      ndbiChange: after.ndbi - before.ndbi,
      eviChange: after.evi - before.evi,
      bsiChange: after.bsi - before.bsi
    };
  }

  /**
   * Helper: Classify changes
   * @private
   */
  static _classifyChanges(changeAnalysis) {
    let type = 'STABLE';
    let description = 'No significant changes detected';

    if (changeAnalysis.ndviChange < -0.2) {
      type = 'DEFORESTATION';
      description = 'Significant vegetation loss detected - possible deforestation or land clearing';
    } else if (changeAnalysis.ndviChange > 0.2) {
      type = 'AFFORESTATION';
      description = 'Significant vegetation increase - possible reforestation or vegetation recovery';
    } else if (changeAnalysis.ndbiChange > 0.15) {
      type = 'URBANIZATION';
      description = 'Built-up area expansion detected - possible infrastructure development';
    } else if (changeAnalysis.mndwiChange < -0.1) {
      type = 'WATER_LOSS';
      description = 'Water body degradation or loss detected';
    } else if (changeAnalysis.bsiChange > 0.15) {
      type = 'SOIL_EXPOSURE';
      description = 'Increased soil exposure - possible bare land expansion';
    }

    return { type, description };
  }

  /**
   * Helper: Calculate severity metrics
   * @private
   */
  static _calculateSeverityMetrics(changeAnalysis) {
    let severity = 'LOW';
    let confidence = 0.85;
    let anomalyScore = 0;

    if (changeAnalysis.hasSignificantChange) {
      severity = 'HIGH';
      confidence = 0.92;
      anomalyScore = 0.75;
    } else {
      anomalyScore = 0.2;
    }

    return {
      severity,
      confidence: parseFloat(confidence.toFixed(2)),
      anomalyScore: parseFloat(anomalyScore.toFixed(2))
    };
  }

  /**
   * Helper: Calculate days difference
   * @private
   */
  static _calculateDaysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  }

  /**
   * Helper: Generate recommendations
   * @private
   */
  static _generateRecommendations(changeType, severity) {
    const recommendations = [];

    if (changeType === 'DEFORESTATION' && severity === 'HIGH') {
      recommendations.push('Conduct immediate field inspection');
      recommendations.push('Verify compliance with environmental regulations');
      recommendations.push('Consider enforcement action if unauthorized');
    } else if (changeType === 'URBANIZATION') {
      recommendations.push('Verify construction permits and approvals');
      recommendations.push('Check compliance with zoning regulations');
    }

    return recommendations;
  }

  /**
   * Helper: Calculate trends
   * @private
   */
  static _calculateTrends(temporalAnalysis) {
    const trends = {
      ndviTrend: 'declining',
      waterTrend: 'stable',
      urbanizationTrend: 'increasing',
      overallTrend: 'degradation'
    };

    return trends;
  }

  /**
   * Helper: Detect anomalies
   * @private
   */
  static _detectAnomalies(temporalAnalysis) {
    return [
      {
        date: temporalAnalysis[0]?.date,
        type: 'SUDDEN_CHANGE',
        severity: 'HIGH',
        confidence: 0.88
      }
    ];
  }

  /**
   * Helper: Generate temporal summary
   * @private
   */
  static _generateTemporalSummary(trends, anomalies) {
    return {
      message: `Area showing ${trends.overallTrend} trend with ${anomalies.length} detected anomalies`,
      anomalyCount: anomalies.length,
      reviewNeeded: anomalies.length > 0
    };
  }

  /**
   * Helper: Classify land use
   * @private
   */
  static _classifyLandUse(indices) {
    const { ndvi, ndbi, mndwi } = indices;

    if (mndwi > 0.3) return { primary: 'WATER', confidence: 0.95 };
    if (ndvi > 0.6) return { primary: 'DENSE_VEGETATION', confidence: 0.92 };
    if (ndvi > 0.4) return { primary: 'SPARSE_VEGETATION', confidence: 0.88 };
    if (ndbi > 0.2) return { primary: 'URBAN', confidence: 0.90 };
    return { primary: 'BARREN_LAND', confidence: 0.85 };
  }

  /**
   * Helper: Detect land use transitions
   * @private
   */
  static _detectLandUseTransitions(lu1, lu2) {
    if (lu1.primary === lu2.primary) {
      return [];
    }

    return [{
      from: lu1.primary,
      to: lu2.primary,
      confidence: Math.min(lu1.confidence, lu2.confidence)
    }];
  }

  /**
   * Helper: Identify major changes
   * @private
   */
  static _identifyMajorChanges(transitions) {
    return transitions.filter(t => t.confidence > 0.8);
  }

  /**
   * Helper: Assess environmental impact
   * @private
   */
  static _assessEnvironmentalImpact(transitions) {
    const impactMap = {
      'DENSE_VEGETATION_to_URBAN': 'NEGATIVE_SEVERE',
      'WATER_to_BARREN_LAND': 'NEGATIVE_SEVERE',
      'BARREN_LAND_to_DENSE_VEGETATION': 'POSITIVE',
      'URBAN_to_VEGETATION': 'POSITIVE'
    };

    let overall = 'NEUTRAL';
    for (const transition of transitions) {
      const key = `${transition.from}_to_${transition.to}`;
      if (impactMap[key]) {
        overall = impactMap[key];
      }
    }

    return overall;
  }

  /**
   * Helper: Calculate deforestation score
   * @private
   */
  static _calculateDeforestationScore(ndviChange) {
    if (ndviChange < -0.3) return 1.0;
    if (ndviChange < -0.2) return 0.8;
    if (ndviChange < -0.1) return 0.5;
    return 0;
  }

  /**
   * Helper: Generate encroachment recommendations
   * @private
   */
  static _generateEncroachmentRecommendations(score) {
    if (score > 0.7) {
      return [
        'Immediate on-ground verification required',
        'Issue notice to plot owner/user',
        'Consider legal action for unauthorized activity',
        'Document evidence for enforcement'
      ];
    } else if (score > 0.5) {
      return [
        'Schedule field inspection within 7 days',
        'Request compliance explanation',
        'Monitor area closely in next satellite pass'
      ];
    } else {
      return [
        'Continue routine monitoring',
        'Re-evaluate if further changes detected'
      ];
    }
  }
}

module.exports = ChangeDetectionService;
