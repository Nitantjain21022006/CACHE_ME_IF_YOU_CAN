import axios from 'axios';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000/api/ml/analyze';

export const analyzeMetrics = async (sector, metrics) => {
    try {
        const payload = {
            sector: sector.toLowerCase(),
            window_seconds: 60,
            metrics: {
                event_rate: metrics.event_rate || 0,
                failed_logins: metrics.failed_logins || 0,
                unique_ips: metrics.unique_ips || 0,
                avg_request_interval_ms: Math.round(metrics.avg_request_interval_ms || 0),
                error_rate: parseFloat((metrics.error_rate || 0).toFixed(4))
            }
        };

        const response = await axios.post(ML_API_URL, payload, { timeout: 5000 });

        // Normalize response to ensure compatibility with our alert system
        const data = response.data;
        return {
            is_anomaly: data.is_anomalous || false,
            score: data.anomaly_score || 0,
            confidence: data.confidence || 0,
            severity: data.recommended_severity || 'LOW',
            explanation: data.reason || 'Normal traffic patterns.'
        };
    } catch (error) {
        console.error('ML Analysis Error:', error.response?.data || error.message);
        // Deterministic fallback
        return {
            is_anomaly: false,
            score: 0,
            confidence: 1.0,
            severity: 'LOW',
            explanation: 'ML Analysis unavailable. System operating in safe-mode.'
        };
    }
};
