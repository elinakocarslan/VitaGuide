'use client';

import styles from './page.module.css';
import CountrySelector from '../../components/CountrySelector';
import Link from 'next/link';

export default function BrowsePage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1>Browse Nutritional Data by Country</h1>
      </div>
      <CountrySelector />
    </main>
  );
} 