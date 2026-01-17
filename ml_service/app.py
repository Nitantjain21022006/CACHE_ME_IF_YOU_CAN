from flask import Flask, request, jsonify
import pickle
import pandas as pd

# =====================================================
# App Initialization
# =====================================================
app = Flask(__name__)

# =====================================================
# Load Model & Encoders
# =====================================================
with open("model/xgb_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/preprocessor.pkl", "rb") as f:
    encoders = pickle.load(f)

# =====================================================
# Attack Mapping
# =====================================================
ATTACK_MAP = {
    0: "Normal",
    1: "DDoS",
    2: "MITM",
    3: "Spoofing",
    4: "Injection",
    5: "Ransomware"
}

# =====================================================
# EXACT Feature Order (FROM TRAINING)
# =====================================================
MODEL_FEATURES = [
    "sector",
    "location_id",
    "ip_src",
    "ip_dest",
    "protocol",
    "packet_size",
    "latency_ms",
    "cpu_usage_percent",
    "memory_usage_percent",
    "battery_level",
    "temperature_c",
    "connection_status",
    "operation_type",
    "data_value_integrity",
    "is_anomaly"
]

# =====================================================
# Default Values (GENERALIZED – NOT HEALTHCARE-SPECIFIC)
# =====================================================
DEFAULT_VALUES = {
    "sector": "Urban",
    "location_id": 0,
    "ip_src": 0,
    "ip_dest": 0,
    "protocol": "TCP",
    "packet_size": 500,
    "latency_ms": 50,
    "cpu_usage_percent": 30,
    "memory_usage_percent": 40,
    "battery_level": 80,
    "temperature_c": 25,
    "connection_status": "Connected",
    "operation_type": "Read",
    "data_value_integrity": 1,
    "is_anomaly": 0
}

CATEGORICAL_COLS = [
    "sector",
    "protocol",
    "connection_status",
    "operation_type"
]

# =====================================================
# Severity Mapping
# =====================================================
def map_severity(confidence):
    if confidence >= 0.70:
        return "High"
    elif confidence >= 0.50:
        return "Medium"
    return "Low"

# =====================================================
# Explainability (Reason Engine)
# =====================================================
def generate_reason(row):
    reasons = []

    if row["packet_size"] > 1500:
        reasons.append("Abnormally high packet size")

    if row["latency_ms"] > 300:
        reasons.append("High network latency")

    if row["cpu_usage_percent"] > 75:
        reasons.append("CPU usage spike detected")

    if row["memory_usage_percent"] > 80:
        reasons.append("Memory usage spike detected")

    if row["data_value_integrity"] == 0:
        reasons.append("Data integrity violation")

    return reasons or ["Deviation from learned normal behavior"]

# =====================================================
# Safe Encoding (NO UNSEEN CATEGORY CRASH)
# =====================================================
def safe_encode(df):
    for col in CATEGORICAL_COLS:
        if col in encoders:
            le = encoders[col]
            val = str(df.at[0, col])

            if val in le.classes_:
                df.at[0, col] = le.transform([val])[0]
            else:
                # unseen category → map to first known class
                df.at[0, col] = le.transform([le.classes_[0]])[0]
    return df

# =====================================================
# API ENDPOINT
# =====================================================
@app.route("/api/ml/analyze", methods=["POST"])
def analyze():
    try:
        payload = request.get_json(force=True, silent=True)
        if payload is None:
            payload = {}

        # Build full feature vector
        input_data = {}
        for feature in MODEL_FEATURES:
            input_data[feature] = payload.get(feature, DEFAULT_VALUES[feature])

        df = pd.DataFrame([input_data])

        # Encode categoricals
        df = safe_encode(df)

        # Enforce correct order & numeric safety
        df = df[MODEL_FEATURES]
        df = df.apply(pd.to_numeric, errors="coerce").fillna(0)

        # Prediction
        probabilities = model.predict_proba(df)[0]
        pred_class = int(probabilities.argmax())
        confidence = float(probabilities[pred_class])

        response = {
            "attack_type": ATTACK_MAP[pred_class],
            "is_anomalous": pred_class != 0,
            "confidence": round(confidence, 2),
            "severity": map_severity(confidence),
            "reason": generate_reason(input_data)
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            "attack_type": "Unknown",
            "is_anomalous": False,
            "confidence": 0.0,
            "severity": "Low",
            "reason": ["Inference error occurred"],
            "details": str(e)
        }), 200
        
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP"}), 200

# =====================================================
# Run Server
# =====================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
