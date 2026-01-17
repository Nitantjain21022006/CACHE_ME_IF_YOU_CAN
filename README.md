# Cyber-Resilient Infrastructure Platform (CRIP)

A high-fidelity security monitoring and resilience platform designed for critical infrastructure: **Healthcare**, **Agriculture**, and **Urban Systems**. The platform leverages real-time telemetry, 15-feature Machine Learning anomaly detection, and automated response protocols to maintain operational integrity against cyber threats.

## 🚀 Key Features

- **15-Feature ML Integration**: Advanced anomaly detection and attack classification (DDoS, MITM, Injection, etc.) using high-fidelity IoT telemetry.
- **Anomaly Stream**: A real-time, paginated monitor feed for intercepting and analyzing infrastructure events.
- **Telemetry Lab**: Deep-dive hardware utilization analytics (CPU, Memory, Network) with interactive "Instrument Gauge" visualizations.
- **Admin Command Center**: Centralized governance hub for managing security thresholds, rotating API keys, and sector oversight.
- **Sector Dossiers**: Instant generation of professional, high-fidelity PDF reports for executive auditing.
- **Automated Mitigation**: Trigger-based responses including IP blocking and user isolation.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Buffer Layer**: [Redis](https://redis.io/)
- **Email**: [Brevo](https://www.brevo.com/) (SMTP Relay)

### ML Service
- **Engine**: [Python](https://www.python.org/) + [Flask](https://flask.palletsprojects.com/)
- **Model**: XGBoost Classification (15 FEATURES)

## ⚙️ Setup & Local Development

To run the full platform locally, you will need three terminal instances.

### 1. ML Service (Inference Engine)
```bash
cd ml_service
pip install -r requirements.txt
python app.py
```

### 2. Backend (Logic & Persistence)
```bash
cd backend
npm install
# Create .env based on the "Environment Variables" section below
npm run dev
```

### 3. Frontend (Operator Dashboard)
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5001
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
REDIS_URL=redis://localhost:6379
BREVO_API_KEY=your_brevo_key
BREVO_USER=your_email@domain.com
ML_API_URL=http://localhost:5000/api/ml/analyze
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

## 🛡️ Authentication & Access

- **Test Accounts**: Please use the **Register** flow to create your first `ADMIN` account.
- **Verification**: Email OTPs are dispatched via Brevo for registration and password resets.
- **Security**: No sensitive data is stored in `localStorage`; all sessions are handled via **HTTP-only Cookies**.

## ⚠️ Error Handling & Resilience

- **ML Safe-Mode**: The backend automatically falls back to a deterministic "Safe-Mode" if the ML service is unreachable.
- **Robust Parsing**: Every ingestion cycle features robust error handling to prevent data corruption during stream analysis.
- **Database RLS**: All Supabase tables are protected by Row-Level Security policies.

## 🔒 Confidentiality Notice
**NO SECRETS** (API keys, Supabase credentials, etc.) are committed to this repository. All sensitive configurations are managed via environment variables and are excluded via `.gitignore`.

---
*Developed for Advanced Agentic Coding Challenge.*
