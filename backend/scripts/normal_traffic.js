import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'healthcare'; // Can be healthcare, agriculture, or urban
const NUM_EVENTS = 5; // Low volume normal traffic

async function runNormalTraffic() {
    console.log(`🚀 Starting NORMAL Traffic Simulation on ${SECTOR} (Target: Normal Attack Type)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = `192.168.1.50`; // Single IP, normal traffic
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'NORMAL_OPERATION',
                metadata: {
                    operation: 'Routine data sync',
                    description: 'Normal operational traffic',
                    ip: ip,
                    device_id: 1001,
                    location_id: 101,
                    protocol: 'TCP',
                    packet_size: Math.floor(Math.random() * 200) + 400, // Normal packet size (400-600)
                    latency_ms: Math.floor(Math.random() * 30) + 25,    // Normal latency (25-55)
                    cpu_usage_percent: 35,
                    memory_usage_percent: 40,
                    battery_level: 95,
                    temperature_c: 24,
                    connection_status: 'Connected',
                    operation_type: 'Read', // Normal read operations
                    data_value_integrity: 1 // Perfect integrity - normal traffic
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent normal traffic event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 15 seconds between events - slow normal traffic
        await new Promise(resolve => setTimeout(resolve, 15000));
    }

    console.log('✅ Simulation completed. Check Dashboard for Normal attack type (not Unknown).');
}

runNormalTraffic();
