from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the Kaggle dataset
csv_file_path = "data/deficiency_data.csv" 
df_kaggle = pd.read_csv(csv_file_path)

# Print column names for debugging
print("Columns in dataset:", df_kaggle.columns.tolist())

# Identify categorical columns
categorical_columns = ["Age", "Gender", "Diet Type", "Living Environment", "Skin Condition"]
symptom_columns = [col for col in df_kaggle.columns if col not in categorical_columns and col != "Predicted Deficiency"]

print("Symptom columns:", symptom_columns)
print("Categorical columns:", categorical_columns)

# Get deficiency distribution for balancing
deficiency_counts = df_kaggle["Predicted Deficiency"].value_counts()
print("Deficiency distribution:", deficiency_counts)

# Calculate inverse weights (less common deficiencies get higher weights)
deficiency_weights = 1 / deficiency_counts
deficiency_weights = deficiency_weights / deficiency_weights.sum()  # Normalize to sum to 1
print("Deficiency weights:", deficiency_weights)

# Encode categorical deficiency labels
le_deficiency = LabelEncoder()
df_kaggle["Predicted Deficiency"] = le_deficiency.fit_transform(df_kaggle["Predicted Deficiency"])

# Create a mapping from encoded values to original labels
deficiency_mapping = dict(zip(range(len(le_deficiency.classes_)), le_deficiency.classes_))
print("Deficiency mapping:", deficiency_mapping)

# Encode all categorical columns
encoders = {}
for col in categorical_columns:
    if col in df_kaggle.columns:
        encoders[col] = LabelEncoder()
        df_kaggle[col] = encoders[col].fit_transform(df_kaggle[col].astype(str))

# All feature columns for the model
all_feature_columns = categorical_columns + symptom_columns

# Train a Nearest Neighbors model with more neighbors
# Using 5 neighbors to get more diverse results
knn = NearestNeighbors(n_neighbors=5, metric="euclidean")
knn.fit(df_kaggle[all_feature_columns])

