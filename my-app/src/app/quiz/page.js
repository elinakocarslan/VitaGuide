'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './quiz.module.css';

export default function Quiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState({
    age: '30',
    gender: 'Female',
    diet: 'Vegetarian',
    living_environment: 'Urban',
    symptoms: {
      'Night Blindness': 1,
      'Dry Eyes': 1,
      'Bleeding Gums': 1,
      'Fatigue': 1,
      'Tingling Sensation': 1,
      'Low Sun Exposure': 1,
      'Reduced Memory Capacity': 1
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: 'demographics',
      title: 'Tell us about yourself',
      fields: [
        {
          id: 'age',
          label: 'Age',
          type: 'select',
          options: ['18-25', '26-35', '36-45', '46-55', '56+']
        },
        {
          id: 'gender',
          label: 'Gender',
          type: 'select',
          options: ['Male', 'Female', 'Other']
        },
        {
          id: 'diet',
          label: 'Diet Type',
          type: 'select',
          options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Pescatarian']
        },
        {
          id: 'living_environment',
          label: 'Living Environment',
          type: 'select',
          options: ['Urban', 'Rural', 'Suburban']
        }
      ]
    },
    {
      id: 'Night Blindness',
      title: 'Do you experience difficulty seeing at night?',
      description: 'Rate from 1 (not at all) to 5 (severe)',
      type: 'rating'
    },
    {
      id: 'Dry Eyes',
      title: 'Do you experience dry eyes?',
      description: 'Rate from 1 (not at all) to 5 (severe)',
      type: 'rating'
    },
    {
      id: 'Bleeding Gums',
      title: 'Do your gums bleed when brushing teeth?',
      description: 'Rate from 1 (not at all) to 5 (severe)',
      type: 'rating'
    },
    {
      id: 'Fatigue',
      title: 'Do you experience unusual fatigue?',
      description: 'Rate from 1 (not at all) to 5 (severe)',
      type: 'rating'
    },
    {
      id: 'Tingling Sensation',
      title: 'Do you experience tingling sensations in your hands or feet?',
      description: 'Rate from 1 (not at all) to 5 (severe)',
      type: 'rating'
    },
    {
      id: 'Low Sun Exposure',
      title: 'How much sun exposure do you get daily?',
      description: 'Rate from 1 (plenty) to 5 (very little)',
      type: 'rating'
    },
    {
      id: 'Reduced Memory Capacity',
      title: 'Have you noticed reduced memory capacity?',
      description: 'Rate from 1 (not at all) to 5 (severe)',
      type: 'rating'
    }
  ];

  const handleDemographicChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingChange = (questionId, rating) => {
    setQuizData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [questionId]: rating
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting quiz data:', quizData);
      
      const response = await fetch('http://localhost:5001/analyze-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Store the results in localStorage to access them on the results page
      localStorage.setItem('quizResults', JSON.stringify(data));
      localStorage.setItem('userProfile', JSON.stringify({
        age: quizData.age,
        gender: quizData.gender,
        diet: quizData.diet,
        living_environment: quizData.living_environment
      }));
      
      // Navigate to results page
      router.push('/results');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert(`Error: ${error.message || 'There was an error submitting your quiz. Please try again.'}`);
      
      // For testing purposes, you can use this to bypass the API and go to results
      if (confirm('Would you like to proceed to results with sample data?')) {
        localStorage.setItem('quizResults', JSON.stringify({
          predicted_deficiency: 'Vitamin D',
          recommended_vitamins: 'Vitamin D, Calcium'
        }));
        router.push('/results');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentStep];

    if (question.id === 'demographics') {
      return (
        <div className={styles.demographicsContainer}>
          <h2 className={styles.questionTitle}>{question.title}</h2>
          {question.fields.map(field => (
            <div key={field.id} className={styles.fieldGroup}>
              <label htmlFor={field.id}>{field.label}</label>
              <select 
                id={field.id}
                value={quizData[field.id]}
                onChange={(e) => handleDemographicChange(field.id, e.target.value)}
                className={styles.select}
              >
                {field.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }

    if (question.type === 'rating') {
      return (
        <div className={styles.ratingContainer}>
          <h2 className={styles.questionTitle}>{question.title}</h2>
          <p className={styles.questionDescription}>{question.description}</p>
          <div className={styles.ratingButtons}>
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                className={`${styles.ratingButton} ${quizData.symptoms[question.id] === rating ? styles.selected : ''}`}
                onClick={() => handleRatingChange(question.id, rating)}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(currentStep / (questions.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        <div className={styles.quizContainer}>
          {renderQuestion()}
          
          <div className={styles.navigationButtons}>
            {currentStep > 0 && (
              <button 
                className={styles.backButton} 
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            <button 
              className={styles.nextButton} 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 