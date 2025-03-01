'use client';

import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1 className={styles.title}>🌱 VitaCheck: Web App for Vitamin Diagnosis</h1>
        <p className={styles.description}>
          About Us:
        </p>
        <p className={styles.description}>
        NutriMap is a mobile app that provides personalized nutrition insights, especially for underserved communities. It analyzes users’ symptoms and habits through a dynamic quiz, offering tailored nutrient recommendations and local food alternatives. With offline access and an SMS-based option, it remains accessible without internet. The app also helps NGOs track health trends using predictive analytics, enabling targeted interventions. Users can explore an interactive map for regional health insights and resources, while educational content fosters transparency and trust.
        </p>
        <Link href="/quiz" className={styles.startButton}>
          Start Quiz
        </Link>
      </div>
    </main>
  );
}
