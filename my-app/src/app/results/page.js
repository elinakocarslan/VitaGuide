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
        image: '/images/vitamin_a.png'
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
        image: '/images/fish.jpg'
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
    ],
    activities: [
      {
        name: 'Immune-Boosting Exercise',
        description: 'Moderate exercise like brisk walking or cycling to boost immune function',
        benefits: ['🛡️', '💪', '❤️'],
        image: '/images/immune-exercise.jpg'
      },
      {
        name: 'Stress Reduction',
        description: 'Practice meditation or yoga to reduce stress which can deplete zinc levels',
        benefits: ['😌', '🧠', '🛡️'],
        image: '/images/stress-reduction.jpg'
      }
    ]
  },
  'Iron': {
    vitamins: [
      {
        name: 'Iron',
        description: 'Essential for red blood cell production and oxygen transport',
        benefits: ['❤️', '🔋', '🧠'],
        image: '/images/iron.png'
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
    ],
    activities: [
      {
        name: 'Aerobic Exercise',
        description: 'Regular cardio exercise to improve circulation and oxygen delivery',
        benefits: ['❤️', '🔋', '💪'],
        image: '/images/aerobic-exercise.jpg'
      },
      {
        name: 'Vitamin C Pairing',
        description: 'Consume vitamin C with iron-rich foods to enhance absorption',
        benefits: ['🍊', '🔄', '🔋'],
        image: '/images/vitamin-c-foods.jpg'
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
    ],
    activities: [
      {
        name: 'Epsom Salt Bath',
        description: 'Soak in an Epsom salt bath to absorb magnesium through the skin',
        benefits: ['💆', '🦴', '😌'],
        image: '/images/epsom-bath.jpg'
      },
      {
        name: 'Muscle Relaxation',
        description: 'Practice progressive muscle relaxation to reduce tension and cramps',
        benefits: ['💪', '😌', '💤'],
        image: '/images/muscle-relaxation.jpg'
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

// Add color mapping for different vitamins
const vitaminColors = {
  'Vitamin A': '#FDCB6E',
  'Vitamin B12': '#74B9FF',
  'Vitamin D': '#FFB347',
  'Vitamin C': '#FFD8B1',
  'Zinc': '#A0C4FF',
  'Iron': '#FF7675',
  'Magnesium': '#9BF6FF',
  'No Deficiency': '#B8E994',
  'General': '#D6A2E8'
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
  let deficiency = results?.predicted_deficiency || 'No Deficiency';
  const recommendations = recommendationMap[deficiency] || defaultRecommendations;
  if(deficiency === 'No Deficiency'){
    deficiency = 'No';
  }

  // Get top vitamins with priority levels from the API response
  let topVitamins = results?.top_vitamins || [
    { name: deficiency, priority: "High" },
    { name: "Vitamin D", priority: "Medium" },
    { name: "Multivitamin", priority: "Low" }
  ];

  // If the top vitamin is "No Deficiency", only show that one
  if (topVitamins.some(v => v.name === "No Deficiency")) {
    topVitamins = [{ name: "No Deficiency", priority: "High" }];
  }

  // Priority color mapping
  const priorityColors = {
    "High": "#FF5C5C",
    "Medium": "#FFA33E",
    "Low": "#4CAF50"
  };

  // Collect foods and activities based on the top vitamins
  const combinedFoods = [];
  const combinedActivities = [];
  
  // Add foods and activities from each top vitamin's recommendations
  topVitamins.forEach(vitamin => {
    const vitaminName = vitamin.name;
    if (recommendationMap[vitaminName]) {
      // Add foods if they don't already exist in the combined list
      recommendationMap[vitaminName].foods.forEach(food => {
        if (!combinedFoods.some(f => f.name === food.name)) {
          combinedFoods.push({...food, source: vitaminName});
        }
      });
      
      // Add activities if they don't already exist in the combined list
      recommendationMap[vitaminName].activities.forEach(activity => {
        if (!combinedActivities.some(a => a.name === activity.name)) {
          combinedActivities.push({...activity, source: vitaminName});
        }
      });
    }
  });

  // If we don't have enough foods or activities, add from the default recommendations
  if (combinedFoods.length < 2) {
    defaultRecommendations.foods.forEach(food => {
      if (!combinedFoods.some(f => f.name === food.name)) {
        combinedFoods.push({...food, source: "General"});
        if (combinedFoods.length >= 4) return;
      }
    });
  }
  
  if (combinedActivities.length < 2) {
    defaultRecommendations.activities.forEach(activity => {
      if (!combinedActivities.some(a => a.name === activity.name)) {
        combinedActivities.push({...activity, source: "General"});
        if (combinedActivities.length >= 4) return;
      }
    });
  }

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.recommendation}>
          <h3>YOUR RESULTS</h3>
          <h1>Personalized Recommendations</h1>
          <p>
            {topVitamins.length === 1 && topVitamins[0].name === "No Deficiency" ? (
              <>Based on your responses, we've found <span>no significant vitamin deficiencies</span>. 
              Here are some general recommendations to maintain your health.</>
            ) : (
              <>Based on your responses, we've identified that you may have a <span>{deficiency}</span> deficiency.
              Here are some vitamins, foods, and activities that can help address your specific needs.</>
            )}
          </p>
        </div>

        <div className={styles.productGrid}>
          <h2>Priority Vitamin Recommendations</h2>
          <p className={styles.subtitle}>These supplements are ranked by importance for your specific needs</p>
          <div className={styles.vitaminList}>
            {topVitamins.map((vitamin, index) => {
              // Find the vitamin details in our recommendation map
              const vitaminDetails = recommendations.vitamins.find(v => v.name === vitamin.name) || {
                name: vitamin.name,
                description: `Important supplement for overall health and wellbeing`,
                benefits: ['🛡️', '❤️', '🧠'],
                image: '/images/placeholder.jpg'
              };
              
              return (
                <div key={index} className={styles.vitaminCard}>
                  <div className={styles.priorityBadge} style={{backgroundColor: priorityColors[vitamin.priority]}}>
                    {vitamin.priority} Priority
                  </div>
                  <div className={styles.productImage}>
                    <img 
                      src={vitaminDetails.image || '/images/vitamin.jpg'} 
                      alt={vitaminDetails.name} 
                      onError={(e) => {e.target.src = '/images/vitamin.jpg'}}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.benefits}>
                      {vitaminDetails.benefits.map((benefit, i) => (
                        <span key={i}>{benefit}</span>
                      ))}
                    </div>
                    <p>{vitaminDetails.description}</p>
                    <h3>{vitamin.name}</h3>
                  </div>
                </div>
              );
            })}
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
            {combinedFoods.slice(0, 4).map((food, index) => (
              <div key={index} className={styles.vitaminCard}>
                <div className={styles.productImage}>
                  <img 
                    src={food.image || '/images/vitamin.jpg'} 
                    alt={food.name} 
                    onError={(e) => {e.target.src = '/images/vitamin.jpg'}}
                  />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.benefits}>
                    {food.benefits.map((benefit, i) => (
                      <span key={i}>{benefit}</span>
                    ))}
                  </div>
                  <p>{food.description}</p>
                  <h3>{food.name}</h3>
                  <div className={styles.sourceTag}>For {food.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.productGrid}>
          <h2>Recommended Activities</h2>
          <p className={styles.subtitle}>These lifestyle activities can help maximize your health benefits</p>
          <div className={styles.vitaminList}>
            {combinedActivities.slice(0, 4).map((activity, index) => {
              const accentColor = vitaminColors[activity.source] || '#50755f';
              return (
                <div key={index} className={styles.activityCard}>
                  <div 
                    className={styles.activityIcon} 
                    style={{backgroundColor: `${accentColor}20`}} // 20 is hex for 12% opacity
                  >
                    {activity.benefits[0]}
                  </div>
                  <div className={styles.activityInfo}>
                    <div className={styles.benefits}>
                      {activity.benefits.map((benefit, i) => (
                        <span key={i}>{benefit}</span>
                      ))}
                    </div>
                    <h3>{activity.name}</h3>
                    <p>{activity.description}</p>
                    <div 
                      className={`${styles.sourceTag}`} 
                      style={{borderLeftColor: accentColor}}
                    >
                      For {activity.source}
                    </div>
                  </div>
                </div>
              );
            })}
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