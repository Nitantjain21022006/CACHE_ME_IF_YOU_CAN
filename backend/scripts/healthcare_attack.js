import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'healthcare';
const NUM_EVENTS = 5; // Low volume

async function runAttack() {
    console.log(`🚀 Starting SLOW Credential Stuffing Simulation on ${SECTOR} (Target: LOW Severity)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = `192.168.1.10`; // Single IP
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'LOGIN_FAILED',
                // No severity sent - let ML decide
                metadata: {
                    user_attempted: `nurse_admin@cityhospital.org`,
                    ip: ip,
                    reason: 'Invalid password'
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
