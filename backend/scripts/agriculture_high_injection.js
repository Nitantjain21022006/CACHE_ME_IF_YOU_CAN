import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events/ingest';
const SECTOR = 'agriculture';
const NUM_EVENTS = 30; // High volume - exactly at threshold to trigger HIGH

async function runAttack() {
    console.log(`🚀 Starting Injection Simulation on ${SECTOR} (Target: HIGH Severity)...`);

    for (let i = 0; i < NUM_EVENTS; i++) {
        const ip = `10.0.0.99`;
        try {
            await axios.post(API_URL, {
                sector: SECTOR,
                type: 'RANSOMWARE_ENCRYPTION_DETECTED',
                metadata: {
                    encrypted_files: `file_${i}_encrypted.locked`,
                    ransom_note: 'Your files have been encrypted. Pay 5 BTC.',
                    encryption_key: `ransom_key_${i}`,
                    ip: ip,
                    device_id: 4001, // Single device being attacked (ransomware pattern)
                    location_id: 202,
                    protocol: 'TCP',
                    packet_size: 2000,      // Very high packet size (Anomalous)
                    latency_ms: Math.floor(Math.random() * 50) + 150,
                    cpu_usage_percent: 85,  // Very high CPU (Anomalous)
                    memory_usage_percent: 88, // Very high memory (Anomalous)
                    battery_level: 40,
                    temperature_c: 45,      // Elevated temperature
                    connection_status: 'Disconnected', // System compromised
                    operation_type: 'Write',
                    data_value_integrity: 0 // Integrity violation (Critical) - triggers HIGH
                }
            });
            console.log(`[${i + 1}/${NUM_EVENTS}] Sent injection event from ${ip}`);
        } catch (error) {
            console.error(`[${i + 1}/${NUM_EVENTS}] Failed:`, error.message);
        }

        // Wait 300ms between events - rapid burst, event rate >= 30 triggers HIGH
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('✅ Simulation completed. Check Dashboard for HIGH severity alert.');
}

runAttack();
