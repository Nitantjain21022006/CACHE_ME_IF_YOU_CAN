# ML Model Input & Output Specification

## Overview

This document defines the **input features**, **model outputs**, and **interpretation logic** for the machine learning components used in this project.

The ML pipeline consists of:
1. **Anomaly Detection** (Isolation Forest)
2. **Attack Classification** (XGBoost)
3. **Severity Mapping & Explanation** (Post-ML Logic)

This separation ensures transparency, explainability, and safe operational behavior.

---

## Input Feature Specification

The ML service expects input data in a **fixed feature order**.  
All incoming events are normalized and encoded before inference.

### Feature Order

```python
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

## Feature descriptions
| Feature Name           | Type        | Description                                          |
| ---------------------- | ----------- | ---------------------------------------------------- |
| `device_id`            | Categorical | Unique identifier for the source device or system    |
| `sector`               | Categorical | Operational domain (healthcare, agriculture, urban)  |
| `location_id`          | Numerical   | Logical or physical location identifier              |
| `protocol`             | Categorical | Network protocol used (TCP, UDP, HTTPS, etc.)        |
| `packet_size`          | Numerical   | Size of the network packet in bytes                  |
| `latency_ms`           | Numerical   | Network latency in milliseconds                      |
| `connection_status`    | Categorical | Connection state (Connected, Disconnected, Unstable) |
| `cpu_usage_percent`    | Numerical   | CPU utilization at event time                        |
| `memory_usage_percent` | Numerical   | Memory utilization at event time                     |
| `battery_level`        | Numerical   | Device battery percentage                            |
| `temperature_c`        | Numerical   | Device operating temperature in Celsius              |
| `operation_type`       | Categorical | Action type (Read / Write)                           |
| `data_value_integrity` | Binary      | 1 = intact, 0 = compromised                          |

## Feature Engineering Notes

Categorical features are label-encoded or one-hot encoded prior to inference.
Numerical features are normalized using training-time statistics.
Feature order is strictly enforced to avoid inference errors.
Missing values are imputed conservatively to prevent false escalation.

Attack Classification Output

The supervised classifier predicts an attack class label.

Attack Label Mapping

``
ATTACK_MAP = {
    0: "Normal",
    1: "DDoS",
    2: "Ransomware",
    3: "MITM",
    4: "Injection",
    5: "Spoofing"
}
``

Model Output Schema

Each inference request returns the following structured response:
``
{
  "attack_type": "Spoofing",
  "is_anomalous": true,
  "confidence": 0.87,
  "severity": "HIGH",
  "reason": [
    "High event rate detected",
    "Data integrity violation",
    "Write operation on critical system"
  ]
}

``

## Output Field Definitions
| Field Name     | Type    | Description                                |
| -------------- | ------- | ------------------------------------------ |
| `attack_type`  | String  | Predicted attack category                  |
| `is_anomalous` | Boolean | Output of Isolation Forest                 |
| `confidence`   | Float   | Classifier confidence score (0.0 – 1.0)    |
| `severity`     | String  | Final severity level (LOW / MEDIUM / HIGH) |
| `reason`       | Array   | Human-readable explanation of escalation   |


Severity Determination Logic

Severity is not directly predicted by ML.
It is derived using:

Classifier confidence

Anomaly signal

Contextual escalation rules

This design prevents over-reliance on raw ML outputs and reduces false positives.

Explainability & Auditability

The reason field provides:

Transparency into escalation decisions

Actionable context for analysts

Reduced alert fatigue

Easier debugging and compliance review

Error Handling & Safety

Out-of-range values are clamped before inference

Unknown categorical values fall back to safe defaults

Severity is never downgraded post-ML inference



---

## Why this file is valuable

- ✔ Judges can **understand your ML without code**
- ✔ Backend/frontend devs know exactly what to send/expect
- ✔ Shows **maturity and discipline**
- ✔ Complements `RESEARCH.md` perfectly

---