import { NextResponse } from 'next/server';

// Sample quiz questions - in a real app, this would come from a database
const quizQuestions = [
  {
    id: 1,
    question: "How often do you feel tired or low on energy?",
    options: [
      "Rarely or never",
      "1-2 times a week",
      "3-4 times a week",
      "Almost every day"
    ]
  },
  {
    id: 2,
    question: "How many servings of fish do you eat per week?",
    options: [
      "None",
      "1-2 servings",
      "3-4 servings",
      "More than 4 servings"
    ]
  },
  {
    id: 3,
    question: "How would you rate your stress levels?",
    options: [
      "Low/Minimal",
      "Moderate",
      "High",
      "Very High"
    ]
  },
  {
    id: 4,
    question: "How many hours of sleep do you typically get?",
    options: [
      "Less than 6 hours",
      "6-7 hours",
      "7-8 hours",
      "More than 8 hours"
    ]
  }
];

export async function GET() {
  return NextResponse.json({ questions: quizQuestions });
}

export async function POST(request) {
  const data = await request.json();
  
  // Process the quiz answers and generate recommendations
  const recommendations = generateRecommendations(data.answers);
  
  return NextResponse.json({ recommendations });
}

function generateRecommendations(answers) {
  // Sample recommendation logic - this would be more sophisticated in production
  const recommendations = {
    vitamins: [
      {
        name: "Vitamin D",
        reason: "Based on your fish consumption and energy levels",
        benefits: ["❤️", "🧠", "💪"]
      },
      {
        name: "Magnesium",
        reason: "Based on your stress levels and sleep patterns",
        benefits: ["🧠", "💪", "🌟"]
      },
      {
        name: "Ashwagandha",
        reason: "To help manage your stress levels",
        benefits: ["❤️", "🧠", "🌟"]
      },
      {
        name: "Rhodiola",
        reason: "To boost your energy levels",
        benefits: ["🌿", "✨", "🌟"]
      }
    ],
    foods: [
      {
        name: "Fatty Fish",
        reason: "Rich in Omega-3 fatty acids and Vitamin D",
        benefits: ["🐟", "🧠", "❤️"]
      },
      {
        name: "Leafy Greens",
        reason: "Excellent source of magnesium and iron",
        benefits: ["🥬", "💪", "🦴"]
      },
      {
        name: "Nuts & Seeds",
        reason: "Great for protein and healthy fats",
        benefits: ["🥜", "🧠", "💪"]
      },
      {
        name: "Berries",
        reason: "High in antioxidants and vitamins",
        benefits: ["🫐", "🧠", "✨"]
      }
    ]
  };

  return recommendations;
} 