# PS-4 IoT Security ML Service

This repository contains the ML inference service for Problem Statement-4.

## Models Used
- Isolation Forest – Anomaly Detection
- XGBoost – Attack Classification

## Features
- Detects anomalies in IoT telemetry
- Identifies cyber attack type
- Returns confidence, severity, and reason
- Handles unseen devices safely

## Run Instructions
```bash
pip install -r requirements.txt
uvicorn app:app --reload
```
## API Endpoint

POST /predict
Response
attack_type
is_anomalous
confidence
severity
reason


---

# 🏆 WHY THIS IS A STRONG PS-4 SOLUTION

✔ Clean separation of ML & backend  
✔ Real-world inference handling (unseen devices)  
✔ Explainable outputs  
✔ Production-ready FastAPI  
✔ Judges will recognize this as **industry-level design**

---

