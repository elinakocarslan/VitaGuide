'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './TrendAnalysis.module.css';
import { analyzeNutritionPatterns } from '../utils/nutritionAnalytics';
import { countryCodeToName } from '../utils/countryMapping';
import { countryDeficiencyData, getDeficiencyColor } from '../utils/deficiencyData';
import DeficiencyHeatMap from './DeficiencyHeatMap';

const TrendAnalysis = ({ countryData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [deficiencyData, setDeficiencyData] = useState(null);
  const [selectedNutrient, setSelectedNutrient] = useState(null);

  useEffect(() => {
    if (countryData) {
      const results = analyzeNutritionPatterns(countryData);
      setAnalysis(results);
      
      // Analyze deficiency patterns based on available dietary factors
      const deficiencies = analyzeDeficiencies(countryData);
      setDeficiencyData(deficiencies);
    }
  }, [countryData]);

  const analyzeDeficiencies = (data) => {
    const dietaryFactors = data['Available dietary factors']?.split('|') || [];
    const deficiencies = [];

    // Common vitamin and mineral pairs with their prevalence data
    const nutrientData = {
      'Vitamin A': {
        conditions: ['Night Blindness', 'Eye Problems', 'Immune System'],
        prevalence: calculatePrevalence(data, 'Vitamin A'),
        riskGroups: ['Children', 'Pregnant Women']
      },
      'Vitamin B12': {
        conditions: ['Anemia', 'Neurological Issues'],
        prevalence: calculatePrevalence(data, 'Vitamin B12'),
        riskGroups: ['Vegetarians', 'Elderly']
      },
      'Vitamin D': {
        conditions: ['Bone Health', 'Immune System'],
        prevalence: calculatePrevalence(data, 'Vitamin D'),
        riskGroups: ['Indoor Workers', 'Dark-Skinned Individuals']
      },
      'Iron': {
        conditions: ['Anemia', 'Fatigue'],
        prevalence: calculatePrevalence(data, 'Iron'),
        riskGroups: ['Women of Reproductive Age', 'Adolescents']
      }
      // ... other nutrients
    };

    // Check for missing nutrients and calculate statistics
    Object.entries(nutrientData).forEach(([nutrient, info]) => {
      if (!dietaryFactors.some(factor => factor.includes(nutrient))) {
        deficiencies.push({
          nutrient,
          prevalence: info.prevalence,
          riskGroups: info.riskGroups,
          conditions: info.conditions,
          recommendations: generateRecommendations(nutrient)
        });
      }
    });

    // Sort deficiencies by prevalence rate (highest first)
    deficiencies.sort((a, b) => b.prevalence.rate - a.prevalence.rate);

    return deficiencies;
  };

  const calculatePrevalence = (data, nutrient) => {
    const countryCode = data.ISO3;
    return countryDeficiencyData[countryCode]?.[nutrient] || {
      rate: 0.20,
      confidence: 0.75
    };
  };

  const calculateRiskLevel = (data, nutrient) => {
    // Implement risk calculation based on survey data
    const sampleSize = parseInt(data['Sample size']) || 0;
    const coverage = data.Representativeness;
    
    if (coverage === 'National' && sampleSize > 1000) return 'High Confidence';
    if (coverage === 'Subnational' || sampleSize > 500) return 'Moderate Confidence';
    return 'Limited Data';
  };

  const generateRecommendations = (nutrient) => {
    const recommendations = {
      'Vitamin A': ['Orange and yellow fruits', 'Leafy greens', 'Fish', 'Eggs'],
      'Vitamin B12': ['Fish', 'Meat', 'Dairy products', 'Fortified cereals'],
      'Vitamin C': ['Citrus fruits', 'Bell peppers', 'Berries', 'Tomatoes'],
      'Vitamin D': ['Sunlight exposure', 'Fatty fish', 'Egg yolks', 'Fortified dairy'],
      'Iron': ['Red meat', 'Spinach', 'Legumes', 'Fortified cereals'],
      'Calcium': ['Dairy products', 'Leafy greens', 'Fish with bones', 'Fortified foods'],
      'Zinc': ['Meat', 'Shellfish', 'Legumes', 'Seeds'],
      'Iodine': ['Seaweed', 'Fish', 'Iodized salt', 'Dairy products']
    };

    return recommendations[nutrient] || [];
  };

  if (!analysis) return <div>Analyzing data...</div>;

  const countryName = countryCodeToName[countryData.ISO3] || countryData.ISO3;

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link href="/trends" className={styles.navButton}>
          <span className={styles.icon}>📊</span>
          Health Trends
        </Link>
        <Link href="/quiz" className={styles.navButton}>
          <span className={styles.icon}>📝</span>
          Take Quiz
        </Link>
        <Link href="/community" className={styles.navButton}>
          <span className={styles.icon}>👥</span>
          Community Insights
        </Link>
      </div>

      <h2>Nutrition Analysis for {countryName}</h2>
      
      <div className={styles.section}>
        <h3>Data Quality Assessment</h3>
        <div className={styles.qualityScore}>
          <div className={styles.scoreCircle} style={{
            '--score': `${analysis.qualityScore}%`
          }}>
            <span>{analysis.qualityScore}%</span>
          </div>
          <div className={styles.scoreDetails}>
            <p className={styles.reliability}>{analysis.reliabilityCategory}</p>
            <p className={styles.method}>
              Method: {countryData['Dietary assessment method']}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Nutrient Deficiency Prevalence</h3>
        <div className={styles.deficiencyGrid}>
          {deficiencyData?.map((deficiency, index) => (
            <div 
              key={index} 
              className={styles.deficiencyCard}
              style={{
                borderLeft: `4px solid ${getDeficiencyColor(deficiency.prevalence.rate)}`
              }}
              onClick={() => setSelectedNutrient(deficiency.nutrient)}
            >
              <h4>{deficiency.nutrient}</h4>
              <div className={styles.prevalenceStats}>
                <div className={styles.prevalenceBar}>
                  <div 
                    className={styles.prevalenceFill}
                    style={{ width: `${deficiency.prevalence.rate * 100}%` }}
                  />
                </div>
                <p className={styles.prevalenceText}>
                  Affects approximately {(deficiency.prevalence.rate * 100).toFixed(1)}% 
                  of the population
                </p>
                <p className={styles.confidenceLevel}>
                  Confidence Level: {(deficiency.prevalence.confidence * 100).toFixed(0)}%
                </p>
              </div>
              <div className={styles.riskGroups}>
                <h5>Most Affected Groups:</h5>
                <ul>
                  {deficiency.riskGroups.map((group, i) => (
                    <li key={i}>{group}</li>
                  ))}
                </ul>
              </div>
              <p className={styles.riskLevel}>Risk Assessment: {calculateRiskLevel(countryData, deficiency.nutrient)}</p>
              <div className={styles.conditions}>
                <p>Associated Conditions:</p>
                <ul>
                  {deficiency.conditions.map((condition, i) => (
                    <li key={i}>{condition}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.recommendations}>
                <p>Recommended Sources:</p>
                <ul>
                  {deficiency.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNutrient && (
        <DeficiencyHeatMap selectedNutrient={selectedNutrient} />
      )}

      <div className={styles.section}>
        <h3>Available Nutrients Data</h3>
        <div className={styles.nutrients}>
          {countryData['Available dietary factors']?.split('|').map((factor, index) => (
            <div key={index} className={styles.nutrient}>
              {factor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis; 