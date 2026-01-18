import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'healthcare';
const NUM_EVENTS = 25; // Low volume

async function runAttack() {
    console.log(`🚀 Starting SLOW Credential Stuffing Simulation on ${SECTOR} (Target: LOW Severity)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = `192.168.1.10`; // Single IP
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'LOGIN_FAILED',
                metadata: {
                    user_attempted: `nurse_admin@cityhospital.org`,
                    ip: ip,
                    reason: 'Invalid password',
                    location_id: 101,
                    protocol: 'TCP',
                    packet_size: Math.floor(Math.random() * 200) + 100, // Normal range
                    latency_ms: Math.floor(Math.random() * 50) + 20,    // Normal range
                    cpu_usage_percent: 35,
                    memory_usage_percent: 45,
                    battery_level: 95,
                    temperature_c: 24,
                    connection_status: 'Connected',
                    operation_type: 'Read',
                    data_value_integrity: 1
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent slow event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 3 seconds between events (Very slow)
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('✅ Simulation completed. Check Dashboard for LOW severity alert.');
}

runAttack();
