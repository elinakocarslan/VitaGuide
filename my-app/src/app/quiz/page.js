'use client';

import styles from './quiz.module.css';
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const [answers, setAnswers] = useState({});
 const router = useRouter();


 // Handle selecting an answer
 const handleSelect = (questionId, rating) => {
   setAnswers((prev) => ({
     ...prev,
     [questionId]: rating
   }));
 };


 const handleSubmit = async () => {
   try {
     const response = await fetch("http://localhost:5000/analyze-quiz", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ responses: answers })
     });


     if (!response.ok) {
       throw new Error("Failed to send quiz data");
     }


     const data = await response.json();
     router.push(`/results?analysis=${encodeURIComponent(JSON.stringify(data))}`);
   } catch (error) {
     console.error("Error sending quiz data:", error);
   }
 };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1 className={styles.title}>Quiz Page</h1>
        <p className={styles.description}>Quiz content will go here</p>

         {/* Objective Signs Section */}
      <h2>Objective Signs (Physical Symptoms)</h2>
       {questions.objective.map((q) => (
         <div key={q.id} className={styles.questionBlock}>
           <p className={styles.questionText}>{q.question}</p>
           <div className={styles.ratingScale}>
             {[1, 2, 3, 4, 5].map((num) => (
               <label key={num} className={styles.optionLabel}>
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
         </div>
       ))}


       {/* Subjective Symptoms Section */}
       <h2>Subjective Symptoms (How You Feel)</h2>
       {questions.subjective.map((q) => (
         <div key={q.id} className={styles.questionBlock}>
           <p className={styles.questionText}>{q.question}</p>
           <div className={styles.ratingScale}>
             {[1, 2, 3, 4, 5].map((num) => (
               <label key={num} className={styles.optionLabel}>
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
         </div>
       ))}

        <Link href="/results" className={styles.button}>
          Submit
        </Link>
      </div>
    </main>
  );
} 