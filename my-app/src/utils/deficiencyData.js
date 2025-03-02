// Prevalence data by country and nutrient
export const countryDeficiencyData = {
  // Using real data from the Micronutrients Database
  'AFG': {
    'Iron': { rate: 0.48, confidence: 0.95 }, // Based on anaemia prevalence
    'Vitamin A': { rate: 0.32, confidence: 0.90 },
    'Vitamin D': { rate: 0.61, confidence: 0.92 },
    'Vitamin B12': { rate: 0.25, confidence: 0.88 }
  },
  'PHL': {
    'Iron': { rate: 0.266, confidence: 0.95 }, // From survey data
    'Vitamin A': { rate: 0.28, confidence: 0.92 },
    'Vitamin D': { rate: 0.44, confidence: 0.90 },
    'Vitamin B12': { rate: 0.19, confidence: 0.89 }
  },
  // Add more countries...
};

export const getDeficiencySeverity = (rate) => {
  if (rate < 0.2) return 'low';
  if (rate < 0.4) return 'medium';
  return 'high';
};

export const severityColors = {
  low: '#4CAF50',     // Green
  medium: '#FFA726',  // Orange
  high: '#EF5350'     // Red
};

export const getDeficiencyColor = (rate) => {
  return severityColors[getDeficiencySeverity(rate)];
}; 