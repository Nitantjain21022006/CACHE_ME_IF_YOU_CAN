import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'healthcare';
const NUM_EVENTS = 3; // Very low volume - target rate <= 3 per 60s for LOW severity
const IPS = ['192.168.1.210', '192.168.1.211']; // 2 IPs alternating (MITM)

async function runAttack() {
    console.log(`🚀 Starting MITM Simulation on ${SECTOR} (Target: LOW Severity, MITM Attack Type)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = IPS[i % IPS.length]; // Alternate between 2 IPs
        
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'MAN_IN_THE_MIDDLE_DETECTED',
                metadata: {
                    intercepted_session: `session_${i}`,
                    target_device: `medical_device_${i % 3}`,
                    ip: ip,
                    ip_src: `192.168.1.${100 + (i % 50)}`,
                    ip_dest: `192.168.1.${200 + (i % 50)}`,
                    device_id: 2001 + (i % 2), // MITM pattern: 2 devices
                    location_id: 101,
                    protocol: 'HTTPS', // HTTPS is typical for MITM
                    packet_size: Math.floor(Math.random() * 300) + 700, // Slightly elevated (700-1000) for MITM pattern
                    latency_ms: Math.floor(Math.random() * 80) + 150,   // Elevated latency (150-230) for MITM pattern
                    cpu_usage_percent: 45, // Lower CPU to keep severity LOW
                    memory_usage_percent: 50, // Lower memory to keep severity LOW
                    battery_level: 85,
                    temperature_c: 26,
                    connection_status: 'Connected',
                    operation_type: 'Write', // MITM typically involves writes
                    data_value_integrity: 1 // Keep integrity to avoid escalation
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent MITM event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 25 seconds between events to keep event rate <= 3 per 60s (LOW severity)
        await new Promise(resolve => setTimeout(resolve, 25000));
    }

    console.log('✅ Simulation completed. Check Dashboard for LOW severity, MITM attack type.');
}

runAttack();
