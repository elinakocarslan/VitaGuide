'use client';

import styles from './quiz.module.css';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendQuizData } from "../../../utils/api.js"; 

const questions = {
  objective: [
    { id: 1, question: "Do you have pale skin or frequent bruising?" },
    { id: 2, question: "Do you have brittle nails or ridges on your nails?" },
    { id: 3, question: "Do you experience hair thinning or hair loss?" },
    { id: 4, question: "Do you experience dry, scaly skin?" },
    { id: 5, question: "Do you have cracked lips or sores at the corners of your mouth?" },
    { id: 6, question: "Do you experience night blindness or trouble seeing in dim light?" },
    { id: 7, question: "Do you frequently get sick (colds, infections)?" },
    { id: 8, question: "Do you have bleeding gums or sensitive teeth?" }
  ],
  subjective: [
    { id: 9, question: "Do you experience frequent muscle cramps or spasms?" },
    { id: 10, question: "Do you often feel dizzy or lightheaded?" },
    { id: 11, question: "Do you feel depressed, anxious, or experience mood swings?" },
    { id: 12, question: "Do you have frequent headaches or migraines?" },
    { id: 13, question: "Do you often feel fatigued or exhausted even after sleeping?" },
    { id: 14, question: "Do you experience tingling or numbness in your hands and feet?" },
    { id: 15, question: "Do you experience brain fog or difficulty concentrating?" }
  ]
};

export default function Quiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [demographics, setDemographics] = useState({
    age: "",
    gender: "",
    diet: "",
    living_environment: ""
  });
  const [loading, setLoading] = useState(false);

  const handleDemographicChange = (e) => {
    setDemographics({ ...demographics, [e.target.name]: e.target.value });
  };

  // Handle selecting an answer
  const handleSelect = (questionId, rating) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const handleSubmit = async () => {
    if (!demographics.age || !demographics.gender || !demographics.diet || !demographics.living_environment) {
      alert("Please fill in all demographic fields.");
      return;
    }

    setLoading(true);
    const quizData = { ...demographics, symptoms: answers };
    const result = await sendQuizData(quizData);
    setLoading(false);

    if (result.error) {
      alert("Error fetching results. Please try again.");
    } else {
      router.push(`/results?data=${encodeURIComponent(JSON.stringify(result))}`);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1 className={styles.title}>Health Assessment Quiz</h1>

         {/* Demographic Inputs */}
         <label>Age: 
          <input 
            type="number" 
            name="age" 
            value={demographics.age} 
            onChange={handleDemographicChange} 
            placeholder="Enter your age"
          />
        </label>
        <label>Gender: 
          <select name="gender" value={demographics.gender} onChange={handleDemographicChange}>
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>Diet Type: 
          <select name="diet" value={demographics.diet} onChange={handleDemographicChange}>
            <option value="">Select</option>
            <option value="Omnivore">Omnivore</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
          </select>
        </label>
        <label>Living Environment: 
          <select name="living_environment" value={demographics.living_environment} onChange={handleDemographicChange}>
            <option value="">Select</option>
            <option value="Urban">Urban</option>
            <option value="Rural">Rural</option>
          </select>
        </label>

        <p className={styles.description}>Rate how much you agree with each statement below</p>

        {Object.entries(questions).map(([category, qs]) => (
          <div key={category}>
            <h2>{category === "objective" ? "Objective Signs" : "Subjective Symptoms"}</h2>
            {qs.map((q) => (
              <div key={q.id}>
                <p>{q.question}</p>
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num}>
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={num}
                      checked={answers[q.id] === num}
                      onChange={() => handleSelect(q.id, num)}
                    />
                    {num}
                  </label>
                ))}
              </div>
            ))}
          </div>
        ))}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Get Results"}
        </button>
      </div>
    </main>
  );
} 