import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'urban';
const NUM_EVENTS = 40; // High volume (Rapid)
const IPS = ['172.16.0.1', '172.16.0.2', '172.16.0.3', '172.16.0.4', '172.16.0.5'];

async function runAttack() {
    console.log(`🚀 Starting RAPID Multi-IP Override Simulation on ${SECTOR} (Target: HIGH Severity)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = IPS[i % IPS.length];
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'UNAUTHORIZED_OVERRIDE_ATTEMPT',
                metadata: {
                    system_target: 'TRAFFIC_CONTROL_UNIT_7',
                    attempt_type: 'FIRMWARE_PATCH',
                    priority: 'CRITICAL',
                    ip: ip
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent rapid event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 100ms between events (Rapid fire)
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Simulation completed. Check Dashboard for HIGH severity alert.');
}

runAttack();
