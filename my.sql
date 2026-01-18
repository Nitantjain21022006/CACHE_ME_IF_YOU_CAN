
-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'ANALYST', 'SECTOR_OWNER')),
    sector TEXT CHECK (sector IN ('HEALTHCARE', 'AGRICULTURE', 'URBAN')), -- Required for SECTOR_OWNER
    name TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. OTP Verifications Table
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    purpose TEXT NOT NULL, -- 'REGISTER', 'FORGOT_PASSWORD'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector TEXT NOT NULL CHECK (sector IN ('HEALTHCARE', 'AGRICULTURE', 'URBAN')),
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Alerts Table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector TEXT NOT NULL,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    score FLOAT NOT NULL,
    explanation TEXT,
    metadata JSONB,
    status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'RESOLVED'
    resolution_notes TEXT,
    resolution_type TEXT, -- 'AUTOMATED', 'MANUAL', NULL
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Governance: Settings Security
CREATE TABLE settings_security (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    low_threshold FLOAT DEFAULT 0.3,
    medium_threshold FLOAT DEFAULT 0.6,
    high_threshold FLOAT DEFAULT 0.8,
    auto_response BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Governance: Settings Notifications
CREATE TABLE settings_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_enabled BOOLEAN DEFAULT TRUE,
    admin_email TEXT DEFAULT 'admin@cyber.res',
    slack_webhook TEXT DEFAULT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Governance: API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_value TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Governance: Sectors
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- 'HEALTHCARE', 'AGRICULTURE', 'URBAN'
    is_enabled BOOLEAN DEFAULT TRUE,
    owner_id UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Data
INSERT INTO settings_security (low_threshold, medium_threshold, high_threshold, auto_response) VALUES (0.3, 0.6, 0.8, FALSE);
INSERT INTO settings_notifications (email_enabled, admin_email) VALUES (TRUE, 'admin@cyber.res');
INSERT INTO sectors (name) VALUES ('HEALTHCARE'), ('AGRICULTURE'), ('URBAN');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Users: Allow anyone to insert (register)
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
-- Users: Allow public select (for login check)
CREATE POLICY "Allow public select" ON users FOR SELECT USING (true);
-- Users: Allow public update (for verification)
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);

-- OTP: Allow all operations (Insert, Select, Delete) for the auth flow
CREATE POLICY "Allow public OTP" ON otp_verifications FOR ALL USING (true) WITH CHECK (true);

-- Events & Alerts: Allow public operations for sensors and dashboard
CREATE POLICY "Allow public events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public alerts" ON alerts FOR ALL USING (true) WITH CHECK (true);


