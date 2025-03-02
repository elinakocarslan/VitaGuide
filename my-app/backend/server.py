# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# from sklearn.preprocessing import LabelEncoder
# from sklearn.neighbors import NearestNeighbors
# import os

# app = Flask(__name__)
# CORS(app)

# # Ensure the script gets the absolute path
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# csv_file_path = os.path.join(BASE_DIR, "data", "deficiency_data.csv")

# # Load the database
# df_kaggle = pd.read_csv(csv_file_path)

# # Encode categorical deficiency labels
# if "Predicted Deficiency" not in df_kaggle.columns:
#     raise ValueError("Column 'Predicted Deficiency' is missing in the dataset.")

# deficiency_encoder = LabelEncoder()
# df_kaggle["Predicted Deficiency"] = deficiency_encoder.fit_transform(df_kaggle["Predicted Deficiency"])

# # Extract relevant columns
# demographic_columns = ["Age", "Gender", "Diet Type", "Living Environment"]
# if not all(col in df_kaggle.columns for col in demographic_columns):
#     raise ValueError("One or more demographic columns are missing in the dataset.")

# symptom_columns = df_kaggle.columns[4:-2]  # Symptoms start at index 4, exclude last two columns
# all_feature_columns = demographic_columns + list(symptom_columns)

# # Create encoders for categorical columns
# encoders = {}
# for col in demographic_columns:
#     if df_kaggle[col].dtype == "object":
#         encoders[col] = LabelEncoder()
#         df_kaggle[col] = encoders[col].fit_transform(df_kaggle[col])

# # Convert all symptom columns to numeric
# df_kaggle[symptom_columns] = df_kaggle[symptom_columns].apply(pd.to_numeric, errors="coerce").fillna(0)

# # Train the Nearest Neighbors model
# knn = NearestNeighbors(n_neighbors=3, metric="euclidean")
# knn.fit(df_kaggle[all_feature_columns])

# vitamin_recommendations = {
#     "Iron": ["Iron", "Vitamin C", "Folate", "B12"],
#     "Vitamin D": ["Vitamin D", "Magnesium", "Calcium", "Omega-3"],
#     "Vitamin B12": ["B12", "Folate", "Iron", "Zinc"],
#     "Calcium": ["Calcium", "Vitamin D", "Magnesium", "Phosphorus"],
#     "Magnesium": ["Magnesium", "B6", "Vitamin D", "Zinc"],
#     "Zinc": ["Zinc", "Vitamin A", "Copper", "Iron"]
# }

# @app.route("/analyze-quiz", methods=["POST"])
# def analyze_quiz():
#     try:
#         data = request.json
#         if not data or "symptoms" not in data:
#             return jsonify({"error": "Invalid quiz data"}), 400

#         # Convert demographics into numeric format
#         user_data = {}
#         for col in demographic_columns:
#             value = data.get(col, None)
#             if col in encoders:
#                 if value in encoders[col].classes_:
#                     user_data[col] = encoders[col].transform([value])[0]
#                 else:
#                     user_data[col] = -1  # Handle unseen categories
#             else:
#                 user_data[col] = pd.to_numeric(value, errors='coerce') if value is not None else 0

#         # Convert quiz responses (1,2 → No (0), 3,4,5 → Yes (1))
#         symptom_binary = {str(symptom): (1 if score >= 3 else 0) for symptom, score in data["symptoms"].items()}
#         print("Processed Symptoms:\n", symptom_binary) 

#         # Create DataFrame for prediction
#         user_df = pd.DataFrame([{**user_data, **symptom_binary}], columns=all_feature_columns).fillna(0)

#         # Find closest match in dataset
#         _, nearest_idx = knn.kneighbors(user_df)
#         best_match_idx = nearest_idx[0][0]
#         predicted_deficiency_code = df_kaggle.loc[best_match_idx, "Predicted Deficiency"]

