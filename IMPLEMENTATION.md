# 🛡️ Cyber-Resilient Infrastructure Platform: Technical Implementation (A-Z)

This document details the complete logic, architecture, and data flow of the project.

---

## 🏗️ 1. Architecture Overview
The platform uses a **Modern Full-Stack Hybrid Architecture**:
- **Backend**: Node.js & Express with an MVC (Model-View-Controller) structure.
- **Frontend**: React (Vite) with Tailwind CSS for high-performance UI.
- **Database**: **Supabase (PostgreSQL)** for persistence.
- **Real-time Cache**: **Redis** for sub-millisecond metrics and frequency tracking.
- **Email Gateway**: **Brevo (REST API)** for secure OTP and alert notifications.

---

## 🔐 2. Authentication Logic
The project implements a custom **Security-First Auth Flow** (not utilizing Supabase Auth to maintain full control).

### A. Registration & Verification
- **Endpoint**: `POST /api/auth/register`
- **Logic**:
  1. Hashes password using `bcryptjs`.
  2. Generates a random 6-digit OTP.
  3. Stores user in `users` table as `is_verified: false`.
  4. Stores OTP in `otp_verifications` table with a 10-minute expiry.
  5. Sends OTP via **Brevo REST API**.
- **Endpoint**: `POST /api/auth/verify-otp`
  1. Validates OTP against the database history.
  2. Marks user as `is_verified: true` and deletes used OTP.

### B. Session Management
- **JWT Persistence**: Tokens are signed with a server-side `JWT_SECRET` and stored in **HTTP-Only Cookies**.
- **Security**: Prevents XSS attacks as JavaScript cannot access the token.

### C. Password Recovery
- **Request**: Generates a secure random 32-character token.
- **Flow**: Sends a reset link to the user; the user sets a new password which is re-hashed.

---

## 📊 3. Event Processing & Persistence
Every cyber-security event (e.g., login attempt, sensor data) follows a dual-storage path:

### A. Permanent Trace (Supabase)
- Every event is inserted into the `events` table with its sector (Healthcare, Agriculture, etc.), type, and severity.

### B. Real-time Metrics (Redis)
- **Incrementer**: The system increments a key `metrics:events:{sector}:{hour}` to track bursts.
- **Windowing**: Events are pushed into a Redis Sorted Set (ZSET) with a TTL of 10 minutes to allow the ML model to analyze "clumps" of activities.

### C. Machine Learning Integration (Phase 1)
- **Service**: Real-time analysis via a Flask/Python service on `localhost:5000/api/ml/analyze`.
- **Feature Engineering**: The backend aggregates 5 metrics over a 60s sliding window using Redis Sorted Sets:
  1. `event_rate`: Volume intensity.
  2. `failed_logins`: Concentration of authentication failures.
  3. `unique_ips`: Distributed vs Centralized source analysis.
  4. `avg_request_interval_ms`: Tempo analysis for bot detection.
  5. `error_rate`: Operational health impact.
- **Logic**: 
  - On every event ingestion, the backend computes these 5 features.
  - The ML service (Isolation Forest model) returns an `is_anomalous` flag, `anomaly_score`, and `reason`.
  - Anomaly triggers automatic Alert Escalation.

---

## 🚨 4. Intelligent Alerting & Response (Phase 2)
### A. Alerting
- New alerts are persisted in Supabase with normalized ML data.
- Explanations from the ML model are shown directly in the UI for transparency.

### B. Automated Response
Users can execute defensive actions directly from the **Alert Details** page:
- **BLOCK_IP**: Immediately adds the offending IP to a Redis blacklist.
- **DISABLE_USER**: Deactivates the compromised account in the database.
- **NOTIFY_ADMIN**: Triggers a high-priority email via Brevo REST API.

---

## 🚀 5. Demo Simulation (Phase 3)
The project includes automated attack scripts in `/scripts` to guarantee demo success:
1. `healthcare_attack.js`: Credential stuffing (30 failed logins).
2. `agriculture_attack.js`: Sensor tampering (high-frequency OOB data).
3. `urban_attack.js`: Unauthorized admin override attempts.
The system acts as a "Guardian" through a background service:
1. **Detection**: Scans the `events` table for high-frequency or high-severity triggers.
2. **Persistence**: New alerts are written to the `alerts` table.
3. **Notification**: Immediately calls the `mailer.js` utility to notify the relevant Sector Owner via Brevo.
4. **Auto-Response**: Linked to `response.service.js` which can trigger simulated firewall blocks or system shutdowns.

---

## 📈 5. Live Infrastructure Monitoring
The "System Metrics" page provides internal health status:
- **CPU**: Calculated using `os.loadavg()` vs CPU core count.
- **Memory**: Calculated using `os.totalmem()` minus `os.freemem()`.
- **Request Volume**: Redis tracks every hit to the `/api` route to show live traffic speed.

---

## 🎨 6. Frontend Interaction
- **Dynamic Dashboard**: Hooks into `/api/alerts` to calculate:
  - **System Health**: Drops to "CRITICAL" if >5 high-severity alerts exist.
  - **Risk Distribution**: Real-time Pie chart using `recharts`.
- **Protected Routes**: A higher-order component checks the AuthContext state to prevent unauthorized access.
- **Design System**: Built on a custom Tailwind layer using HSL color variables for a consistent "Cyberpunk" dark mode.

---

## 🗃️ 7. Database Schema
Defined in `my.sql`:
- **Users**: RBAC roles (ADMIN, ANALYST, SECTOR_OWNER).
- **Events**: The raw log stream.
- **Alerts**: Aggregated threats requiring action.
- **OTP**: Ephemeral security codes.

---
*Created for the Cyber-Resilient Infrastructure Platform Documentation.*
