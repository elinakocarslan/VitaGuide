'use client';

import styles from './results.module.css';
import Link from 'next/link';

export default function Results() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.recommendation}>
          <h3>RESULTS</h3>
          <h1>Recommendations for you</h1>
          <p>
            Based on your responses in the quiz, we recommend the following vitamins and foods:
          </p>
        </div>

        <div className={styles.productGrid}>
          <h2>Vitamins</h2>
          <p className={styles.subtitle}>The vitamins we recommend for you based on your symptoms</p>
          <div className={styles.vitaminList}>
            <div className={styles.vitaminCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.benefits}>
                </div>
                <p>You need as you eat fish more or less per week</p>
                <h3>Vitamin D</h3>
                <Link href="/learn-more">Learn More</Link>
              </div>
            </div>

            <div className={styles.vitaminCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.benefits}>
                </div>
                <p>You need as you want to support muscle recovery</p>
                <h3>Magnesium</h3>
                <Link href="/learn-more">Learn More</Link>
              </div>
            </div>

            <div className={styles.vitaminCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.benefits}>
                </div>
                <p>You need to avoid diet-based brain fog</p>
                <h3>Ashwagandha</h3>
                <Link href="/learn-more">Learn More</Link>
              </div>
            </div>

            <div className={styles.vitaminCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.benefits}>
                </div>
                <p>You need as you sometimes feel low energy</p>
                <h3>Rhodiola</h3>
                <Link href="/learn-more">Learn More</Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.productGrid}>
          <h2>Foods</h2>
          <p className={styles.subtitle}>Foods that are rich in the vitamins and minerals you need</p>
          <div className={styles.foodList}>
            <div className={styles.foodCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.benefits}>
                </div>
                <p>Rich in Omega-3 fatty acids and Vitamin D</p>
                <h3>Fatty Fish</h3>
                <Link href="/learn-more">Learn More</Link>
              </div>
            </div>

            <div className={styles.foodCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.benefits}>
                </div>
                <p>Excellent source of magnesium and iron</p>
                <h3>Leafy Greens</h3>
                <Link href="/learn-more">Learn More</Link>
              </div>
            </div>

            <div className={styles.foodCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.benefits}>
                </div>
                <p>Great for protein and healthy fats</p>
                <h3>Nuts & Seeds</h3>
                <Link href="/learn-more">Learn More</Link>
              </div>
            </div>

            <div className={styles.foodCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.benefits}>
                </div>
                <p>High in antioxidants and vitamins</p>
                <h3>Berries</h3>
                <Link href="/learn-more">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 