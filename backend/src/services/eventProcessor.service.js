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

        // 3. Aggregate Metrics for the last 60 seconds
        console.log(`[Processor] Step 3: Aggregating 60s metrics...`);
        const oneMinuteAgo = timestamp - 60 * 1000;
        const recentEventsRaw = await redisClient.zRange(windowKey, oneMinuteAgo, timestamp, { BY: 'SCORE' });
        const recentEvents = recentEventsRaw.map(e => {
            try {
                return JSON.parse(e);
            } catch (err) {
                console.warn('[Processor] Skipping malformed Redis event:', e);
                return null;
            }
        }).filter(Boolean);

        const event_rate = recentEvents.length;
        const failed_logins = recentEvents.filter(e => e.type === 'LOGIN_FAILED').length;
        const unique_ips = new Set(recentEvents.map(e => e.ip)).size;

        let avg_request_interval_ms = 1000;
        if (recentEvents.length > 1) {
            const intervals = [];
            for (let i = 1; i < recentEvents.length; i++) {
                intervals.push(recentEvents[i].timestamp - recentEvents[i - 1].timestamp);
            }
            avg_request_interval_ms = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        }

        const error_count = recentEvents.filter(e =>
            e.severity === 'HIGH' ||
            e.type.includes('ERROR') ||
            e.type.includes('FAILED')
        ).length;
        const error_rate = event_rate > 0 ? error_count / event_rate : 0;

        const aggregatedMetrics = {
            event_rate,
            failed_logins,
            unique_ips,
            avg_request_interval_ms,
            error_rate
        };

        console.log(`[Processor] Step 4: Calling ML Service with:`, aggregatedMetrics);
        const analysis = await analyzeMetrics(sector, aggregatedMetrics);
        console.log(`[Processor] ML Result: is_anomaly=${analysis.is_anomaly}, severity=${analysis.severity}`);

        // 5. If Anomaly, create an alert
        if (analysis.is_anomaly) {
            console.log(`[Processor] Step 5: Creating alert in Supabase...`);
            try {
                const alertResult = await createAlert({
                    sector,
                    type: `ML_ANOMALY_${type}`,
                    severity: (analysis.severity || 'HIGH').toUpperCase(),
                    score: parseFloat(analysis.score || 0),
                    confidence: parseFloat(analysis.confidence || 0),
                    explanation: analysis.explanation,
                    metadata: {
                        ...metadata,
                        metrics: aggregatedMetrics,
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
            metrics: aggregatedMetrics || null
        };
    } catch (error) {
        console.error('CRITICAL: Event Processing System Error:', error);
        const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
        return { success: false, error: errorMessage };
    }
};
