// utils/api.js

const API_URL = "http://localhost:5001";

export async function sendQuizData(quizData) {
  try {
    // Map frontend field names to what backend expects
    const mappedData = {
      "Age": parseInt(quizData.age),
      "Gender": quizData.gender,
      "Diet Type": quizData.diet,
      "Living Environment": quizData.living_environment,
      "symptoms": {}
    };

    // Map symptom IDs to symptom names that match the dataset columns
    const symptomMap = {
      1: "Pale skin/Frequent bruising",
      2: "Brittle nails/Nail ridges",
      3: "Hair thinning/Hair loss",
      4: "Dry scaly skin",
      5: "Cracked lips/Mouth sores",
      6: "Night blindness/Dim light vision",
      7: "Frequent illness",
      8: "Bleeding gums/Sensitive teeth",
      9: "Muscle cramps/Spasms",
      10: "Dizziness/Lightheadedness",
      11: "Depression/Anxiety/Mood swings",
      12: "Headaches/Migraines",
      13: "Fatigue/Exhaustion",
      14: "Tingling/Numbness extremities",
      15: "Brain fog/Difficulty concentrating"
    };

    // Convert symptom ratings from quiz to the format expected by backend
    for (const [questionId, rating] of Object.entries(quizData.symptoms)) {
      const symptomName = symptomMap[questionId];
      if (symptomName) {
        mappedData.symptoms[symptomName] = rating;
      }
    }

    // Send data to backend
    const response = await fetch(`${API_URL}/analyze-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mappedData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending quiz data:", error);
    return { error: error.message };
  }
}