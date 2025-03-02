from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors
import numpy as np

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

# Encode categorical deficiency labels
le_deficiency = LabelEncoder()
df_kaggle["Predicted Deficiency"] = le_deficiency.fit_transform(df_kaggle["Predicted Deficiency"])

# Encode all categorical columns
encoders = {}
for col in categorical_columns:
    if col in df_kaggle.columns:
        encoders[col] = LabelEncoder()
        df_kaggle[col] = encoders[col].fit_transform(df_kaggle[col].astype(str))

# All feature columns for the model
all_feature_columns = categorical_columns + symptom_columns

# Train a Nearest Neighbors model for comparison
knn = NearestNeighbors(n_neighbors=1, metric="euclidean")
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

        # Find the closest match in the dataset
        try:
            _, nearest_idx = knn.kneighbors(user_df)
            best_match_idx = nearest_idx[0][0]
            predicted_deficiency_code = df_kaggle.loc[best_match_idx, "Predicted Deficiency"]
            
            # Decode the predicted deficiency label
            predicted_deficiency = le_deficiency.inverse_transform([int(predicted_deficiency_code)])[0]
            
            print("Predicted deficiency:", predicted_deficiency)
        except Exception as e:
            return jsonify({"error": f"Error finding match: {str(e)}"}), 500

        # For simplicity, we'll just return the deficiency as the recommendation
        recommended_vitamins = predicted_deficiency
        
        # Return response to the frontend
        return jsonify({
            "predicted_deficiency": predicted_deficiency,
            "recommended_vitamins": recommended_vitamins,
            "confidence_score": calculate_confidence_score(user_df, df_kaggle.iloc[best_match_idx])
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

def calculate_confidence_score(user_data, matched_data):
    """
    Calculate a confidence score based on how well the user data matches the dataset
    """
    # Calculate Euclidean distance and convert to a confidence score
    distance = np.sqrt(((user_data.iloc[0] - matched_data[all_feature_columns]) ** 2).sum())
    max_distance = np.sqrt(len(all_feature_columns))  # Maximum possible distance
    confidence_score = max(0, min(100, (1 - distance/max_distance) * 100))
    return round(confidence_score, 2)

# Run the Flask App
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
