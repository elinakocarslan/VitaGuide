'use client';

import { useState, useEffect } from 'react';
import styles from './results.module.css';
import Link from 'next/link';

// Mapping of deficiencies to vitamins and foods
const recommendationMap = {
  'Vitamin A': {
    vitamins: [
      {
        name: 'Vitamin A',
        description: 'Essential for vision, immune function, and cell growth',
        benefits: ['👁️', '🧠', '🛡️'],
        image: '/images/vitamin-a.jpg'
      }
    ],
    foods: [
      {
        name: 'Carrots',
        description: 'Rich in beta-carotene which converts to Vitamin A',
        benefits: ['👁️', '🧠', '🛡️'],
        image: '/images/carrots.jpg'
      },
      {
        name: 'Sweet Potatoes',
        description: 'Excellent source of beta-carotene and other nutrients',
        benefits: ['👁️', '🧠', '❤️'],
        image: '/images/sweet-potato.jpg'
      }
    ]
  },
  'Vitamin B12': {
    vitamins: [
      {
        name: 'Vitamin B12',
        description: 'Important for nerve function, red blood cell formation, and DNA synthesis',
        benefits: ['🧠', '❤️', '🔋'],
        image: '/images/vitamin-b12.jpg'
      }
    ],
    foods: [
      {
        name: 'Eggs',
        description: 'Good source of B12 and complete protein',
        benefits: ['🧠', '💪', '🔋'],
        image: '/images/eggs.jpg'
      },
      {
        name: 'Fish',
        description: 'Rich in B12 and heart-healthy omega-3 fatty acids',
        benefits: ['🧠', '❤️', '🔋'],
        image: '/images/fish.jpg'
      }
    ]
  },
  'Vitamin D': {
    vitamins: [
      {
        name: 'Vitamin D',
        description: 'Essential for bone health, immune function, and mood regulation',
        benefits: ['🦴', '🛡️', '🧠'],
        image: '/images/vitamin-d.jpg'
      }
    ],
    foods: [
      {
        name: 'Fatty Fish',
        description: 'Natural source of vitamin D and omega-3 fatty acids',
        benefits: ['🦴', '❤️', '🧠'],
        image: '/images/salmon.jpg'
      },
      {
        name: 'Mushrooms',
        description: 'One of the few plant sources of vitamin D',
        benefits: ['🦴', '🛡️', '🍄'],
        image: '/images/mushrooms.jpg'
      }
    ]
  },
  'Zinc': {
    vitamins: [
      {
        name: 'Zinc',
        description: 'Important for immune function, wound healing, and cell growth',
        benefits: ['🛡️', '✨', '💪'],
        image: '/images/zinc.jpg'
      }
    ],
    foods: [
      {
        name: 'Oysters',
        description: 'Highest natural source of zinc',
        benefits: ['🛡️', '💪', '🧠'],
        image: '/images/oysters.jpg'
      },
      {
        name: 'Pumpkin Seeds',
        description: 'Good plant-based source of zinc and other minerals',
        benefits: ['🛡️', '💪', '❤️'],
        image: '/images/pumpkin-seeds.jpg'
      }
    ]
  },
  'Iron': {
    vitamins: [
      {
        name: 'Iron',
        description: 'Essential for red blood cell production and oxygen transport',
        benefits: ['❤️', '🔋', '🧠'],
        image: '/images/iron.jpg'
      }
    ],
    foods: [
      {
        name: 'Spinach',
        description: 'Rich in iron and other essential nutrients',
        benefits: ['❤️', '🔋', '🧠'],
        image: '/images/spinach.jpg'
      },
      {
        name: 'Red Meat',
        description: 'Excellent source of highly bioavailable iron',
        benefits: ['❤️', '💪', '🔋'],
        image: '/images/red-meat.jpg'
      }
    ]
  },
  'Magnesium': {
    vitamins: [
      {
        name: 'Magnesium',
        description: 'Important for muscle and nerve function, energy production, and bone health',
        benefits: ['💪', '🧠', '🦴'],
        image: '/images/magnesium.jpg'
      }
    ],
    foods: [
      {
        name: 'Almonds',
        description: 'Good source of magnesium, healthy fats, and protein',
        benefits: ['💪', '🧠', '❤️'],
        image: '/images/almonds.jpg'
      },
      {
        name: 'Dark Chocolate',
        description: 'Contains magnesium and antioxidants',
        benefits: ['🧠', '❤️', '😊'],
        image: '/images/dark-chocolate.jpg'
      }
    ]
  },
  'No Deficiency': {
    vitamins: [
      {
        name: 'Multivitamin',
        description: 'A balanced supplement to maintain overall health',
        benefits: ['🛡️', '❤️', '🧠'],
        image: '/images/multivitamin.jpg'
      }
    ],
    foods: [
      {
        name: 'Balanced Diet',
        description: 'Continue eating a variety of whole foods',
        benefits: ['❤️', '🧠', '💪'],
        image: '/images/balanced-diet.jpg'
      },
      {
        name: 'Colorful Vegetables',
        description: 'Eat a rainbow of vegetables for diverse nutrients',
        benefits: ['🛡️', '❤️', '✨'],
        image: '/images/vegetables.jpg'
      }
    ]
  }
};

