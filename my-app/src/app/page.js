'use client';

import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.header}>
          <span className={styles.logo}>🌱</span>
          <span className={styles.brandName}>VitaGuide</span>
        </div>
        <h1 className={styles.title}>Web App for Vitamin Diagnosis</h1>
        <p className={styles.description}>
          Get personalized nutrition insights and local food alternatives, anytime, anywhere.
        </p>
        <Link href="/quiz" className={styles.startButton}>
          Start Quiz
        </Link>
      </div>
    </main>
  );
}

