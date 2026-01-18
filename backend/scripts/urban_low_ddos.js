import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'urban';
const NUM_EVENTS = 3; // Very low volume to keep event rate <= 3 (LOW severity)
const IPS = ['172.16.0.10', '172.16.0.11', '172.16.0.12']; // 3 IPs for DDoS pattern

async function runAttack() {
    console.log(`🚀 Starting SLOW DDoS Simulation on ${SECTOR} (Target: LOW Severity, DDoS Attack Type)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = IPS[i % IPS.length]; // Rotate through 3 IPs (DDoS pattern: multiple IPs)
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'SLOW_DDoS_ATTEMPT',
                metadata: {
                    attack_type: 'Slow HTTP Request',
                    target_endpoint: `/api/urban/control/${i % 5}`,
                    ip: ip,
                    device_id: 5001 + (i % 3), // DDoS from multiple devices (pattern for DDoS)
                    location_id: 303,
                    protocol: 'HTTP', // HTTP protocol typical for DDoS
                    packet_size: Math.floor(Math.random() * 300) + 600, // Slightly elevated for DDoS pattern (600-900)
                    latency_ms: Math.floor(Math.random() * 50) + 40,    // Normal latency (40-90) but multiple IPs indicate DDoS
                    cpu_usage_percent: 45, // Low CPU to keep severity LOW
                    memory_usage_percent: 50, // Low memory to keep severity LOW
                    battery_level: 90,
                    temperature_c: 26,
                    connection_status: 'Connected',
                    operation_type: 'Read', // Read operations to avoid escalation
                    data_value_integrity: 1
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent slow DDoS event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 25 seconds between events to keep event rate very low (<= 3 per 60s window)
        await new Promise(resolve => setTimeout(resolve, 25000));
    }

    console.log('✅ Simulation completed. Check Dashboard for LOW severity, DDoS attack type.');
}

runAttack();
