from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors
import numpy as np

app = Flask(__name__)

# Load the Kaggle dataset
csv_file_path = "data/deficiency_data.csv" 
df_kaggle = pd.read_csv(csv_file_path)

# Create separate label encoders for each categorical column
label_encoders = {}
categorical_columns = ["Predicted Deficiency", "Age", "Gender", "Diet Type", "Living Environment", "Country"]

for column in categorical_columns:
    label_encoders[column] = LabelEncoder()
    df_kaggle[column] = label_encoders[column].fit_transform(df_kaggle[column])

demographic_columns = ["Age", "Gender", "Diet Type", "Living Environment", "Country"]
symptom_columns = df_kaggle.columns[5:-1]  # Symptoms start after demographic columns, exclude last column
all_feature_columns = demographic_columns + list(symptom_columns)

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
        if not data or "symptoms" not in data:
            return jsonify({"error": "Invalid quiz data"}), 400

        # Step 2: Convert demographics into numerical format
        try:
            user_data = {
                "Age": label_encoders["Age"].transform([data["age"]])[0],
                "Gender": label_encoders["Gender"].transform([data["gender"]])[0],
                "Diet Type": label_encoders["Diet Type"].transform([data["diet"]])[0],
                "Living Environment": label_encoders["Living Environment"].transform([data["living_environment"]])[0],
                "Country": label_encoders["Country"].transform([data["country"]])[0]
            }
        except ValueError as e:
            return jsonify({"error": f"Invalid demographic data: {str(e)}"}), 400

        # Convert quiz responses (1,2 → No (0), 3,4,5 → Yes (1))
        symptom_binary = {str(symptom): (1 if score >= 3 else 0) for symptom, score in data["symptoms"].items()}

        # Convert into DataFrame matching dataset format
        user_df = pd.DataFrame([{**user_data, **symptom_binary}], columns=all_feature_columns).fillna(0)

        # Find the closest match in the dataset
        _, nearest_idx = knn.kneighbors(user_df)
        best_match_idx = nearest_idx[0][0]
        predicted_deficiency_code = df_kaggle.loc[best_match_idx, "Predicted Deficiency"]

        # Decode the predicted deficiency label
        predicted_deficiency = label_encoders["Predicted Deficiency"].inverse_transform([int(predicted_deficiency_code)])[0]

        # Extract recommended vitamins from dataset
        recommended_vitamins = df_kaggle.loc[best_match_idx, "Recommended Vitamin"]

        # Return response to the frontend
        return jsonify({
            "predicted_deficiency": predicted_deficiency,
            "recommended_vitamins": recommended_vitamins,
            "confidence_score": calculate_confidence_score(user_df, df_kaggle.iloc[best_match_idx])
        })

    except Exception as e:
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
    app.run(debug=True, host="0.0.0.0", port=5000)
