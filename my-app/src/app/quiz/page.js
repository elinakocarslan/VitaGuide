'use client';

import styles from './quiz.module.css';
import Link from 'next/link';

export default function Quiz() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1 className={styles.title}>Quiz Page</h1>
        <p className={styles.description}>Quiz content will go here</p>
        <Link href="/results" className={styles.button}>
          Submit
        </Link>
      </div>
    </main>
  );
} 