#         # Decode predicted deficiency label
#         nearest_deficiencies = df_kaggle.loc[nearest_idx[0], "Predicted Deficiency"]
#         predicted_deficiency_code = nearest_deficiencies.mode()[0] 
#         predicted_deficiency = deficiency_encoder.inverse_transform([int(predicted_deficiency_code)])[0]

#         # Extract recommended vitamins from dataset
#         recommended_vitamins = vitamin_recommendations.get(predicted_deficiency)
#         print("User Input:\n", user_df)
#         print("Nearest Neighbor Index:", best_match_idx)
#         print("Matched Entry:\n", df_kaggle.iloc[best_match_idx])
#         return jsonify({
#             "predicted_deficiency": predicted_deficiency,
#             "recommended_vitamins": recommended_vitamins
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True, host="0.0.0.0", port=5001)

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import NearestNeighbors
import os
import numpy as np

app = Flask(__name__)
CORS(app)

# Ensure the script gets the absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(BASE_DIR, "data", "deficiency_data.csv")

# Load the database
df_kaggle = pd.read_csv(csv_file_path)

# Encode categorical deficiency labels
if "Predicted Deficiency" not in df_kaggle.columns:
    raise ValueError("Column 'Predicted Deficiency' is missing in the dataset.")

deficiency_encoder = LabelEncoder()
df_kaggle["Predicted Deficiency"] = deficiency_encoder.fit_transform(df_kaggle["Predicted Deficiency"])

# Extract relevant columns
demographic_columns = ["Age", "Gender", "Diet Type", "Living Environment"]
if not all(col in df_kaggle.columns for col in demographic_columns):
    raise ValueError("One or more demographic columns are missing in the dataset.")

symptom_columns = df_kaggle.columns[4:-2]  # Symptoms start at index 4, exclude last two columns
all_feature_columns = demographic_columns + list(symptom_columns)

# Create encoders for categorical columns
encoders = {}
for col in demographic_columns:
    if df_kaggle[col].dtype == "object":
        encoders[col] = LabelEncoder()
        df_kaggle[col] = encoders[col].fit_transform(df_kaggle[col])

# Convert all symptom columns to numeric
df_kaggle[symptom_columns] = df_kaggle[symptom_columns].apply(pd.to_numeric, errors="coerce").fillna(0)

# Scale features to give appropriate weight to each feature
scaler = StandardScaler()
df_kaggle_scaled = pd.DataFrame(
    scaler.fit_transform(df_kaggle[all_feature_columns]),
    columns=all_feature_columns
)

# Store feature importance weights - give more weight to symptoms than demographics
feature_weights = np.ones(len(all_feature_columns))
for i, col in enumerate(all_feature_columns):
    if col in demographic_columns:
        feature_weights[i] = 0.5  # Lower weight for demographics
    else:
        feature_weights[i] = 1.5  # Higher weight for symptoms

# Train the Nearest Neighbors model with weighted distance metric
def weighted_euclidean(x, y):
    return np.sqrt(np.sum(feature_weights * (x - y) ** 2))

knn = NearestNeighbors(n_neighbors=5, metric=weighted_euclidean)
knn.fit(df_kaggle_scaled)

vitamin_recommendations = {
    "Iron": ["Iron", "Vitamin C", "Folate", "B12"],
    "Vitamin D": ["Vitamin D", "Magnesium", "Calcium", "Omega-3"],
    "Vitamin B12": ["B12", "Folate", "Iron", "Zinc"],
    "Calcium": ["Calcium", "Vitamin D", "Magnesium", "Phosphorus"],
    "Magnesium": ["Magnesium", "B6", "Vitamin D", "Zinc"],
    "Zinc": ["Zinc", "Vitamin A", "Copper", "Iron"],
    "None": ["Multivitamin", "Vitamin D", "Omega-3", "Zinc"]  # Added for when no deficiency is detected
}

