import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'healthcare';
const NUM_EVENTS = 5; // Very low volume to keep event rate <= 3 per 60s

async function runAttack() {
    console.log(`🚀 Starting MITM Simulation on ${SECTOR} (Target: High Severity)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = `192.168.1.105`; // Single IP (spoofing from one source)
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'IDENTITY_SPOOFING_ATTEMPT',
                metadata: {
                    spoofed_user: `doctor_${i % 5}@hospital.org`,
                    original_ip: `10.0.0.${100 + i}`,
                    ip: ip,
                    device_id: 1001 + (i % 3), // Vary device_id for spoofing pattern
                    location_id: 101,
                    protocol: 'TCP',
                    packet_size: Math.floor(Math.random() * 200) + 400, // Normal range (400-600)
                    latency_ms: Math.floor(Math.random() * 30) + 25,    // Normal range (25-55)
                    cpu_usage_percent: 35,
                    memory_usage_percent: 45,
                    battery_level: 95,
                    temperature_c: 24,
                    connection_status: 'Connected',
                    operation_type: 'Read',
                    data_value_integrity: 1 // No integrity violation
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent mitm event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 15 seconds between events to keep event rate very low (<= 3 per 60s window)
        await new Promise(resolve => setTimeout(resolve, 15000));
    }

    console.log('✅ Simulation completed. Check Dashboard for High severity alert.');
}

runAttack();
