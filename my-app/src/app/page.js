'use client';

import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1 className={styles.title}>Welcome to VitaGuide</h1>
        <p className={styles.description}>
          Test your knowledge and learn about healthy living!
        </p>
        <Link href="/quiz" className={styles.startButton}>
          Start Quiz
        </Link>
      </div>
    </main>
  );
}
