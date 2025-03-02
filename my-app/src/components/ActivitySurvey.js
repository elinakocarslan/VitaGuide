'use client';

import { useState } from 'react';
import styles from './ActivitySurvey.module.css';

const ActivitySurvey = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    dailyActivities: [],
    exerciseLevel: '',
    sunExposure: '',
    dietaryRestrictions: [],
    sleepHours: '',
    stressLevel: '',
    waterIntake: ''
  });

  const activityQuestions = [
    {
      id: 'dailyActivities',
      title: 'What activities do you regularly engage in?',
      type: 'multiSelect',
      options: [
        'Desk work/Office job',
        'Physical labor',
        'Regular exercise',
        'Sports',
        'Walking/Standing frequently',
        'Mostly sedentary'
      ]
    },
    {
      id: 'exerciseLevel',
      title: 'How would you describe your exercise routine?',
      type: 'select',
      options: [
        'No regular exercise',
        'Light exercise (1-2 times/week)',
        'Moderate exercise (3-4 times/week)',
        'Intense exercise (5+ times/week)'
      ]
    },
    {
      id: 'sunExposure',
      title: 'How much time do you spend outdoors in sunlight?',
      type: 'select',
      options: [
        'Less than 15 minutes/day',
        '15-30 minutes/day',
        '30-60 minutes/day',
        'More than 1 hour/day'
      ]
    },
    {
      id: 'dietaryRestrictions',
      title: 'Do you have any dietary restrictions?',
      type: 'multiSelect',
      options: [
        'Vegetarian',
        'Vegan',
        'Gluten-free',
        'Dairy-free',
        'No restrictions',
        'Other'
      ]
    },
    {
      id: 'sleepHours',
      title: 'How many hours do you typically sleep per night?',
      type: 'select',
      options: [
        'Less than 6 hours',
        '6-7 hours',
        '7-8 hours',
        'More than 8 hours'
      ]
    },
    {
      id: 'stressLevel',
      title: 'How would you rate your stress level?',
      type: 'select',
      options: [
        'Low stress',
        'Moderate stress',
        'High stress',
        'Very high stress'
      ]
    },
    {
      id: 'waterIntake',
      title: 'How much water do you drink daily?',
      type: 'select',
      options: [
        'Less than 4 cups',
        '4-6 cups',
        '6-8 cups',
        'More than 8 cups'
      ]
    }
  ];

  const handleInputChange = (questionId, value) => {
    setSurveyData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiSelect = (questionId, value) => {
    setSurveyData(prev => ({
      ...prev,
      [questionId]: prev[questionId].includes(value)
        ? prev[questionId].filter(item => item !== value)
        : [...prev[questionId], value]
    }));
  };

  const handleNext = () => {
    if (currentStep < activityQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(surveyData);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const currentQuestion = activityQuestions[currentStep];

  return (
    <div className={styles.surveyContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${((currentStep + 1) / activityQuestions.length) * 100}%` }}
        />
      </div>

      <div className={styles.questionCard}>
        <h3>{currentQuestion.title}</h3>

        <div className={styles.optionsContainer}>
          {currentQuestion.type === 'multiSelect' ? (
            currentQuestion.options.map(option => (
              <label key={option} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={surveyData[currentQuestion.id].includes(option)}
                  onChange={() => handleMultiSelect(currentQuestion.id, option)}
                  className={styles.checkbox}
                />
                <span className={styles.checkmark}></span>
                {option}
              </label>
            ))
          ) : (
            currentQuestion.options.map(option => (
              <label key={option} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={surveyData[currentQuestion.id] === option}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                  className={styles.radio}
                />
                <span className={styles.radiomark}></span>
                {option}
              </label>
            ))
          )}
        </div>

        <div className={styles.navigation}>
          {currentStep > 0 && (
            <button onClick={handleBack} className={styles.backButton}>
              Back
            </button>
          )}
          <button 
            onClick={handleNext} 
            className={styles.nextButton}
          >
            {currentStep === activityQuestions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySurvey; 