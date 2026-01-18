import supabase from '../utils/supabaseClient.js';
import { sendAlertEmail } from '../utils/mailer.js';

// Auto-resolve function that can be called after a delay
const autoResolveAlert = async (alertId, severity) => {
    try {
        const { data, error } = await supabase
            .from('alerts')
            .update({
                status: 'RESOLVED',
                resolution_type: 'AUTOMATED',
                resolved_at: new Date().toISOString(),
                resolution_notes: `Auto-resolved by system: ${severity} severity alerts are automatically mitigated after a short delay.`
            })
            .eq('id', alertId)
            .eq('status', 'ACTIVE') // Only resolve if still ACTIVE (not manually resolved)
            .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
            console.log(`[Alert Service] Auto-resolved ${severity} severity alert: ${alertId} after delay`);
        }
    } catch (error) {
        console.error(`[Alert Service] Auto-resolve failed for alert ${alertId}:`, error.message);
    }
};

export const createAlert = async (alertData) => {
    const { sector, type, severity, score, explanation, metadata } = alertData;
    // If severity is null (Normal attack type), keep it as null; otherwise normalize
    const normalizedSeverity = severity === null ? null : (severity?.toUpperCase() || 'LOW');

    try {
        // All alerts start as ACTIVE (LIVE_THREAT) so they appear in dashboard
        const insertData = {
            sector,
            type,
            severity: normalizedSeverity, // Can be NULL for Normal attack type
            score,
            explanation,
            metadata,
            status: 'ACTIVE', // Always start as ACTIVE to show in dashboard
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('alerts')
            .insert([insertData])
            .select();

        if (error) {
            console.error('[Alert Service] Supabase Insert Error:', error);
            throw error;
        }

        const alert = data?.[0] || alertData;

        // Schedule auto-resolution for LOW and MEDIUM alerts (skip if severity is NULL)
        const shouldAutoResolve = normalizedSeverity && (normalizedSeverity === 'LOW' || normalizedSeverity === 'MEDIUM');
        if (shouldAutoResolve) {
            // LOW: 5 seconds, MEDIUM: 10 seconds
            const delayMs = normalizedSeverity === 'LOW' ? 5000 : 10000;
            
            setTimeout(() => {
                autoResolveAlert(alert.id, normalizedSeverity);
            }, delayMs);

            console.log(`[Alert Service] Scheduled auto-resolve for ${normalizedSeverity} severity alert: ${alert.id} in ${delayMs/1000}s`);
        }

        // If HIGH severity, send email notification
        if (normalizedSeverity === 'HIGH') {
            try {
                await sendAlertEmail(process.env.BREVO_USER || 'admin@cyber.res', alert);
            } catch (emailError) {
                console.error('Non-critical: Alert email failed:', emailError.message);
            }
        }

        return { success: true, alert };
    } catch (error) {
        console.error('Error creating alert:', error);
        // Ensure error is a string for the JSON response
        const errorMessage = typeof error === 'object' ? JSON.stringify(error) : error.toString();
        return { success: false, error: errorMessage };
    }
};

export const resolveAlert = async (alertId, resolutionData) => {
    try {
        const updateData = {
            status: 'RESOLVED',
            resolution_notes: resolutionData.notes,
            resolved_at: new Date().toISOString(),
            resolved_by: resolutionData.userId,
            resolution_type: 'MANUAL' // Manual resolution for HIGH severity alerts
        };

        // Only set resolution_type if not already set (preserve AUTOMATED if it exists)
        const { data: existingAlert } = await supabase
            .from('alerts')
            .select('resolution_type')
            .eq('id', alertId)
            .single();

        // If resolution_type is already set to AUTOMATED, don't override it
        if (existingAlert?.resolution_type === 'AUTOMATED') {
            delete updateData.resolution_type;
        }

        const { data, error } = await supabase
            .from('alerts')
            .update(updateData)
            .eq('id', alertId)
            .select();

        if (error) throw error;
        return { success: true, alert: data[0] };
    } catch (error) {
        console.error('Error resolving alert:', error);
        return { success: false, error: error.message };
    }
};
