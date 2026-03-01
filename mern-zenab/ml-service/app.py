from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model.pkl"

# Simple fallback model if model.pkl doesn't exist
def train_fallback_model():
    X = np.arange(180).reshape(-1, 1)
    # Synthetic data with slight upward trend
    y = 50 + X.flatten() * 0.1 + np.random.normal(0, 5, 180)
    model = LinearRegression()
    model.fit(X, y)
    return model

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'historical_pm25' not in data:
        return jsonify({"error": "Missing historical_pm25 data array"}), 400
        
    hist_pm25 = data['historical_pm25']
    location = data.get('location', 'Unknown')
    
    if len(hist_pm25) < 30:
        # Just use average if not enough data
        avg = sum(hist_pm25) / len(hist_pm25) if hist_pm25 else 50
        trend = "stable"
        next_30 = [avg] * 30
    else:
        # Prepare data for prediction
        # We'll train a simple local model on the fly or use pre-trained
        # Since each location has different base levels, training on the latest window is easy & effective for demo
        X = np.arange(len(hist_pm25)).reshape(-1, 1)
        y = np.array(hist_pm25)
        
        try:
            # We train a small local model on the provided history array
            local_model = LinearRegression()
            local_model.fit(X, y)
            
            # Predict next 30 days
            X_future = np.arange(len(hist_pm25), len(hist_pm25) + 30).reshape(-1, 1)
            next_30 = local_model.predict(X_future).tolist()
            
            # Ensure no negative PM2.5
            next_30 = [max(0, val) for val in next_30]
            
            coeff = local_model.coef_[0]
            if coeff > 0.5:
                trend = "increasing"
            elif coeff < -0.5:
                trend = "decreasing"
            else:
                trend = "stable"
                
        except Exception as e:
            print(f"Prediction error: {e}")
            avg = sum(hist_pm25)/len(hist_pm25)
            next_30 = [avg] * 30
            trend = "stable"

    avg_future = sum(next_30) / 30
    if avg_future > 90:
        hotspot_level = "high"
    elif avg_future > 60:
        hotspot_level = "medium"
    else:
        hotspot_level = "low"

    return jsonify({
        "location": location,
        "predicted_next_30_days": next_30,
        "trend": trend,
        "hotspot_level": hotspot_level,
        "message": "Prediction generated using local history."
    })

if __name__ == '__main__':
    from waitress import serve
    print("Starting ML Service on port 6000...")
    serve(app, host="0.0.0.0", port=6000)
