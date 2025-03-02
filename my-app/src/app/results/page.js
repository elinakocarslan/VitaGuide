// 'use client';
// import { useSearchParams } from "next/navigation";
// import styles from './results.module.css';
// import Link from 'next/link';

// export default function Results() {

//   const searchParams = useSearchParams();
//   const data = JSON.parse(searchParams.get("data") || "{}");

//   return (
//     <main className={styles.main}>
//       <div className={styles.center}>
//         <div className={styles.recommendation}>
//           <h3>RESULTS</h3>
//           <h1>Recommendations for you</h1>
//           <p>
//             Based on your responses in the quiz, we recommend the following vitamins and foods:
//           </p>
//         </div>

//         <div className={styles.productGrid}>
//           <h2>Vitamins</h2>

//           <h2 className={styles.resultText}>{data.predicted_deficiency}</h2>
//             <p>We recommend increasing your intake of:</p>
//             <h3 className={styles.resultText}>{data.recommended_vitamins}</h3>

//           <p className={styles.subtitle}>The vitamins we recommend for you based on your symptoms</p>
//           <div className={styles.vitaminList}>
//             <div className={styles.vitaminCard}>
//               <div className={styles.productImage}></div>
//               <div className={styles.productInfo}>
//                 <div className={styles.benefits}>
//                 </div>
//                 <p>You need as you eat fish more or less per week</p>
//                 <h3>Vitamin D</h3>
//                 <Link href="/learn-more">Learn More</Link>
//               </div>
//             </div>

//             <div className={styles.vitaminCard}>
//               <div className={styles.productImage}></div>
//               <div className={styles.productInfo}>
//                 <div className={styles.benefits}>
//                 </div>
//                 <p>You need as you want to support muscle recovery</p>
//                 <h3>Magnesium</h3>
//                 <Link href="/learn-more">Learn More</Link>
//               </div>
//             </div>

//             <div className={styles.vitaminCard}>
//               <div className={styles.productImage}></div>
//               <div className={styles.productInfo}>
//                 <div className={styles.benefits}>
//                 </div>
//                 <p>You need to avoid diet-based brain fog</p>
//                 <h3>Ashwagandha</h3>
//                 <Link href="/learn-more">Learn More</Link>
//               </div>
//             </div>

//             <div className={styles.vitaminCard}>
//               <div className={styles.productImage}></div>
//               <div className={styles.productInfo}>
//                 <div className={styles.benefits}>
//                 </div>
//                 <p>You need as you sometimes feel low energy</p>
//                 <h3>Rhodiola</h3>
//                 <Link href="/learn-more">Learn More</Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={styles.productGrid}>
//           <h2>Foods</h2>
//           <p className={styles.subtitle}>Foods that are rich in the vitamins and minerals you need</p>
//           <div className={styles.foodList}>
//             <div className={styles.foodCard}>
//               <div className={styles.productImage}></div>
//               <div className={styles.productInfo}>
//                 <div className={styles.benefits}>
//                 </div>
//                 <p>Rich in Omega-3 fatty acids and Vitamin D</p>
//                 <h3>Fatty Fish</h3>
//                 <Link href="/learn-more">Learn More</Link>
//               </div>
//             </div>

//             <div className={styles.foodCard}>
//               <div className={styles.productImage}></div>
//               <div className={styles.productInfo}>
//                 <div className={styles.benefits}>
//                 </div>
//                 <p>Excellent source of magnesium and iron</p>
//                 <h3>Leafy Greens</h3>
//                 <Link href="/learn-more">Learn More</Link>
//               </div>
//             </div>

//             <div className={styles.foodCard}>
//               <div className={styles.productImage}></div>
//               <div className={styles.productInfo}>
//                 <div className={styles.benefits}>
//                 </div>
//                 <p>Great for protein and healthy fats</p>
//                 <h3>Nuts & Seeds</h3>
//                 <Link href="/learn-more">Learn More</Link>
//               </div>
//             </div>

