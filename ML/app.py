from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import logging

# ---------------- CATEGORY MAPS ----------------
SECTOR_MAP = {
    "Healthcare": 0,
    "Agriculture": 1,
    "Urban": 2,
    "Energy": 3
}

PROTOCOL_MAP = {
    "TCP": 0,
    "UDP": 1,
    "HTTP": 2,
    "HTTPS": 3
}

OPERATION_MAP = {
    "Read": 0,
    "Write": 1
}

CONNECTION_MAP = {
    "Connected": 1,
    "Disconnected": 0
}

# ---------------- FEATURE ORDER ----------------
FEATURE_COLUMNS = [
    "device_id",
    "sector",
    "location_id",
    "protocol",
    "packet_size",
    "latency_ms",
    "connection_status",
    "cpu_usage_percent",
    "memory_usage_percent",
    "battery_level",
    "temperature_c",
    "operation_type",
    "data_value_integrity"
]

# ---------------- APP SETUP ----------------
app = Flask(__name__)

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s"
)

# ---------------- LOAD MODELS ----------------
logging.info("Loading ML models...")

iso_forest = joblib.load("model/isolation_forest_model.pkl")
xgb_model = joblib.load("model/xgboost_attack_model.pkl")
scaler = joblib.load("model/scaler.pkl")

logging.info("Models loaded successfully")

ATTACK_MAP = {
    0: "Normal",
    1: "DDoS",
    2: "Ransomware",
    3: "MITM",
    4: "Injection",
    5: "Spoofing"
}

# ---------------- UTILITY FUNCTIONS ----------------
def map_severity(confidence, is_anomalous):
    if not is_anomalous:
        return "Low"
    if confidence >= 0.85:
        return "Critical"
    elif confidence >= 0.65:
        return "High"
    else:
        return "Medium"

def generate_reason(data, is_anomalous):
    if not is_anomalous:
        return ["Normal behavior observed"]

    reasons = []

    if data.get("packet_size", 0) > 1500:
        reasons.append("Abnormally high packet size")
    if data.get("latency_ms", 0) > 200:
        reasons.append("High network latency")
    if data.get("cpu_usage_percent", 0) > 80:
        reasons.append("CPU usage spike detected")
    if data.get("memory_usage_percent", 0) > 80:
        reasons.append("High memory usage")
    if data.get("data_value_integrity", 1) == 0:
        reasons.append("Data integrity violation")

    return reasons if reasons else ["Suspicious activity detected"]

# ---------------- API ENDPOINT ----------------
@app.route("/api/ml/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        logging.info(f"Incoming request: {data}")

        # ---------------- ENCODE CATEGORICALS ----------------
        data["sector"] = SECTOR_MAP.get(data.get("sector"), 0)
        data["protocol"] = PROTOCOL_MAP.get(data.get("protocol"), 0)
        data["operation_type"] = OPERATION_MAP.get(data.get("operation_type"), 0)
        data["connection_status"] = CONNECTION_MAP.get(data.get("connection_status"), 0)

        # Safety: device_id must be numeric
        try:
            data["device_id"] = int(data.get("device_id", 0))
        except:
            data["device_id"] = 0

        # ---------------- CREATE DATAFRAME ----------------
        df = pd.DataFrame([data])

        # Enforce column order
        X = df[FEATURE_COLUMNS]

        # ---------------- SCALE ----------------
        X_scaled = scaler.transform(X)

        # ---------------- ANOMALY DETECTION ----------------
        anomaly_raw = iso_forest.predict(X_scaled)[0]
        is_anomalous = bool(anomaly_raw == -1)

        logging.info(f"Anomaly result: {is_anomalous}")

        # ---------------- ATTACK CLASSIFICATION ----------------
        probabilities = xgb_model.predict_proba(X_scaled)[0]
        pred_class = int(np.argmax(probabilities))
        confidence = float(np.max(probabilities))

        ml_attack = ATTACK_MAP.get(pred_class, "Normal")

        # 🔥 FORCE NORMAL IF NOT ANOMALOUS
        final_attack = "Normal" if not is_anomalous else ml_attack

        response = {
            "attack_type": final_attack,
            "is_anomalous": bool(is_anomalous),
            "confidence": float(round(confidence, 2)),
            "severity": map_severity(confidence, is_anomalous),
            "reason": generate_reason(data, is_anomalous)
        }

        logging.info(f"ML Response: {response}")
        return jsonify(response), 200

    except Exception as e:
        logging.error(f"ML Service Error: {str(e)}", exc_info=True)

        # 🔥 FAIL SAFE: NEVER BREAK PIPELINE
        return jsonify({
            "attack_type": "Normal",
            "is_anomalous": False,
            "confidence": 0.0,
            "severity": "Low",
            "reason": ["ML fallback due to processing error"]
        }), 200

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    logging.info("Starting ML service on port 5000")
    import os
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    # app.run(host="0.0.0.0", port=5000, debug=True)
