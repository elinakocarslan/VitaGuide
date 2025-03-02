from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

# Load the Kaggle dataset
csv_file_path = "data/deficiency_data.csv" 
df_kaggle = pd.read_csv(csv_file_path)

# Encode categorical deficiency labels
le = LabelEncoder()
df_kaggle["Predicted Deficiency"] = le.fit_transform(df_kaggle["Predicted Deficiency"])

demographic_columns = ["Age", "Gender", "Diet Type", "Living Environment"]
symptom_columns = df_kaggle.columns[4:-1]  # Symptoms start at column index 4, exclude last column
all_feature_columns = demographic_columns + list(symptom_columns)

# Encode categorical demographic data
for col in demographic_columns:
    df_kaggle[col] = le.fit_transform(df_kaggle[col])

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
        data = request.json  # Expecting {"1": 5, "2": 3, "3": 1, ...}
        if not data or "symptoms" not in data:
            return jsonify({"error": "Invalid quiz data"}), 400

         # Step 2: Convert demographics into numerical format
        user_data = {
            "Age": data["age"],
            "Gender": le.transform([data["gender"]])[0],
            "Diet Type": le.transform([data["diet"]])[0],
            "Living Environment": le.transform([data["living_environment"]])[0]
        }

        # Convert quiz responses (1,2 → No (0), 3,4,5 → Yes (1))
        symptom_binary = {str(symptom): (1 if score >= 3 else 0) for symptom, score in data["symptoms"].items()}

        # Convert into DataFrame matching dataset format
        user_df = pd.DataFrame([{**user_data, **symptom_binary}], columns=all_feature_columns).fillna(0)

        # Find the closest match in the dataset
        _, nearest_idx = knn.kneighbors(user_df)
        best_match_idx = nearest_idx[0][0]
        predicted_deficiency_code = df_kaggle.loc[best_match_idx, "Predicted Deficiency"]

        # Decode the predicted deficiency label
        predicted_deficiency = le.inverse_transform([int(predicted_deficiency_code)])[0]

        #Extract recommended vitamins from dataset
        recommended_vitamins = df_kaggle.loc[best_match_idx, "Recommended Vitamin"]  # Assuming this column exists

        # Return response to the frontend
        return jsonify({
            "predicted_deficiency": predicted_deficiency,
            "recommended_vitamins": recommended_vitamins
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask App
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