//             <div className={styles.foodCard}>
//               <div className={styles.productImage}></div>
//               <div className={styles.productInfo}>
//                 <div className={styles.benefits}>
//                 </div>
//                 <p>High in antioxidants and vitamins</p>
//                 <h3>Berries</h3>
//                 <Link href="/learn-more">Learn More</Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// } 
'use client';
import { useSearchParams } from "next/navigation";
import styles from './results.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Results() {
  const searchParams = useSearchParams();
  const [resultData, setResultData] = useState(null);
  
  useEffect(() => {
    try {
      const data = JSON.parse(searchParams.get("data") || "{}");
      setResultData(data);
    } catch (error) {
      console.error("Error parsing result data:", error);
    }
  }, [searchParams]);

  if (!resultData) {
    return <div className={styles.main}>Loading results...</div>;
  }

  // Define descriptions for common vitamins
  const vitaminInfo = {
    "Iron": {
      description: "Helps transport oxygen throughout your body and supports immune function",
      foodSources: ["Red meat", "Spinach", "Lentils", "Tofu"]
    },
    "Vitamin D": {
      description: "Critical for bone health and immune system function",
      foodSources: ["Fatty fish", "Egg yolks", "Fortified foods"]
    },
    "B12": {
      description: "Important for nerve function and red blood cell formation",
      foodSources: ["Meat", "Fish", "Dairy", "Fortified plant milks"]
    },
    "Calcium": {
      description: "Essential for bone health and muscle function",
      foodSources: ["Dairy products", "Leafy greens", "Almonds"]
    },
    "Magnesium": {
      description: "Supports muscle and nerve function and energy production",
      foodSources: ["Nuts", "Seeds", "Leafy greens", "Whole grains"]
    },
    "Zinc": {
      description: "Important for immune function and wound healing",
      foodSources: ["Oysters", "Red meat", "Poultry", "Beans"]
    },
    "Folate": {
      description: "Crucial for cell division and DNA synthesis",
      foodSources: ["Leafy greens", "Legumes", "Citrus fruits"]
    },
    "Vitamin C": {
      description: "Powerful antioxidant that boosts immune function",
      foodSources: ["Citrus fruits", "Bell peppers", "Strawberries"]
    },
    "Omega-3": {
      description: "Essential fatty acids important for heart and brain health",
      foodSources: ["Fatty fish", "Chia seeds", "Flaxseeds", "Walnuts"]
    },
    "Multivitamin": {
      description: "Provides a balanced mix of essential vitamins and minerals",
      foodSources: ["Varied diet with fruits, vegetables, and whole foods"]
    }
  };

  const getFoodRecommendations = (vitaminList) => {
    const foods = new Set();
    
    vitaminList.forEach(vitamin => {
      const info = vitaminInfo[vitamin];
      if (info && info.foodSources) {
        info.foodSources.forEach(food => foods.add(food));
      }
    });
    
    return Array.from(foods).slice(0, 4); 
  };

  const recommendedFoods = resultData.recommended_vitamins ? 
    getFoodRecommendations(resultData.recommended_vitamins) : 
    ["Leafy Greens", "Fatty Fish", "Nuts & Seeds", "Berries"];
  
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.recommendation}>
          <h3>RESULTS</h3>
          <h1>Your Nutrient Analysis</h1>
          
          {resultData.predicted_deficiency === "None" ? (
            <>
              <h2 className={styles.resultText}>No Specific Deficiency Detected</h2>
              <p>Based on your answers, we don't see strong indicators of a specific vitamin deficiency.</p>
              <p className={styles.subtitle}>However, we recommend these nutrients for overall wellness:</p>
            </>
          ) : (
            <>
              <h2 className={styles.resultText}>{resultData.predicted_deficiency} Deficiency</h2>
              <p>Based on your symptoms, you may have a {resultData.predicted_deficiency.toLowerCase()} deficiency.</p>
              {resultData.confidence && (
                <p className={styles.confidenceBar}>
                  Confidence: {resultData.confidence}%
                  <span 
                    className={styles.confidenceMeter} 
                    style={{width: `${resultData.confidence}%`}}
                  ></span>
                </p>
              )}
              <p>We recommend increasing your intake of these nutrients:</p>
            </>
          )}
        </div>

        {resultData.symptom_summary && (
          <div className={styles.symptomSummary}>
            <h3>Symptom Analysis</h3>
            <p>Average symptom score: {resultData.symptom_summary.average_score}/5</p>
            <p>Symptom severity: {resultData.symptom_summary.threshold}</p>
          </div>
        )}

        <div className={styles.productGrid}>
          <h2>Recommended Vitamins</h2>
          <div className={styles.vitaminList}>
            {resultData.recommended_vitamins && resultData.recommended_vitamins.map((vitamin, index) => (
              <div key={index} className={styles.vitaminCard}>
                <div className={styles.productImage}></div>
                <div className={styles.productInfo}>
                  <p>{vitaminInfo[vitamin]?.description || "Important for overall health"}</p>
                  <h3>{vitamin}</h3>
                  <Link href={`/learn-more?vitamin=${encodeURIComponent(vitamin)}`}>Learn More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.productGrid}>
          <h2>Recommended Foods</h2>
          <p className={styles.subtitle}>Foods that are rich in the vitamins and minerals you need</p>
          <div className={styles.foodList}>
            {recommendedFoods.map((food, index) => (
              <div key={index} className={styles.foodCard}>
                <div className={styles.productImage}></div>
                <div className={styles.productInfo}>
                  <p>Rich source of nutrients you need</p>
                  <h3>{food}</h3>
                  <Link href="/learn-more">Learn More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
