'use client';

import styles from './results.module.css';
import Link from 'next/link';

export default function Results() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1>Results Page</h1>
        
        <p>Results will be here</p>
        <Link href="/" className={styles.startButton}>
          Restart
        </Link>
      </div>
    </main>
  );
} 