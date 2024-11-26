from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS
app = Flask(__name__)


CORS(app)
datamap = {0:'Cargo Ships', 1:'Support, Utility, and Military Vessels',2:"Passenger, Recreational, and Others"}

# # Enable CORS for all origins or specific ones
# CORS(app, origins=["http://localhost:3000/clusters"])

@app.route("/")
def home():
    return "Machine Learning Prediction API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Parse input JSON
        data = request.get_json()
        features = data.get("features", None)
        algorithm = data.get("algorithm", None)
        if(algorithm=="gboost" or algorithm==None):
            # Load the saved model
            MODEL_PATH = "./ML_Model/gradientBoosting.pkl"  # Replace with the path to your .pkl file
            with open(MODEL_PATH, "rb") as file:
                model = pickle.load(file)
        else:
            # Load the saved model
            MODEL_PATH = "./ML_Model/gradientBoosting.pkl"  # Replace with the path to your .pkl file
            with open(MODEL_PATH, "rb") as file:
                model = pickle.load(file)

        if features is None:
            return jsonify({"error": "No features provided!"}), 400


        # Ensure the input is a 2D array (even if one sample)
        print(type(features))
        features_array = np.array(features).reshape(1, -1)


        # features_array = np.expand_dims(features_array, 0)

        # Perform prediction
        prediction = model.predict(features_array)
        probabilities = model.predict_proba(features_array)[0] if hasattr(model, "predict_proba") else None

        results = {datamap[i]: float(probabilities[i]) for i in range(len(probabilities))}

        # Prepare the response
        response = {
            "prediction": prediction.tolist(),
            "probabilities": results  if probabilities is not None else "Not Available",
        }

        print("returning_response")
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True,port=5001)