import React, { useEffect, useState } from "react";
import "./FakeNewsDetector.css";

const FakeNewsDetector = () => {
  const [newsText, setNewsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const prediction = result?.prediction?.toLowerCase();
    const theme =
      prediction === "fake"
        ? "fake"
        : prediction === "real"
          ? "real"
          : prediction === "unknown"
            ? "unknown"
            : "default";

    document.body.setAttribute("data-result-theme", theme);

    return () => {
      document.body.setAttribute("data-result-theme", "default");
    };
  }, [result]);

  const API_URL = "http://localhost:5000/api/predict";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!newsText.trim()) {
      setError("Please enter some news text.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newsText }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "An error occurred");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(
        "Failed to connect to API. Make sure Flask server is running on port 5000.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNewsText("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🔍 Fake News Detection System</h1>

        <form onSubmit={handleSubmit}>
          <textarea
            className="textarea"
            placeholder="Paste your news article here... (minimum 40 characters)"
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
            disabled={loading}
            rows="8"
          />

          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {result && (
          <div
            className={`result alert alert-${result.prediction.toLowerCase()}`}
          >
            <div className="result-header">
              <h2 className={`prediction ${result.prediction.toLowerCase()}`}>
                {result.prediction === "Fake" && "🚫 Fake News"}
                {result.prediction === "Real" && "✅ Real News"}
                {result.prediction === "Unknown" && "❓ Unknown"}
              </h2>
            </div>

            <div className="probabilities">
              <div className="probability-item">
                <span className="label">Fake Probability:</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill fake"
                    style={{ width: `${result.fake_prob * 100}%` }}
                  />
                </div>
                <span className="value">
                  {(result.fake_prob * 100).toFixed(2)}%
                </span>
              </div>

              <div className="probability-item">
                <span className="label">Real Probability:</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill real"
                    style={{ width: `${result.real_prob * 100}%` }}
                  />
                </div>
                <span className="value">
                  {(result.real_prob * 100).toFixed(2)}%
                </span>
              </div>

              <div className="confidence">
                <span className="label">Model Confidence:</span>
                <span className="value">
                  {(result.confidence * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            <p className="message">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeNewsDetector;
