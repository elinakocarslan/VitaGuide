'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { UserStorage } from '../../utils/userDataStorage';
import { countryCodeToName } from '../../utils/countryMapping';
import { analyzeNutritionPatterns } from '../../utils/nutritionAnalytics';

export default function CommunityPage() {
  const [quizData, setQuizData] = useState(null);
  const [communityData, setCommunityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    const userData = UserStorage.getQuizResults();
    if (userData) {
      setQuizData(userData);
      fetchCommunityData(userData.country);
    }
    setLoading(false);
  }, []);

  const fetchCommunityData = async (countryCode) => {
    try {
      const response = await fetch(`/api/metadata/${countryCode}`);
      const data = await response.json();
      if (data.length > 0) {
        const analysis = analyzeNutritionPatterns(data[0]);
        setCommunityData(analysis);
        compareData(quizData, analysis);
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
    }
  };

  const compareData = (personal, community) => {
    if (!personal || !community) return;

    const riskFactors = [];
    const protectiveFactors = [];
    const recommendations = [];

    // Compare lifestyle factors
    if (personal.sunExposure === 'Less than 15 minutes/day') {
      riskFactors.push({
        factor: 'Vitamin D',
        personal: 'Low sun exposure',
        community: community.deficiencies.includes('Vitamin D') ? 
          'Common deficiency in your area' : 'Sufficient in your area'
      });
    }

    // Compare dietary patterns
    if (personal.dietaryRestrictions.includes('Vegetarian') || 
        personal.dietaryRestrictions.includes('Vegan')) {
      riskFactors.push({
        factor: 'Vitamin B12',
        personal: 'Restricted diet',
        community: community.deficiencies.includes('Vitamin B12') ?
          'Common deficiency in your area' : 'Sufficient in your area'
      });
    }

    // Add community-specific recommendations
    community.deficiencies.forEach(deficiency => {
      if (!riskFactors.find(r => r.factor === deficiency)) {
        protectiveFactors.push({
          factor: deficiency,
          message: `Your lifestyle may protect you from ${deficiency} deficiency`
        });
      }
      recommendations.push({
        factor: deficiency,
        message: `Consider monitoring ${deficiency} levels, common deficiency in your area`
      });
    });

    setComparison({
      riskFactors,
      protectiveFactors,
      recommendations
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!quizData) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Back to Home
          </Link>
          <h1>Take the Quiz First</h1>
          <p className={styles.subtitle}>
            Complete the health quiz to get personalized community insights
          </p>
          <Link href="/quiz" className={styles.quizButton}>
            Take Health Quiz
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1>Your Community Health Insights</h1>
        <p className={styles.subtitle}>
          Comparing your health profile with {countryCodeToName[quizData.country]} data
        </p>
      </div>

      <div className={styles.content}>
        {comparison && (
          <>
            <div className={styles.section}>
              <h2>Risk Factors to Watch</h2>
              <div className={styles.factorGrid}>
                {comparison.riskFactors.map((risk, index) => (
                  <div key={index} className={styles.factorCard}>
                    <h3>{risk.factor}</h3>
                    <p className={styles.personal}>{risk.personal}</p>
                    <p className={styles.community}>{risk.community}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Your Protective Factors</h2>
              <div className={styles.factorGrid}>
                {comparison.protectiveFactors.map((factor, index) => (
                  <div key={index} className={styles.factorCard}>
                    <h3>{factor.factor}</h3>
                    <p>{factor.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Recommendations</h2>
              <div className={styles.recommendationList}>
                {comparison.recommendations.map((rec, index) => (
                  <div key={index} className={styles.recommendation}>
                    <span className={styles.icon}>✓</span>
                    <span>{rec.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
} 