@app.route("/analyze-quiz", methods=["POST"])
def analyze_quiz():
    try:
        data = request.json
        if not data or "symptoms" not in data:
            return jsonify({"error": "Invalid quiz data"}), 400

        # Convert demographics into numeric format
        user_data = {}
        for col in demographic_columns:
            value = data.get(col, None)
            if col in encoders:
                if value in encoders[col].classes_:
                    user_data[col] = encoders[col].transform([value])[0]
                else:
                    user_data[col] = -1  # Handle unseen categories
            else:
                user_data[col] = pd.to_numeric(value, errors='coerce') if value is not None else 0

        # Process symptoms - store original values for threshold analysis
        symptom_values = {symptom: score for symptom, score in data["symptoms"].items()}
        
        # Convert quiz responses (1,2 → No (0), 3,4,5 → Yes (1))
        symptom_binary = {str(symptom): (1 if score >= 3 else 0) for symptom, score in data["symptoms"].items()}
        
        # Calculate the average symptom score to determine if there's a deficiency at all
        avg_symptom_score = sum(symptom_values.values()) / len(symptom_values) if symptom_values else 0
        symptom_severity = sum(1 for score in symptom_values.values() if score >= 3)
        
        # Create DataFrame for prediction
        user_df = pd.DataFrame([{**user_data, **symptom_binary}], columns=all_feature_columns).fillna(0)
        
        # Scale user data using the same scaler
        user_df_scaled = pd.DataFrame(
            scaler.transform(user_df),
            columns=all_feature_columns
        )

        # Check if symptoms are too low to indicate any deficiency
        if avg_symptom_score < 2.0 or symptom_severity < 2:
            return jsonify({
                "predicted_deficiency": "None",
                "recommended_vitamins": vitamin_recommendations["None"],
                "confidence": 0,
                "symptom_summary": {
                    "average_score": round(avg_symptom_score, 2),
                    "severity_count": symptom_severity,
                    "threshold": "Low symptoms - no clear deficiency detected"
                }
            })

        # Find closest matches in dataset
        distances, nearest_idx = knn.kneighbors(user_df_scaled)
        
        # Get the 3 most common deficiencies among nearest neighbors
        nearest_deficiencies = df_kaggle.iloc[nearest_idx[0]]["Predicted Deficiency"].values
        deficiency_codes, counts = np.unique(nearest_deficiencies, return_counts=True)
        
        # Calculate confidence based on neighbor distances and count of matching deficiencies
        confidence = (counts[0] / len(nearest_idx[0])) * 100
        
        # Get the most common deficiency
        predicted_deficiency_code = deficiency_codes[np.argmax(counts)]
        predicted_deficiency = deficiency_encoder.inverse_transform([int(predicted_deficiency_code)])[0]
        
        # Calculate distance-weighted voting for more robust prediction
        if confidence < 60:  # If confidence is low, use distance-weighted voting
            # Adjust confidence calculation
            neighbor_weights = 1 / (1 + distances[0])
            neighbor_weights = neighbor_weights / sum(neighbor_weights)
            
            # Get weighted votes
            weighted_votes = {}
            for i, idx in enumerate(nearest_idx[0]):
                deficiency = df_kaggle.iloc[idx]["Predicted Deficiency"]
                deficiency_label = deficiency_encoder.inverse_transform([int(deficiency)])[0]
                weighted_votes[deficiency_label] = weighted_votes.get(deficiency_label, 0) + neighbor_weights[i]
            
            # Find deficiency with highest weighted vote
            predicted_deficiency = max(weighted_votes, key=weighted_votes.get)
            confidence = weighted_votes[predicted_deficiency] * 100

        # Extract recommended vitamins
        recommended_vitamins = vitamin_recommendations.get(predicted_deficiency, 
                                                          vitamin_recommendations["None"])

        return jsonify({
            "predicted_deficiency": predicted_deficiency,
            "recommended_vitamins": recommended_vitamins,
            "confidence": round(confidence, 1),
            "symptom_summary": {
                "average_score": round(avg_symptom_score, 2),
                "severity_count": symptom_severity,
                "threshold": "Moderate to high" if avg_symptom_score >= 3 else "Low to moderate"
            }
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)