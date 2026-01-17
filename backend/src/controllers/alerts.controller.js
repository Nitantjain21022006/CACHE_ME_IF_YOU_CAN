import * as alertService from '../services/alert.service.js';
import supabase from '../utils/supabaseClient.js';

export const getAlerts = async (req, res) => {
    try {
        const { sector, severity, status } = req.query;

        let query = supabase.from('alerts').select('*').order('created_at', { ascending: false });

        // Sector Scoping: SECTOR_OWNERs only see their assigned sector
        if (req.user.role === 'SECTOR_OWNER' && req.user.sector) {
            query = query.eq('sector', req.user.sector);
        } else if (sector) {
            query = query.eq('sector', sector);
        }

        if (severity) query = query.eq('severity', severity);
        if (status) query = query.eq('status', status);

        const { data, error } = await query;

        if (error) throw error;
        res.json({ success: true, alerts: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAlertById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('alerts').select('*').eq('id', id).single();

        if (error) throw error;
        res.json({ success: true, alert: data });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Alert not found' });
    }
};

export const resolveAlert = async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await alertService.resolveAlert(id, { notes, userId: req.user.id });

    if (result.success) {
        res.json({ success: true, message: 'Alert resolved', alert: result.alert });
    } else {
        res.status(500).json({ success: false, message: result.error });
    }
};
