import axios from 'axios';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000/api/ml/analyze';

export const analyzeMetrics = async (sector, metrics) => {
    try {
        const capitalizedSector = sector.charAt(0).toUpperCase() + sector.slice(1).toLowerCase();
        const payload = {
            timestamp: new Date().toISOString(),
            sector: capitalizedSector,
            device_id: metrics.device_id || 0,
            location_id: metrics.location_id || 0,
            protocol: metrics.protocol || 'TCP',
            operation_type: metrics.operation_type || 'Read',
            packet_size: metrics.packet_size || 500,
            latency_ms: metrics.latency_ms || 50,
            cpu_usage_percent: metrics.cpu_usage_percent || 30,
            memory_usage_percent: metrics.memory_usage_percent || 40,
            battery_level: metrics.battery_level || 80,
            temperature_c: metrics.temperature_c || 25,
            connection_status: metrics.connection_status || 'Connected',
            data_value_integrity: metrics.data_value_integrity ?? 1,
            // Pass-through context (app.py drops these)
            ip_src: metrics.ip_src || '0.0.0.0',
            ip_dest: metrics.ip_dest || '0.0.0.0'
        };

        const response = await axios.post(ML_API_URL, payload, { timeout: 5000 });

        const data = response.data;
        let severity = (data.severity || 'LOW').toUpperCase();
        if (severity === 'CRITICAL') severity = 'HIGH';

        // Ensure attack_type is one of the valid values: Normal, DDoS, Ransomware, MITM, Injection, Spoofing
        const validAttackTypes = ['Normal', 'DDoS', 'Ransomware', 'MITM', 'Injection', 'Spoofing'];
        const attackType = data.attack_type || 'Normal';
        const finalAttackType = validAttackTypes.includes(attackType) ? attackType : 'Normal';

        return {
            is_anomaly: data.is_anomalous || false,
            score: data.confidence || 0,
            confidence: data.confidence || 0,
            severity: severity,
            attack_type: finalAttackType,
            explanation: Array.isArray(data.reason) ? data.reason.join(', ') : (data.reason || 'Normal traffic patterns.')
        };
    } catch (error) {
        const errorDetail = error.response?.data?.error || error.message;
        console.error(`[ML Client] Analysis Error: ${errorDetail}`);
        return {
            is_anomaly: false,
            score: 0,
            confidence: 1.0,
            severity: 'LOW',
            attack_type: 'Normal', // Default to Normal instead of Unknown on error
            explanation: `ML Analysis failed: ${errorDetail}`
        };
    }
};
