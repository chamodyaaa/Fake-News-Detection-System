# Fake News Detection System

A full-stack fake news detection project with:

- **React frontend** for entering article text and viewing prediction probabilities
- **Flask API backend** for model inference
- **Scikit-learn training script** to train and save the model from CSV datasets

## Project Structure

```text
fakenewscopy/
├── app.py                       # Flask API server
├── real.py                      # Model training script
├── Fake.csv                     # Fake news dataset
├── True.csv                     # Real news dataset
├── models/                      # Saved model artifacts (.pkl)
├── src/
│   ├── App.js
│   └── components/
│       ├── FakeNewsDetector.jsx # Main UI component
│       └── FakeNewsDetector.css # UI styles
├── public/
├── package.json
└── README.md
```

## Prerequisites

- Python 3.9+
- Node.js 16+ and npm

## 1) Setup Python Environment

From project root:

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# Windows CMD
.venv\Scripts\activate.bat
```

Install backend and ML dependencies:

```bash
pip install flask flask-cors pandas scikit-learn nltk
```

Download required NLTK data (first time only):

```bash
python -c "import nltk; nltk.download('stopwords')"
```

## 2) Train the Model

Run:

```bash
python real.py
```

This generates:

- `models/fake_news_model.pkl`
- `models/vectorizer.pkl`

## 3) Start Backend API

```bash
python app.py
```

Backend runs at: `http://localhost:5000`

Health check:

- `GET /health`

Prediction endpoint:

- `POST /api/predict`
- Request body:

```json
{
  "text": "Paste a news paragraph here..."
}
```

- Example response:

```json
{
  "prediction": "Fake",
  "fake_prob": 0.91,
  "real_prob": 0.09,
  "confidence": 0.91,
  "message": "This news appears to be fake."
}
```

## 4) Start Frontend

In a new terminal from project root:

```bash
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

## How to Use

1. Keep backend (`app.py`) and frontend (`npm start`) running.
2. Open the React app in browser.
3. Paste a news paragraph (minimum 40 characters).
4. Click **Analyze** to see:
   - Prediction (`Fake`, `Real`, or `Unknown`)
   - Fake/Real probabilities
   - Confidence score

## Common Issues

- **CORS / API connection error**: ensure Flask is running on port `5000`.
- **Model files missing**: run `python real.py` before starting `app.py`.
- **NLTK stopwords error**: run `python -c "import nltk; nltk.download('stopwords')"`.
- **Port already in use**: stop the conflicting process or change app port.

## Notes

- `real.py` currently trains a Logistic Regression model with TF-IDF features.
- `app.py` marks predictions with confidence below `0.60` as `Unknown`.
