'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import CountrySelector from '../../components/CountrySelector';
import TrendAnalysis from '../../components/TrendAnalysis';

export default function TrendsPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [trendData, setTrendData] = useState(null);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1>Global Nutrition Trends</h1>
        <p className={styles.subtitle}>
          Analyze nutrition patterns and deficiency trends across different regions
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.filters}>
          <CountrySelector 
            onCountrySelect={(country) => setSelectedCountry(country)}
          />
        </div>

        <div className={styles.analysis}>
          {selectedCountry ? (
            <TrendAnalysis countryData={selectedCountry} />
          ) : (
            <div className={styles.placeholder}>
              <p>Select a country to view nutrition trends and patterns</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 