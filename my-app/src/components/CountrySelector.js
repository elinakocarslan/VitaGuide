'use client';

import { useState, useEffect } from 'react';
import styles from './CountrySelector.module.css';
import { countryCodeToName, countryNameToCode } from '../utils/countryMapping';

const CountrySelector = ({ onCountrySelect }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/metadata');
        const data = await response.json();
        
        // Get unique countries and sort by name
        const uniqueCountries = [...new Set(data.map(item => item.ISO3))]
          .filter(code => countryCodeToName[code]) // Only include mapped countries
          .sort((a, b) => countryCodeToName[a].localeCompare(countryCodeToName[b]))
          .map(code => ({
            code,
            name: countryCodeToName[code]
          }));
        
        setCountries(uniqueCountries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCountrySelect = async (countryCode) => {
    setSelectedCountry(countryCode);
    try {
      const response = await fetch(`/api/metadata/${countryCode}`);
      const data = await response.json();
      
      // Sort surveys by year (most recent first)
      const sortedData = data.sort((a, b) => b.Year - a.Year);
      
      setCountryData(sortedData[0]); // Use the most recent survey
      if (onCountrySelect) {
        onCountrySelect(sortedData[0]);
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading countries...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.selectorSection}>
        <h2>Select a Country</h2>
        <select 
          value={selectedCountry}
          onChange={(e) => handleCountrySelect(e.target.value)}
          className={styles.select}
        >
          <option value="">Choose a country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {countryData && !onCountrySelect && (
        <div className={styles.dataDisplay}>
          <h3>Survey Information for {countryCodeToName[countryData.ISO3]}</h3>
          <div className={styles.surveyDetails}>
            <p><strong>Year:</strong> {countryData.Year}</p>
            <p><strong>Survey Type:</strong> {countryData['Dietary assessment method']}</p>
            <p><strong>Sample Size:</strong> {countryData['Sample size'] || 'Not specified'}</p>
            <p><strong>Coverage:</strong> {countryData.Representativeness}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector; 