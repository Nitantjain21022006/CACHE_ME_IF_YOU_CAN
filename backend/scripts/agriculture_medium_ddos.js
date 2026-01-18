import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'agriculture';
const NUM_EVENTS = 14; // Target 14 events to stay under 15 threshold for MEDIUM (not HIGH)

async function runAttack() {
    console.log(`🚀 Starting DDOS Simulation on ${SECTOR} (Target: MEDIUM Severity)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = `10.0.0.78`;
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'CODE_INJECTION_ATTEMPT',
                metadata: {
                    injection_type: i % 2 === 0 ? 'SQL' : 'Command',
                    target_sensor: `SENSOR_AGR_${i % 5}`,
                    malicious_payload: `'; DROP TABLE sensors; --`,
                    ip: ip,
                    device_id: 3001 + (i % 4), // Vary device for injection pattern
                    location_id: 202,
                    protocol: 'TCP',
                    packet_size: 950,      // Just under 1000 threshold (to avoid escalation)
                    latency_ms: 350,        // Just under 400 threshold (to avoid escalation)
                    cpu_usage_percent: 65,
                    memory_usage_percent: 68,
                    battery_level: 55,
                    temperature_c: 32,
                    connection_status: 'Connected',
                    operation_type: 'Write',
                    data_value_integrity: 1 // Keep integrity to avoid HIGH
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent ddos event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 500ms between events - spread over ~7s, event rate will be ~14 per 60s (MEDIUM)
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('✅ Simulation completed. Check Dashboard for MEDIUM severity alert.');
}

runAttack();
