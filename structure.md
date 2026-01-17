# 🏗️ Cyber-Resilient Platform: Structure & Flow Guide

This document provides a technical roadmap of the implemented Cyber-Resilience Pipeline.

---

## 📂 1. Project Structure

### 🖥️ Backend (`/backend`)
*   `src/index.js`: Main entry point (Port 5001).
*   `src/controllers/events.controller.js`: Handles event ingestion and IP extraction.
*   `src/services/eventProcessor.service.js`: **Core Logic**. Aggregates metrics using Redis and orchestrates ML analysis.
*   `src/utils/mlClient.js`: Client for the Flask ML service.
*   `src/services/response.service.js`: Implements Phase 2 response actions (IP Block, User Disable).
*   `scripts/*.js`: **Phase 3** attack simulation scripts for live demos.

### 🧠 ML Service (`/ml-service`)
*   `app.py`: Flask API (Port 5000) hosting the Isolation Forest model.

### 🎨 Frontend (`/frontend`)
*   `src/pages/Dashboard.jsx`: Real-time metric visualization.
*   `src/pages/AlertDetails.jsx`: Response execution hub (Block IP / Disable User).

---

## 🔄 2. The Data Flow Pipeline

The system operates as a continuous security loop:

1.  **Event Ingestion**: Attacks/Events arrive via `POST /api/events/ingest`.
2.  **Metric Aggregation (Redis)**: `eventProcessor` stores events in a Redis Sorted Set and calculates **5 key metrics** over a 60-second sliding window:
    *   `event_rate`
    *   `failed_logins`
    *   `unique_ips`
    *   `avg_request_interval_ms`
    *   `error_rate`
3.  **ML Analysis**: Backend sends metrics to Python on Port 5000.
4.  **Anomaly Detection**: AI returns whether an anomaly exists (`is_anomalous`) and a natural language `reason`.
5.  **Alert Escalation**: If anomalous, an entry is created in **Supabase** and an email is sent via **Brevo**.
6.  **Autonomous Response**: Admin intervenes on the **Alert Details** page to execute real-time blocks.

---

## ✅ 3. How to Verify Everything

Follow these steps to conduct a full system audit:

### 1. Verification of Services
*   Ensure **Redis** is running.
*   Ensure **ML Service** is running: `python app.py` (Port 5000).
*   Ensure **Backend** is running: `npm run dev` (Port 5001).

### 2. Live Demo (Simulating Attack)
1.  Open the **Dashboard** in your browser.
2.  Run an attack: `node scripts/healthcare_attack.js` in a backend terminal.
3.  **Check Backend Logs**: You will see metric aggregation and ML Analysis calls.
4.  **Check Flask Logs**: You will see incoming requests on `/api/ml/analyze`.

### 3. Check Persistence & UI
1.  Observe the **Event Rate** chart spike on the Dashboard.
2.  Visit the **Alerts** page. Verify a new "ML_ANOMALY" alert appears.
3.  Click alert to view details. Verify the "Reason" explains the anomaly.

### 4. Execute Response (Phase 2)
1.  On the **Alert Details** page, click **"BLOCK IP"**.
2.  Verify the success message and check Redis (`keys security:blocked_ips`) to confirm the IP is blacklisted.