@app.route("/analyze-quiz", methods=["POST"])
def analyze_quiz():
    """
    API Endpoint: Receives quiz responses and compares them to the dataset.
    Returns predicted deficiencies and recommended vitamins.
    """
    try:
        # Step 1: Receive JSON data from the frontend
        data = request.json
        print("Received data:", data)
        
        if not data or "symptoms" not in data:
            return jsonify({"error": "Invalid quiz data: 'symptoms' field is missing"}), 400

        # Step 2: Convert demographics into numerical format
        try:
            user_data = {
                "Age": data["age"],
                "Gender": data["gender"],
                "Diet Type": data["diet"],
                "Living Environment": data["living_environment"],
                # Default skin condition to "Normal" if not provided
                "Skin Condition": data.get("skin_condition", "Normal")
            }
            print("User data:", user_data)
            
            # Convert categorical data to numerical using LabelEncoder
            for col in categorical_columns:
                if col in encoders:
                    try:
                        # Transform the user input using the pre-fitted encoder
                        user_data[col] = encoders[col].transform([str(user_data[col])])[0]
                    except Exception as e:
                        print(f"Error encoding {col}: {str(e)}")
                        # Use a default value if transformation fails
                        user_data[col] = 0
            
            print("Encoded user data:", user_data)
        except KeyError as e:
            return jsonify({"error": f"Missing demographic field: {str(e)}"}), 400

        # Convert quiz responses (1,2 → No (0), 3,4,5 → Yes (1))
        try:
            symptom_binary = {}
            for symptom in symptom_columns:
                # Check if the symptom is in the user's symptoms data
                if symptom in data["symptoms"]:
                    symptom_binary[symptom] = 1 if data["symptoms"][symptom] >= 3 else 0
                else:
                    symptom_binary[symptom] = 0
            
            print("Symptom binary:", symptom_binary)
        except Exception as e:
            return jsonify({"error": f"Error processing symptoms: {str(e)}"}), 400

        # Convert into DataFrame matching dataset format
        try:
            user_df = pd.DataFrame([{**user_data, **symptom_binary}], columns=all_feature_columns).fillna(0)
            print("User DataFrame:", user_df)
        except Exception as e:
            return jsonify({"error": f"Error creating DataFrame: {str(e)}"}), 400

        # Find the closest matches in the dataset
        try:
            distances, nearest_indices = knn.kneighbors(user_df)
            
            # Get the top 5 matches
            top_indices = nearest_indices[0]
            top_distances = distances[0]
            
            # Get the deficiency predictions for each match
            deficiency_codes = df_kaggle.loc[top_indices, "Predicted Deficiency"].values
            deficiency_predictions = [le_deficiency.inverse_transform([int(code)])[0] for code in deficiency_codes]
            
            print("Top 5 matches:")
            for i, (idx, dist, pred) in enumerate(zip(top_indices, top_distances, deficiency_predictions)):
                print(f"  {i+1}. Index: {idx}, Distance: {dist:.4f}, Prediction: {pred}")
            
            # Count occurrences of each deficiency in the top matches
            unique_predictions = list(set(deficiency_predictions))
            
            # If all 5 predictions are the same, just use that prediction
            if len(unique_predictions) == 1:
                predicted_deficiency = unique_predictions[0]
                # For top 3, we'll use the main deficiency and add two general recommendations
                if predicted_deficiency == "No Deficiency":
                    # If no deficiency, only return that one
                    top_vitamins = [
                        {"name": "No Deficiency", "priority": "High"}
                    ]
                else:
                    top_vitamins = [
                        {"name": predicted_deficiency, "priority": "High"},
                        {"name": "Vitamin D", "priority": "Medium"},
                        {"name": "Multivitamin", "priority": "Low"}
                    ]
            else:
                # Create a scoring system that considers:
                # 1. The distance (closer matches get higher scores)
                # 2. The rarity of the deficiency (rarer deficiencies get a boost)
                
                # Calculate distance-based scores (inverse of distance, normalized)
                distance_scores = 1 / (top_distances + 0.1)  # Add 0.1 to avoid division by zero
                distance_scores = distance_scores / distance_scores.sum()
                
                # Calculate final scores for each prediction
                prediction_scores = {}
                for pred, dist, score in zip(deficiency_predictions, top_distances, distance_scores):
                    # Base score is the distance score
                    base_score = score
                    
                    # Add a boost based on the rarity of the deficiency
                    # Get the weight for this deficiency (higher for rarer deficiencies)
                    rarity_boost = deficiency_weights.get(pred, 0.1)
                    
                    # Combine scores (70% distance, 30% rarity)
                    final_score = 0.7 * base_score + 0.3 * rarity_boost
                    
                    if pred in prediction_scores:
                        prediction_scores[pred] += final_score
                    else:
                        prediction_scores[pred] = final_score
                
                print("Prediction scores:", prediction_scores)
                
                # Get the top 3 predictions based on scores
                sorted_predictions = sorted(prediction_scores.items(), key=lambda x: x[1], reverse=True)
                top_vitamins = []
                
                # Check if "No Deficiency" is in the top predictions
                has_no_deficiency = any(pred == "No Deficiency" for pred, _ in sorted_predictions[:3])
                
                # If "No Deficiency" is one of the top predictions, only return that
                if has_no_deficiency:
                    top_vitamins = [{"name": "No Deficiency", "priority": "High"}]
                else:
                    # Add up to 3 predictions with priority levels
                    priorities = ["High", "Medium", "Low"]
                    for i, (pred, score) in enumerate(sorted_predictions[:3]):
                        top_vitamins.append({
                            "name": pred,
                            "priority": priorities[i]
                        })
                
                # If we have fewer than 3 predictions and no "No Deficiency", add general recommendations
                if len(top_vitamins) < 3 and not has_no_deficiency:
                    general_recs = ["Vitamin D", "Multivitamin", "Vitamin C"]
                    for i in range(len(top_vitamins), 3):
                        # Make sure we don't duplicate recommendations
                        for rec in general_recs:
                            if not any(v["name"] == rec for v in top_vitamins):
                                top_vitamins.append({
                                    "name": rec,
                                    "priority": priorities[i]
                                })
                                break
                
                # Select the prediction with the highest score as the main deficiency
                predicted_deficiency = sorted_predictions[0][0]
            
            print("Final predicted deficiency:", predicted_deficiency)
            print("Top 3 vitamin recommendations:", top_vitamins)
            
        except Exception as e:
            print(f"Error in prediction: {str(e)}")
            # Fallback to the closest match if there's an error in the weighted approach
            best_match_idx = nearest_indices[0][0]
            predicted_deficiency_code = df_kaggle.loc[best_match_idx, "Predicted Deficiency"]
            predicted_deficiency = le_deficiency.inverse_transform([int(predicted_deficiency_code)])[0]
            print("Fallback predicted deficiency:", predicted_deficiency)
            
            # Fallback top vitamins
            if predicted_deficiency == "No Deficiency":
                top_vitamins = [
                    {"name": "No Deficiency", "priority": "High"}
                ]
            else:
                top_vitamins = [
                    {"name": predicted_deficiency, "priority": "High"},
                    {"name": "Vitamin D", "priority": "Medium"},
                    {"name": "Multivitamin", "priority": "Low"}
                ]

        # Return response to the frontend with top 3 vitamins
        return jsonify({
            "predicted_deficiency": predicted_deficiency,
            "recommended_vitamins": predicted_deficiency,
            "top_vitamins": top_vitamins
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

# Run the Flask App
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
