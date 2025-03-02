export const sendQuizData = async (quizData) => {
  try {
    const response = await fetch("http://localhost:5001/analyze-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quizData)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch results from server.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending quiz data:", error);
    return { error: "Failed to process request." };
  }
};
