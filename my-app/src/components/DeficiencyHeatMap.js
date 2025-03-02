'use client';

import { useState } from 'react';
import styles from './DeficiencyHeatMap.module.css';
import { countryDeficiencyData, getDeficiencyColor, severityColors } from '../utils/deficiencyData';

const DeficiencyHeatMap = ({ selectedNutrient }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const getCountryColor = (countryCode) => {
    const countryData = countryDeficiencyData[countryCode];
    if (!countryData || !countryData[selectedNutrient]) return '#e0e0e0';
    return getDeficiencyColor(countryData[selectedNutrient].rate);
  };

  return (
    <div className={styles.heatMapContainer}>
      <h4>Global {selectedNutrient} Deficiency Map</h4>
      <div className={styles.map}>
        {/* Here you would integrate a map visualization library like react-simple-maps */}
        {/* For now, showing a simplified version */}
        <div className={styles.legendContainer}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ background: severityColors.low }} />
            <span>Low (&lt;20%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ background: severityColors.medium }} />
            <span>Medium (20-40%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ background: severityColors.high }} />
            <span>High (&gt;40%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeficiencyHeatMap; 