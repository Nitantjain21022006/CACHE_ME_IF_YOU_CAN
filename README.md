# Cyber-Resilient Infrastructure Platform 

A production-inspired security monitoring and resilience platform designed for critical sectors: **Healthcare**, **Agriculture**, and **Urban Systems**.

## 🚀 Key Features
- **Real-time Event Ingestion**: High-throughput ingestion layer using Redis buffering and Supabase persistence.
- **ML-Powered Detection**: Integration with external ML APIs to identify anomalies and score threats.
- **Automated Response**: Rapid mitigation workflows (e.g., BLOCK_IP, DISABLE_USER).
- **Executive Dashboard**: Premium dark-mode UI with real-time metrics and sector-wise risk distribution.
- **Role-Based Access**: Specialized views for ADMIN, ANALYST, and SECTOR_OWNER.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, Redis, Supabase (PostgreSQL), JWT (HTTP-only Cookies).
- **Frontend**: React, Tailwind CSS v3.4, Recharts, Lucide Icons.
- **Alerting**: Brevo (SMTP Relay) for high-severity notifications.

## 🏗️ Architecture
1. **Frontend** (React) communicates with **Backend** (Node.js) via Axios.
2. **Backend** buffers event metrics in **Redis** for sub-millisecond analysis.
3. **Permanent storage** is handled by **Supabase**.
4. **Anomalies** are detected by a simulated ML proxy.
5. **Mitigation** actions are logged and executed through the Response Service.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Redis Server (Running on localhost:6379)
- Supabase Account

### Installation
1. Clone the repository.
2. **Backend**:
   ```bash
   cd backend
   npm install
   # Create .env based on the template provided
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   # Create .env based on the template provided
   npm run dev
   ```

### Live Ingestion
The platform expects a real stream of events to the `/api/events/ingest` endpoint. Ensure your sensors or simulated sources are configured with the correct API URL.

## 🔒 Security Posture
- Email OTP verification required for all new accounts.

##Build by Team **CACHE ME IF YOU CAN**
- Password recovery via secure time-limited tokens.
- No localStorage used; JWT handled via HTTP-only Cookies.

---
*Built for PS-4 Hackathon Challenge.*
