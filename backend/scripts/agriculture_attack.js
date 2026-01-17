import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'agriculture';
const NUM_EVENTS = 15; // Medium volume (Burst)

async function runAttack() {
    console.log(`🚀 Starting BURST Sensor Spike Simulation on ${SECTOR} (Target: MEDIUM Severity)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = `10.0.0.45`;
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'SENSOR_ANOMALY',
                metadata: {
                    sensor_id: `IRRIG_SYS_0${i % 3}`,
                    value: 85 + Math.random() * 20,
                    unit: 'PSI',
                    ip: ip
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent burst event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 300ms between events (Burst speed)
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('✅ Simulation completed. Check Dashboard for MEDIUM severity alert.');
}

runAttack();
