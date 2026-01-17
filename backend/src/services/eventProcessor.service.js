import redisClient from '../utils/redisClient.js';
import supabase from '../utils/supabaseClient.js';
import { analyzeMetrics } from '../utils/mlClient.js';
import { createAlert } from './alert.service.js';

export const processEvent = async (event) => {
    const { sector: rawSector, type, severity: eventSeverity = 'LOW', metadata } = event;
    const sector = rawSector.toUpperCase(); // Ensure sector is uppercase for consistency
    const timestamp = Date.now();
    const isoTimestamp = new Date(timestamp).toISOString();
    const ip = metadata?.ip || '127.0.0.1';

    try {
        console.log(`[Processor] Step 1: Storing event in Supabase...`);
        const { data, error } = await supabase
            .from('events')
            .insert([
                {
                    sector,
                    type,
                    severity: eventSeverity.toUpperCase(),
                    metadata,
                    created_at: isoTimestamp
                }
            ])
            .select();

        if (error) {
            console.error('[Processor] Supabase Event Insert Error:', error);
            throw error;
        }
        console.log(`[Processor] Event stored successfully with ID: ${data?.[0]?.id}`);

        // 2. Update Redis Tracking
        const windowKey = `window:events:${sector}`;
        console.log(`[Processor] Step 2: Adding to Redis window: ${windowKey}`);

        const eventData = {
            type,
            severity: eventSeverity,
            ip,
            timestamp,
            eventId: data?.[0]?.id
        };

        try {
            await redisClient.zAdd(windowKey, { score: timestamp, value: JSON.stringify(eventData) });
            await redisClient.zRemRangeByScore(windowKey, 0, timestamp - 2 * 60 * 1000);
        } catch (redisErr) {
            console.error('[Processor] Redis Error (Non-blocking):', redisErr);
        }

        // 3. Extract High-Fidelity Metrics from Metadata (Prioritize individual event features)
        console.log(`[Processor] Step 3: Extracting high-fidelity metrics...`);
        const highFidelityMetrics = {
            device_id: metadata?.device_id || 0,
            location_id: metadata?.location_id || 0,
            ip_src: metadata?.ip_src || 0,
            ip_dest: metadata?.ip_dest || 0,
            protocol: metadata?.protocol || 'TCP',
            packet_size: metadata?.packet_size || 500,
            latency_ms: metadata?.latency_ms || 50,
            cpu_usage_percent: metadata?.cpu_usage_percent || 30,
            memory_usage_percent: metadata?.memory_usage_percent || 40,
            battery_level: metadata?.battery_level || 80,
            temperature_c: metadata?.temperature_c || 25,
            connection_status: metadata?.connection_status || 'Connected',
            operation_type: metadata?.operation_type || 'Read',
            data_value_integrity: metadata?.data_value_integrity ?? 1,
            is_anomaly: metadata?.is_anomaly || 0
        };

        // Also aggregate window metrics for additional context (optional, but good for logs)
        const oneMinuteAgo = timestamp - 60 * 1000;
        const recentEventsRaw = await redisClient.zRange(windowKey, oneMinuteAgo, timestamp, { BY: 'SCORE' });

        let uniqueIps = 0;
        try {
            uniqueIps = new Set(recentEventsRaw.map(e => {
                try { return JSON.parse(e).ip; } catch { return null; }
            }).filter(Boolean)).size;
        } catch (e) {
            console.warn('[Processor] Context aggregation failed:', e.message);
        }

        const contextMetrics = {
            event_rate_60s: recentEventsRaw.length,
            unique_ips_60s: uniqueIps
        };

        console.log(`[Processor] Step 4: Calling ML Service with high-fidelity data...`);
        const analysis = await analyzeMetrics(sector, highFidelityMetrics);
        console.log(`[Processor] ML Result: is_anomaly=${analysis.is_anomaly}, attack=${analysis.attack_type}, severity=${analysis.severity}`);

        // 5. If Anomaly or Attack Detected, create an alert
        if (analysis.is_anomaly || analysis.attack_type !== 'Normal') {
            console.log(`[Processor] Step 5: Creating high-fidelity alert...`);
            try {
                const alertResult = await createAlert({
                    sector,
                    type: analysis.attack_type !== 'Normal' ? `ML_${analysis.attack_type.toUpperCase()}` : `ML_ANOMALY_${type}`,
                    severity: (analysis.severity || 'HIGH').toUpperCase(),
                    score: parseFloat(analysis.confidence || 0),
                    confidence: parseFloat(analysis.confidence || 0),
                    explanation: analysis.explanation,
                    metadata: {
                        ...metadata,
                        metrics: highFidelityMetrics,
                        context: contextMetrics,
                        ml_response: analysis
                    }
                });
                console.log(`[Processor] Alert creation result:`, alertResult.success ? 'Success' : 'Failed');
            } catch (alertErr) {
                console.error('[Processor] Alert Escalation Failed (Non-blocking):', alertErr.message);
            }
        }

        console.log(`[Processor] SUCCESS: Pipeline complete for event ID: ${data?.[0]?.id || 'N/A'}`);
        return {
            success: true,
            eventId: data?.[0]?.id || null,
            analysis: analysis || null,
            metrics: highFidelityMetrics || null
        };
    } catch (error) {
        console.error('CRITICAL: Event Processing System Error:', error);
        const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
        return { success: false, error: errorMessage };
    }
};
