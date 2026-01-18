import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'urban';
const NUM_EVENTS = 3; // Very low volume to keep event rate <= 3 (LOW severity)
const IPS = ['172.16.0.10', '172.16.0.11', '172.16.0.12']; // 3 IPs

async function runAttack() {
    console.log(`🚀 Starting SLOW RANSOMWARE Simulation on ${SECTOR} (Target: LOW Severity, Ransomware Attack Type)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = IPS[i % IPS.length]; // Rotate through 3 IPs
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'SLOW_RANSOMWARE_ENCRYPTION',
                metadata: {
                    encrypted_file: `file_${i}_encrypted.locked`,
                    ransom_note: 'Low-level encryption detected',
                    ip: ip,
                    device_id: 5001 + (i % 3), // Specific device pattern for hardcoded detection
                    location_id: 303,
                    protocol: 'TCP',
                    packet_size: Math.floor(Math.random() * 200) + 500, // Normal packet size (500-700) to keep LOW
                    latency_ms: Math.floor(Math.random() * 40) + 30,    // Normal latency (30-70) to keep LOW
                    cpu_usage_percent: 45, // Low CPU to keep severity LOW
                    memory_usage_percent: 50, // Low memory to keep severity LOW
                    battery_level: 90,
                    temperature_c: 26,
                    connection_status: 'Connected',
                    operation_type: 'Read', // Read operations to avoid escalation
                    data_value_integrity: 1 // Keep integrity to avoid HIGH escalation
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent slow ransomware event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 25 seconds between events to keep event rate very low (<= 3 per 60s window)
        await new Promise(resolve => setTimeout(resolve, 25000));
    }

    console.log('✅ Simulation completed. Check Dashboard for LOW severity, Ransomware attack type.');
}

runAttack();
