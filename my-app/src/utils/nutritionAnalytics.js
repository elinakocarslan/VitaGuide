// Simple k-means clustering implementation
class KMeansCluster {
  constructor(k = 3) {
    this.k = k;
    this.clusters = [];
    this.means = [];
    this.assignments = [];
  }

  // Calculate Euclidean distance between two points
  distance(pointA, pointB) {
    return Math.sqrt(
      Object.keys(pointA).reduce((sum, key) => {
        if (typeof pointA[key] === 'number') {
          return sum + Math.pow(pointA[key] - pointB[key], 2);
        }
        return sum;
      }, 0)
    );
  }

  // Initialize means with random points
  initializeMeans(points) {
    const numFeatures = Object.keys(points[0]).length;
    this.means = Array(this.k).fill().map(() => {
      const mean = {};
      Object.keys(points[0]).forEach(key => {
        if (typeof points[0][key] === 'number') {
          mean[key] = Math.random() * 100;
        }
      });
      return mean;
    });
  }

  // Assign points to nearest cluster
  assign(points) {
    this.assignments = points.map(point => {
      const distances = this.means.map(mean => this.distance(point, mean));
      return distances.indexOf(Math.min(...distances));
    });
  }

  // Update means based on assignments
  update(points) {
    const sums = Array(this.k).fill().map(() => ({}));
    const counts = Array(this.k).fill(0);

    points.forEach((point, i) => {
      const assignment = this.assignments[i];
      counts[assignment]++;
      
      Object.keys(point).forEach(key => {
        if (typeof point[key] === 'number') {
          sums[assignment][key] = (sums[assignment][key] || 0) + point[key];
        }
      });
    });

    this.means = sums.map((sum, i) => {
      const mean = {};
      Object.keys(sum).forEach(key => {
        mean[key] = sum[key] / counts[i];
      });
      return mean;
    });
  }

  // Run clustering algorithm
  run(points, iterations = 10) {
    this.initializeMeans(points);

    for (let i = 0; i < iterations; i++) {
      this.assign(points);
      this.update(points);
    }

    return this.assignments;
  }
}

// Feature extraction from survey data
function extractFeatures(surveyData) {
  return {
    dietaryDiversity: calculateDietaryDiversity(surveyData),
    sampleSize: normalizeSampleSize(surveyData['Sample size']),
    year: normalizeYear(surveyData.Year),
    methodScore: assessMethodScore(surveyData['Dietary assessment method']),
    coverageScore: assessCoverageScore(surveyData.Representativeness)
  };
}

function calculateDietaryDiversity(data) {
  if (!data['Available dietary factors']) return 0;
  return data['Available dietary factors'].split('|').length / 20; // Normalize by max possible factors
}

function normalizeSampleSize(size) {
  if (!size) return 0;
  const numSize = parseInt(size);
  return Math.min(numSize / 10000, 1); // Normalize to 0-1 range
}

function normalizeYear(year) {
  if (!year) return 0;
  return (parseInt(year) - 1980) / (2024 - 1980); // Normalize between 1980-2024
}

function assessMethodScore(method) {
  const methodScores = {
    'Multiple Recall': 1.0,
    'Single Recall': 0.8,
    'FFQ': 0.7,
    'Biomarker': 0.9,
    'DHS Questionnaire': 0.6,
    'Household Availability/Budget Survey': 0.5
  };
  return methodScores[method] || 0.3;
}

function assessCoverageScore(coverage) {
  const coverageScores = {
    'National': 1.0,
    'Subnational': 0.7,
    'Local': 0.4
  };
  return coverageScores[coverage] || 0.2;
}

// Analyze nutrition patterns
export function analyzeNutritionPatterns(surveyData) {
  // Extract features from survey data
  const features = extractFeatures(surveyData);
  
  // Calculate overall data quality score
  const qualityScore = (
    features.methodScore * 0.3 +
    features.coverageScore * 0.3 +
    features.dietaryDiversity * 0.2 +
    features.sampleSize * 0.2
  ) * 100;

  // Determine data reliability category
  const reliabilityCategory = 
    qualityScore >= 80 ? 'High Reliability' :
    qualityScore >= 60 ? 'Moderate Reliability' :
    'Limited Reliability';

  // Generate insights based on dietary factors
  const dietaryFactors = surveyData['Available dietary factors']?.split('|') || [];
  const insights = generateInsights(dietaryFactors, features);

  return {
    qualityScore: Math.round(qualityScore),
    reliabilityCategory,
    features,
    insights,
    recommendations: generateRecommendations(features, dietaryFactors)
  };
}

function generateInsights(dietaryFactors, features) {
  const insights = [];

  if (features.dietaryDiversity > 0.7) {
    insights.push('Comprehensive nutrient coverage');
  } else if (features.dietaryDiversity < 0.3) {
    insights.push('Limited nutrient data available');
  }

  const macronutrients = ['Total Protein', 'Total Carbohydrates', 'Total Energy'].filter(
    nutrient => dietaryFactors.includes(nutrient)
  );
  if (macronutrients.length >= 2) {
    insights.push('Good macronutrient tracking');
  }

  const micronutrients = ['Vitamin', 'Mineral', 'Iron', 'Calcium'].some(
    term => dietaryFactors.some(factor => factor.includes(term))
  );
  if (micronutrients) {
    insights.push('Includes micronutrient analysis');
  }

  return insights;
}

function generateRecommendations(features, dietaryFactors) {
  const recommendations = [];

  if (features.dietaryDiversity < 0.5) {
    recommendations.push('Consider expanding nutrient tracking scope');
  }

  if (features.methodScore < 0.7) {
    recommendations.push('Could benefit from more precise assessment methods');
  }

  if (features.sampleSize < 0.3) {
    recommendations.push('Larger sample size would improve reliability');
  }

  if (!dietaryFactors.some(factor => factor.includes('Vitamin'))) {
    recommendations.push('Include vitamin content analysis');
  }

  return recommendations;
}

export function clusterSurveys(surveys) {
  // Convert surveys to feature vectors
  const featureVectors = surveys.map(extractFeatures);
  
  // Perform clustering
  const kmeans = new KMeansCluster(3);
  const clusters = kmeans.run(featureVectors);
  
  // Return clustered data
  return surveys.map((survey, i) => ({
    ...survey,
    cluster: clusters[i]
  }));
} 