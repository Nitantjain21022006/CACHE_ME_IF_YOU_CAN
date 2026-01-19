# 🛠️ Platform Governance: Settings Module Use Case

This document details the current implementation of the Settings module, which serves as the central command center for platform administrators.

---

## 🔐 1. Access Control (RBAC)
- **Visibility**: The Settings tab is visible **ONLY to users with the `ADMIN` role**.
- **Enforcement**:
  - **Frontend**: The `Navbar.jsx` conditionally renders the navigation item based on `user.role`.
  - **Backend**: The `isAdmin` middleware in `auth.middleware.js` protects all `/api/settings/*` routes, returning a `403 Forbidden` for other roles.

---

## 🛡️ 2. Security Thresholds Module
**Objective**: Dynamically adjust the sensitivity of the AI Anomaly Detection engine.

- **Thresholds**:
  - `LOW`: Minimum anomaly score to trigger a Low alert (Default: `0.3`).
  - `MEDIUM`: Minimum anomaly score for Medium escalation (Default: `0.6`).
  - `HIGH`: Minimum anomaly score for High escalation + Email (Default: `0.8`).
- **Auto-Response**: A global toggle to enable/disable automated actions (IP Blocking, User Lock) triggered by the AI.
- **Persistence**: Data is saved to the `settings_security` table in Supabase.

---

## 📢 3. Notification Hub
**Objective**: Manage communication channels for critical incidents.

- **Current Channel**: 
  - **Email**: Sends high-priority alerts to the configured Admin email address using the **Brevo API**.
- **Placeholders**: Slack and SMS channels are visually identified as "Tier 2" features for future roadmap integration.
- **Persistence**: Configured in the `settings_notifications` table.

---

## 🔑 4. API Key Governance
**Objective**: Manage secure ingestion from external sensor networks and third-party systems.

- **Display**: Shows the current active ingestion key (`cyber_...`).
- **Rotation**: Clicking "Rotate Key" generates a new unique 32-character token and invalidates the previous one (marking it inactive in the DB).
- **Persistence**: Managed in the `api_keys` table.

---

## 🌐 5. Sector Management
**Objective**: Oversee the administrative hierarchy across infrastructure domains.

- **Domain Oversight**:
  - **Healthcare**: Active/Inactive toggle.
  - **Agriculture**: Active/Inactive toggle.
  - **Urban Systems**: Active/Inactive toggle.
- **Ownership**: Displays the name and email of the `SECTOR_OWNER` assigned to each domain.
- **Persistence**: Managed in the `sectors` table with foreign keys to the `users` table.

---

## 🔄 6. Technical Flow (Live Interaction)
1. **Admin Action**: Modifies a threshold in the UI and clicks "Save Policy".
2. **API Call**: Frontend sends `POST /api/settings/security` to the backend.
3. **Database Update**: Backend inserts a new configuration row (versioning) or updates the singleton.
4. **Real-time Impact**: Next time `eventProcessor.service.js` runs, it fetches the *latest* thresholds from Redis/DB to categorize the anomaly score returned by the AI.

---

