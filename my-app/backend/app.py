import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import VitaGuideModel

app = Flask(__name__)
CORS(app)

# Initialize model when app starts
model = VitaGuideModel()

@app.route('/predict', methods=['POST'])
def get_prevalence():
    try:
        input_data = request.json
        if not input_data:
            return jsonify({'success': False, 'error': 'No input data provided'})
            
        prevalence = model.get_prevalence(input_data)
        return jsonify({
            'success': True, 
            'prediction': prevalence,
            'message': f"Vitamin A Deficiency Prevalence in {input_data['Entity']}: {prevalence:.2f}%"
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 