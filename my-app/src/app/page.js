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
        
        <div className={styles.buttonContainer}>
          <div className={styles.buttonGroup}>
            <p className={styles.buttonDescription}>
              Ready To Improve Your Health?
            </p>
            <Link href="/quiz" className={styles.button}>
            Start Health Quiz
            </Link>
          </div>
          
          <div className={styles.buttonGroup}>
            <p className={styles.buttonDescription}>
              Stay Safe in Your Community
            </p>
            <Link href="/community" className={styles.button}>
              Local Health Alerts
            </Link>
          </div>
          
          <div className={styles.buttonGroup}>
            <p className={styles.buttonDescription}>
            Drive Community Change
            </p>
            <Link href="/trends" className={styles.button}>
            Analyze Community Needs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

