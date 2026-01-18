import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'urban';
const NUM_EVENTS = 50; // High volume to trigger HIGH severity
const IPS = ['172.16.0.100', '172.16.0.101', '172.16.0.102', '172.16.0.103', '172.16.0.104', '172.16.0.105']; // 6 IPs

async function runAttack() {
    console.log(`🚀 Starting Urban Simulation on ${SECTOR} (Target: HIGH Severity)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = IPS[i % IPS.length]; // Rotate through 6 IPs (meets uniqueIps >= 5 requirement)
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'RAPID_DDoS_ATTACK',
                metadata: {
                    attack_type: 'Flood Attack',
                    target_endpoint: `/api/urban/critical/${i % 10}`,
                    request_rate: '1000 req/s',
                    ip: ip,
                    device_id: 6001 + (i % 6), // DDoS from 6 different devices
                    location_id: 303,
                    protocol: 'HTTP',
                    packet_size: 2500,      // Very high packet size (Anomalous)
                    latency_ms: Math.floor(Math.random() * 30) + 10,
                    cpu_usage_percent: 88,  // Very high CPU (Anomalous)
                    memory_usage_percent: 92, // Very high memory (Anomalous)
                    battery_level: 50,
                    temperature_c: 50,      // High temperature from load
                    connection_status: 'Connected',
                    operation_type: 'Write', // Write operations with high rate and 6 IPs triggers HIGH
                    data_value_integrity: 0 // Integrity violation helps ensure HIGH severity
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent mitm event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 100ms between events - rapid rate, eventRate >= 40 with 6 IPs and integrity=0 triggers HIGH
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Simulation completed. Check Dashboard for HIGH severity alert.');
}

runAttack();
