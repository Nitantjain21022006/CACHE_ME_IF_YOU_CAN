from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# ---------------- LOAD MODELS ----------------
iso_forest = joblib.load("model/isolation_forest_model.pkl")
xgb_model = joblib.load("model/xgboost_attack_model.pkl")
scaler = joblib.load("model/scaler.pkl")
label_encoders = joblib.load("model/label_encoders.pkl")

ATTACK_MAP = {
    0: "Normal",
    1: "DDoS",
    2: "Ransomware",
    3: "MITM",
    4: "Injection",
    5: "Spoofing"
}

# ---------------- UTILITY FUNCTIONS ----------------
def safe_encode(le, value):
    """Encode unseen categorical values safely"""
    return le.transform([value])[0] if value in le.classes_ else -1

def map_severity(confidence):
    if confidence >= 0.85:
        return "High"
    elif confidence >= 0.65:
        return "Medium"
    else:
        return "Low"

def generate_reason(data):
    reasons = []

    if data.get("packet_size", 0) > 1500:
        reasons.append("Abnormally high packet size")
    if data.get("latency_ms", 0) > 200:
        reasons.append("High network latency")
    if data.get("cpu_usage_percent", 0) > 80:
        reasons.append("High CPU usage")
    if data.get("memory_usage_percent", 0) > 80:
        reasons.append("High memory usage")
    if data.get("data_value_integrity", 1) == 0:
        reasons.append("Data integrity compromised")

    return ", ".join(reasons) if reasons else "Normal behavior observed"

# ---------------- API ENDPOINT ----------------
@app.route("/api/ml/analyze", methods=["POST"])
def analyze():
    try:
        input_data = request.get_json()

        # Convert to DataFrame
        df = pd.DataFrame([input_data])

        # Encode categorical columns
        for col in ["device_id", "sector", "protocol", "operation_type"]:
            df[col] = safe_encode(label_encoders[col], df[col][0])

        # Drop non-model columns
        X = df.drop(["timestamp", "ip_src", "ip_dest"], axis=1)

        # Scale features
        X_scaled = scaler.transform(X)

        # -------- Anomaly Detection --------
        anomaly_pred = iso_forest.predict(X_scaled)[0]
        is_anomalous = True if anomaly_pred == -1 else False

        # -------- Attack Classification --------
        probabilities = xgb_model.predict_proba(X_scaled)[0]
        pred_class = int(np.argmax(probabilities))
        confidence = float(np.max(probabilities))

        response = {
            "attack_type": ATTACK_MAP[pred_class],
            "is_anomalous": is_anomalous,
            "confidence": round(confidence, 2),
            "severity": map_severity(confidence),
            "reason": generate_reason(input_data)
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
