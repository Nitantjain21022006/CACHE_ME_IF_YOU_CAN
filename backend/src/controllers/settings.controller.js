import supabase from '../utils/supabaseClient.js';

// 1. Security Thresholds
export const getSecuritySettings = async (req, res) => {
    try {
        const { data, error } = await supabase.from('settings_security').select('*').order('updated_at', { ascending: false }).limit(1).single();
        if (error) throw error;
        res.json({ success: true, settings: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSecuritySettings = async (req, res) => {
    try {
        const { low_threshold, medium_threshold, high_threshold, auto_response } = req.body;
        const { data, error } = await supabase.from('settings_security').insert([{
            low_threshold, medium_threshold, high_threshold, auto_response, updated_at: new Date().toISOString()
        }]).select().single();
        if (error) throw error;
        res.json({ success: true, settings: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Notifications
export const getNotificationSettings = async (req, res) => {
    try {
        const { data, error } = await supabase.from('settings_notifications').select('*').order('updated_at', { ascending: false }).limit(1).single();
        if (error) throw error;
        res.json({ success: true, settings: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateNotificationSettings = async (req, res) => {
    try {
        const { email_enabled, admin_email } = req.body;
        const { data, error } = await supabase.from('settings_notifications').insert([{
            email_enabled, admin_email, updated_at: new Date().toISOString()
        }]).select().single();
        if (error) throw error;
        res.json({ success: true, settings: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. API Keys
export const getApiKeys = async (req, res) => {
    try {
        const { data, error } = await supabase.from('api_keys').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ success: true, keys: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rotateApiKey = async (req, res) => {
    try {
        // Deactivate all previous keys for this platform
        await supabase.from('api_keys').update({ is_active: false }).eq('is_active', true);

        const newKey = 'cyber_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const { data, error } = await supabase.from('api_keys').insert([{
            key_value: newKey, label: 'Default Ingestion Key', is_active: true
        }]).select().single();
        if (error) throw error;
        res.json({ success: true, key: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Sector Management
export const getSectors = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sectors')
            .select('id, name, is_enabled, owner_id, owner:users(name, email)')
            .order('name');

        if (error) throw error;

        // Handle potential naming mismatches or missing sectors
        const formattedSectors = data.map(s => ({
            ...s,
            name: s.name.charAt(0) + s.name.slice(1).toLowerCase()
        }));

        res.json({ success: true, sectors: formattedSectors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSectorStatus = async (req, res) => {
    try {
        const { id, is_enabled, owner_id } = req.body;
        const { data, error } = await supabase.from('sectors').update({
            is_enabled, owner_id, updated_at: new Date().toISOString()
        }).eq('id', id).select().single();
        if (error) throw error;
        res.json({ success: true, sector: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
