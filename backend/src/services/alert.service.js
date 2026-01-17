import supabase from '../utils/supabaseClient.js';
import { sendAlertEmail } from '../utils/mailer.js';

export const createAlert = async (alertData) => {
    const { sector, type, severity, score, explanation, metadata } = alertData;

    try {
        const { data, error } = await supabase
            .from('alerts')
            .insert([{
                sector,
                type,
                severity,
                score,
                explanation,
                metadata,
                status: 'ACTIVE',
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('[Alert Service] Supabase Insert Error:', error);
            throw error;
        }

        const alert = data?.[0] || alertData;

        // If HIGH severity, send email notification
        if (severity === 'HIGH') {
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
        const { data, error } = await supabase
            .from('alerts')
            .update({
                status: 'RESOLVED',
                resolution_notes: resolutionData.notes,
                resolved_at: new Date().toISOString(),
                resolved_by: resolutionData.userId
            })
            .eq('id', alertId)
            .select();

        if (error) throw error;
        return { success: true, alert: data[0] };
    } catch (error) {
        console.error('Error resolving alert:', error);
        return { success: false, error: error.message };
    }
};