// Default recommendations if no specific match is found
const defaultRecommendations = {
  vitamins: [
    {
      name: 'Multivitamin',
      description: 'A balanced supplement to maintain overall health',
      benefits: ['🛡️', '❤️', '🧠'],
      image: '/images/multivitamin.jpg'
    }
  ],
  foods: [
    {
      name: 'Balanced Diet',
      description: 'Focus on whole foods with plenty of fruits and vegetables',
      benefits: ['❤️', '🧠', '💪'],
      image: '/images/balanced-diet.jpg'
    }
  ]
};

export default function Results() {
  const [results, setResults] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, we would fetch this from the backend
    // For now, we'll use localStorage as a simulation
    try {
      const storedResults = localStorage.getItem('quizResults');
      const storedProfile = localStorage.getItem('userProfile');
      
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      } else {
        // Fallback for testing
        setResults({
          predicted_deficiency: 'Vitamin D',
          recommended_vitamins: 'Vitamin D, Calcium'
        });
      }
      
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        // Fallback for testing
        setUserProfile({
          age: '26-35',
          gender: 'Female',
          diet: 'Vegetarian',
          living_environment: 'Urban'
        });
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.center}>
          <div className={styles.loading}>
            <p>Analyzing your results...</p>
          </div>
        </div>
      </main>
    );
  }

  // Get recommendations based on predicted deficiency
  const deficiency = results?.predicted_deficiency || 'No Deficiency';
  const recommendations = recommendationMap[deficiency] || defaultRecommendations;

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.recommendation}>
          <h3>YOUR RESULTS</h3>
          <h1>Personalized Recommendations</h1>
          <p>
            Based on your responses, we've identified that you may have a <span>{deficiency}</span> deficiency.
            Here are some vitamins and foods that can help address your specific needs.
          </p>
        </div>

        <div className={styles.productGrid}>
          <h2>Recommended Vitamins</h2>
          <p className={styles.subtitle}>These supplements can help address your potential deficiency</p>
          <div className={styles.vitaminList}>
            {recommendations.vitamins.map((vitamin, index) => (
              <div key={index} className={styles.vitaminCard}>
                <div className={styles.productImage} style={{backgroundImage: `url(${vitamin.image || '/images/placeholder.jpg'})`, backgroundSize: 'cover'}}></div>
                <div className={styles.productInfo}>
                  <div className={styles.benefits}>
                    {vitamin.benefits.map((benefit, i) => (
                      <span key={i}>{benefit}</span>
                    ))}
                  </div>
                  <p>{vitamin.description}</p>
                  <h3>{vitamin.name}</h3>
                  <Link href="/learn-more">Learn More</Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.waterReminder}>
            <span>💧</span>
            <p>TAKE DAILY WITH WATER</p>
          </div>
        </div>

        <div className={styles.productGrid}>
          <h2>Recommended Foods</h2>
          <p className={styles.subtitle}>Include these foods in your diet to naturally address your needs</p>
          <div className={styles.vitaminList}>
            {recommendations.foods.map((food, index) => (
              <div key={index} className={styles.vitaminCard}>
                <div className={styles.productImage} style={{backgroundImage: `url(${food.image || '/images/placeholder.jpg'})`, backgroundSize: 'cover'}}></div>
                <div className={styles.productInfo}>
                  <div className={styles.benefits}>
                    {food.benefits.map((benefit, i) => (
                      <span key={i}>{benefit}</span>
                    ))}
                  </div>
                  <p>{food.description}</p>
                  <h3>{food.name}</h3>
                  <Link href="/learn-more">Learn More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <Link href="/quiz" className={styles.secondaryButton}>
            Retake Quiz
          </Link>
          <Link href="/" className={styles.primaryButton}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
} 