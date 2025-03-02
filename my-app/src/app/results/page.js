'use client';

import { useState, useEffect } from 'react';
import styles from './results.module.css';
import Link from 'next/link';

// Mapping of deficiencies to vitamins, foods, and activities
const recommendationMap = {
  'Vitamin A': {
    vitamins: [
      {
        name: 'Vitamin A',
        description: 'Essential for vision, immune function, and cell growth',
        benefits: ['👁️', '🧠', '🛡️'],
        image: '/images/vitamin-a.jpg'
      },
      {
        name: 'Beta Carotene',
        description: 'Converts to Vitamin A in the body and acts as an antioxidant',
        benefits: ['👁️', '🛡️', '✨'],
        image: '/images/beta-carotene.jpg'
      },
      {
        name: 'Lutein',
        description: 'Supports eye health and protects against blue light damage',
        benefits: ['👁️', '🧠', '✨'],
        image: '/images/lutein.jpg'
      },
      {
        name: 'Zeaxanthin',
        description: 'Protects the retina and improves visual performance',
        benefits: ['👁️', '🧠', '🛡️'],
        image: '/images/zeaxanthin.jpg'
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
    ],
    activities: [
      {
        name: 'Morning Sunlight Exposure',
        description: 'Spend 15-20 minutes in morning sunlight to help regulate vitamin metabolism',
        benefits: ['⏰', '🌞', '🧠'],
        image: '/images/morning-sun.jpg'
      },
      {
        name: 'Eye Exercises',
        description: 'Practice the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds',
        benefits: ['👁️', '🧠', '💆'],
        image: '/images/eye-exercises.jpg'
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
      },
      {
        name: 'Vitamin B Complex',
        description: 'Supports energy production and nervous system health',
        benefits: ['🔋', '🧠', '💪'],
        image: '/images/b-complex.jpg'
      },
      {
        name: 'Folate',
        description: 'Works with B12 for cell division and DNA synthesis',
        benefits: ['❤️', '🧠', '🔄'],
        image: '/images/folate.jpg'
      },
      {
        name: 'Iron',
        description: 'Helps with B12 absorption and red blood cell production',
        benefits: ['❤️', '🔋', '💪'],
        image: '/images/iron.jpg'
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
    ],
    activities: [
      {
        name: 'Regular Blood Tests',
        description: 'Monitor B12 levels every 6-12 months, especially if vegetarian or vegan',
        benefits: ['📊', '🔬', '❤️'],
        image: '/images/blood-test.jpg'
      },
      {
        name: 'Mindful Eating',
        description: 'Practice slow, mindful eating to improve nutrient absorption',
        benefits: ['🧠', '🍽️', '💆'],
        image: '/images/mindful-eating.jpg'
      }
    ]
  },
  'Vitamin D': {
    vitamins: [
      {
        name: 'Vitamin D3',
        description: 'Essential for bone health, immune function, and mood regulation',
        benefits: ['🦴', '🛡️', '🧠'],
        image: '/images/vitamin-d.jpg'
      },
      {
        name: 'Calcium',
        description: 'Works with vitamin D for bone health and muscle function',
        benefits: ['🦴', '💪', '❤️'],
        image: '/images/calcium.jpg'
      },
      {
        name: 'Magnesium',
        description: 'Helps activate vitamin D and supports bone health',
        benefits: ['🦴', '🧠', '💪'],
        image: '/images/magnesium.jpg'
      },
      {
        name: 'Vitamin K2',
        description: 'Works with vitamin D to ensure calcium goes to bones, not arteries',
        benefits: ['🦴', '❤️', '🔄'],
        image: '/images/vitamin-k2.jpg'
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
    ],
    activities: [
      {
        name: 'Sunlight Exposure',
        description: '15-30 minutes of midday sun exposure several times a week',
        benefits: ['🌞', '🦴', '😊'],
        image: '/images/sunlight.jpg'
      },
      {
        name: 'Outdoor Exercise',
        description: 'Combine physical activity with sun exposure for dual benefits',
        benefits: ['🏃', '🌞', '💪'],
        image: '/images/outdoor-exercise.jpg'
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
      },
      {
        name: 'Omega-3',
        description: 'Supports heart and brain health',
        benefits: ['❤️', '🧠', '🔄'],
        image: '/images/omega-3.jpg'
      },
      {
        name: 'Probiotics',
        description: 'Supports gut health and immune function',
        benefits: ['🦠', '🛡️', '🧠'],
        image: '/images/probiotics.jpg'
      },
      {
        name: 'Antioxidants',
        description: 'Protects cells from damage and supports overall health',
        benefits: ['🛡️', '✨', '❤️'],
        image: '/images/antioxidants.jpg'
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
    ],
    activities: [
      {
        name: 'Regular Exercise',
        description: '150 minutes of moderate activity per week',
        benefits: ['💪', '❤️', '🧠'],
        image: '/images/exercise.jpg'
      },
      {
        name: 'Adequate Sleep',
        description: '7-9 hours of quality sleep each night',
        benefits: ['😴', '🧠', '🛡️'],
        image: '/images/sleep.jpg'
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
    },
    {
      name: 'Vitamin D',
      description: 'Essential for bone health and immune function',
      benefits: ['🦴', '🛡️', '🧠'],
      image: '/images/vitamin-d.jpg'
    },
    {
      name: 'Vitamin C',
      description: 'Supports immune function and collagen production',
      benefits: ['🛡️', '✨', '❤️'],
      image: '/images/vitamin-c.jpg'
    },
    {
      name: 'Omega-3',
      description: 'Supports heart and brain health',
      benefits: ['❤️', '🧠', '🔄'],
      image: '/images/omega-3.jpg'
    }
  ],
  foods: [
    {
      name: 'Balanced Diet',
      description: 'Focus on whole foods with plenty of fruits and vegetables',
      benefits: ['❤️', '🧠', '💪'],
      image: '/images/balanced-diet.jpg'
    },
    {
      name: 'Leafy Greens',
      description: 'Rich in vitamins, minerals, and antioxidants',
      benefits: ['🛡️', '❤️', '🧠'],
      image: '/images/leafy-greens.jpg'
    }
  ],
  activities: [
    {
      name: 'Regular Exercise',
      description: '150 minutes of moderate activity per week',
      benefits: ['💪', '❤️', '🧠'],
      image: '/images/exercise.jpg'
    },
    {
      name: 'Adequate Sleep',
      description: '7-9 hours of quality sleep each night',
      benefits: ['😴', '🧠', '🛡️'],
      image: '/images/sleep.jpg'
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
            Here are some vitamins, foods, and activities that can help address your specific needs.
          </p>
        </div>

        <div className={styles.productGrid}>
          <h2>Top 4 Recommended Vitamins</h2>
          <p className={styles.subtitle}>These supplements can help address your potential deficiency</p>
          <div className={styles.vitaminList}>
            {recommendations.vitamins.slice(0, 4).map((vitamin, index) => (
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

        <div className={styles.productGrid}>
          <h2>Recommended Activities</h2>
          <p className={styles.subtitle}>These lifestyle activities can help maximize your health benefits</p>
          <div className={styles.vitaminList}>
            {recommendations.activities.map((activity, index) => (
              <div key={index} className={styles.vitaminCard}>
                <div className={styles.productImage} style={{backgroundImage: `url(${activity.image || '/images/placeholder.jpg'})`, backgroundSize: 'cover'}}></div>
                <div className={styles.productInfo}>
                  <div className={styles.benefits}>
                    {activity.benefits.map((benefit, i) => (
                      <span key={i}>{benefit}</span>
                    ))}
                  </div>
                  <p>{activity.description}</p>
                  <h3>{activity.name}</h3>
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