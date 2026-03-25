from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
model = pickle.load(open("models/fake_news_model.pkl", "rb"))
vectorizer = pickle.load(open("models/vectorizer.pkl", "rb"))


@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Endpoint to predict if news is fake or real.
    Expects JSON: {"text": "news article text"}
    Returns: {"prediction": "Fake/Real", "fake_prob": float, "real_prob": float, "confidence": float, "message": str}
    """
    try:
        data = request.get_json()
        
        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' field"}), 400
        
        news = data["text"].strip()
        
        if len(news) < 40:
            return jsonify({
                "error": "Text too short",
                "message": "Please provide a longer news paragraph for better prediction (minimum 40 characters)."
            }), 400
        
        # Vectorize and predict
        news_vector = vectorizer.transform([news])
        prediction = model.predict(news_vector)[0]
        probabilities = model.predict_proba(news_vector)[0]
        
        fake_prob = float(probabilities[0])
        real_prob = float(probabilities[1])
        confidence = float(max(fake_prob, real_prob))
        
        # Determine result
        if confidence < 0.60:
            result = {
                "prediction": "Unknown",
                "fake_prob": fake_prob,
                "real_prob": real_prob,
                "confidence": confidence,
                "message": "Model confidence is low for this input. Try a full article text."
            }
        elif prediction == 0:
            result = {
                "prediction": "Fake",
                "fake_prob": fake_prob,
                "real_prob": real_prob,
                "confidence": confidence,
                "message": "This news appears to be fake."
            }
        else:
            result = {
                "prediction": "Real",
                "fake_prob": fake_prob,
                "real_prob": real_prob,
                "confidence": confidence,
                "message": "This news appears to be real."
            }
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)