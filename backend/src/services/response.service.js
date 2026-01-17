import redisClient from '../utils/redisClient.js';
import supabase from '../utils/supabaseClient.js';
import { sendAlertEmail } from '../utils/mailer.js';

export const executeResponse = async (alertId, action, target) => {
    console.log(`Executing response action: ${action} on target: ${target} for alert: ${alertId}`);

    try {
        let resultMessage = '';

        switch (action) {
            case 'BLOCK_IP':
                // Store in Redis set of blocked IPs
                await redisClient.sAdd('security:blocked_ips', target);
                resultMessage = `IP Address ${target} has been blocked and added to Redis firewall set.`;
                break;

            case 'DISABLE_USER':
                // Update Supabase users table
                const { error: userError } = await supabase
                    .from('users')
                    .update({ is_active: false })
                    .eq('email', target);

                if (userError) throw userError;
                resultMessage = `User account ${target} has been disabled in the primary identity database.`;
                break;

            case 'NOTIFY_ADMIN':
                // Get alert details to send meaningful email
                const { data: alertData, error: alertError } = await supabase
                    .from('alerts')
                    .select('*')
                    .eq('id', alertId)
                    .single();

                if (alertError) throw alertError;

                await sendAlertEmail(process.env.BREVO_USER, alertData);
                resultMessage = `Security administrator has been notified via emergency email channel.`;
                break;

            default:
                throw new Error('Unknown security action specified.');
        }

        // Log the response in the alert metadata
        const { data: currentAlert } = await supabase.from('alerts').select('metadata').eq('id', alertId).single();
        const updatedMetadata = {
            ...(currentAlert?.metadata || {}),
            automation_response: {
                action,
                target,
                executed_at: new Date().toISOString(),
                result: resultMessage
            }
        };

        await supabase
            .from('alerts')
            .update({ metadata: updatedMetadata, status: 'OPEN' })
            .eq('id', alertId);

        return { success: true, message: resultMessage };
    } catch (error) {
        console.error('Response Execution Error:', error);
        return { success: false, error: error.message };
    }
};
