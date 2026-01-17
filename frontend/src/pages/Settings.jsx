import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Settings as SettingsIcon, Bell, Shield, Key, Globe, Loader2, Save, RefreshCw, CheckCircle2, X, AlertTriangle, Cpu, Database, Network, Activity, Gauge, Terminal as TerminalIcon, Copy, MessageSquare, ShieldAlert, ChevronRight, ChevronDown, Filter, ArrowUpRight } from 'lucide-react';

const Settings = () => {
    const [activeModule, setActiveModule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        security: { low_threshold: 0.3, medium_threshold: 0.6, high_threshold: 0.8, auto_response: false },
        notifications: { admin_email: 'admin@cyber.res', email_enabled: true },
        apiKeys: [],
        sectors: []
    });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [sec, notch, keys, sectors] = await Promise.all([
                api.get('/settings/security'),
                api.get('/settings/notifications'),
                api.get('/settings/api-keys'),
                api.get('/settings/sectors')
            ]);
            setSettings({
                security: sec.data.settings || settings.security,
                notifications: notch.data.settings || settings.notifications,
                apiKeys: keys.data.keys || [],
                sectors: sectors.data.sectors || []
            });
        } catch (err) {
            showToast('Sync failure: Governance link unstable', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveSecurity = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/settings/security', settings.security);
            setSettings({ ...settings, security: res.data.settings });
            showToast('Security heuristics updated');
        } catch (err) {
            showToast('Update aborted: Buffer error', 'error');
        } finally {
            setLoading(false);
            setActiveModule(null);
        }
    };

    const handleRotateKey = async () => {
        setLoading(true);
        try {
            const res = await api.post('/settings/api-keys/rotate');
            setSettings({ ...settings, apiKeys: [res.data.key, ...settings.apiKeys] });
            showToast('Ingestion Key Recalibrated');
        } catch (err) {
            showToast('Rotation failed: Neural lockout', 'error');
        } finally {
            setLoading(false);
        }
    };

    const modules = [
        { id: 'security', icon: <Shield />, title: 'Threat Thresholds', desc: 'Recalibrate ML divergence sensitivity and automated interception triggers.', color: 'text-[#ff003c]' },
        { id: 'notifications', icon: <Bell />, title: 'Telemetry Uplink', desc: 'Secure dispatch channels for high-priority anomaly broadcasts.', color: 'text-[#39ff14]' },
        { id: 'api', icon: <Key />, title: 'Ingestion Keys', desc: 'Manage crypt-tokens for external sector data collection.', color: 'text-[#00f3ff]' },
        { id: 'sectors', icon: <Globe />, title: 'Grid Domains', desc: 'Assign infrastructure owners and verify regional grid synchronicity.', color: 'text-[#bc13fe]' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {toast && (
                <div className={`fixed top-12 right-12 z-[100] flex items-center gap-4 px-8 py-5 rounded-[1.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-right-10 duration-500 glass border ${toast.type === 'error' ? 'border-[#ff003c]/50 text-[#ff003c]' : 'border-[#00f3ff]/50 text-[#00f3ff]'
                    }`}>
                    {toast.type === 'error' ? <ShieldAlert size={24} /> : <CheckCircle2 size={24} />}
                    <span className="font-black uppercase tracking-widest text-[10px] italic">{toast.message}</span>
                </div>
            )}

            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#bc13fe] text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                        <SettingsIcon size={12} className="animate-spin-slow" />
                        Root Governance Interface
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase italic text-glow">Admin Command</h1>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Infrastructure Control & Resilience Protocols</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-black/40 border border-[#bc13fe]/20 px-4 py-2 text-[10px] font-black text-[#bc13fe] shadow-[0_0_15px_rgba(188,19,254,0.05)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#bc13fe] animate-pulse" />
                    ENCRYPTED SUDO SESSION
                </div>
            </div>

            {loading && !activeModule && (
                <div className="py-20 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#bc13fe]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bc13fe] animate-pulse">Synchronizing Core Logic...</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((mod) => (
                    <div key={mod.id} className="glass rounded-[2rem] p-8 flex flex-col border-[#00f3ff]/5 card-hover relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            {React.cloneElement(mod.icon, { size: 100 })}
                        </div>
                        <div className="flex items-start gap-6 mb-8 relative z-10">
                            <div className={`h-16 w-16 shrink-0 flex items-center justify-center rounded-2xl bg-black/60 border border-white/5 ${mod.color} shadow-inner`}>
                                {React.cloneElement(mod.icon, { size: 28 })}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase italic tracking-wider">{mod.title}</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed mt-1 tracking-tighter">{mod.desc}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveModule(mod.id)}
                            className="mt-auto bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#00f3ff] hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.05)] relative z-10 italic"
                        >
                            Open Terminal
                        </button>
                    </div>
                ))}
            </div>

            {/* MODALS */}
            {activeModule && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="w-full max-w-xl glass rounded-[2.5rem] border border-[#00f3ff]/30 shadow-[0_0_100px_rgba(0,243,255,0.1)] overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="bg-gradient-to-r from-[#00f3ff]/10 to-transparent p-8 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-black/60 border border-[#00f3ff]/30 flex items-center justify-center text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                                    <TerminalIcon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Terminal: {activeModule.toUpperCase()}</h2>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sudo Override Matrix</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveModule(null)} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-10">
                            {activeModule === 'security' && (
                                <form onSubmit={handleSaveSecurity} className="space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <ThresholdInput
                                            label="Class: LOW"
                                            value={settings.security?.low_threshold}
                                            onChange={(v) => setSettings({ ...settings, security: { ...settings.security, low_threshold: v } })}
                                        />
                                        <ThresholdInput
                                            label="Class: MEDIUM"
                                            value={settings.security?.medium_threshold}
                                            onChange={(v) => setSettings({ ...settings, security: { ...settings.security, medium_threshold: v } })}
                                        />
                                        <ThresholdInput
                                            label="Class: HIGH"
                                            value={settings.security?.high_threshold}
                                            onChange={(v) => setSettings({ ...settings, security: { ...settings.security, high_threshold: v } })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-white/5">
                                        <div>
                                            <h4 className="text-[11px] font-black text-white uppercase italic tracking-widest">Autonomous Defense</h4>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-1">Execute mitigation without confirmation</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, security: { ...settings.security, auto_response: !settings.security?.auto_response } })}
                                            className={`w-14 h-7 rounded-full transition-all relative border ${settings.security?.auto_response ? 'bg-[#ff003c]/20 border-[#ff003c]/40' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.security?.auto_response ? 'right-1 bg-[#ff003c] shadow-[0_0_10px_#ff003c]' : 'left-1 bg-gray-600'}`} />
                                        </button>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-[#ff003c] py-5 rounded-2xl font-black text-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,0,60,0.2)]">
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Update Security Matrix
                                    </button>
                                </form>
                            )}

                            {activeModule === 'api' && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        {settings.apiKeys.map((key) => (
                                            <div key={key.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-4 group">
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-black text-[#00f3ff] uppercase tracking-widest italic">{key.label}</span>
                                                        {key.is_active && <span className="text-[8px] bg-[#39ff14]/10 text-[#39ff14] px-2 py-0.5 rounded-full font-black border border-[#39ff14]/20 animate-pulse">ENCRYPTED</span>}
                                                    </div>
                                                    <div className="text-xs font-mono text-gray-500 truncate bg-black/40 p-2 rounded-lg border border-white/5">{key.key_value}</div>
                                                </div>
                                                <button
                                                    onClick={() => { navigator.clipboard.writeText(key.key_value); showToast('Key Synchronized to Clipboard') }}
                                                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-[#00f3ff] hover:bg-[#00f3ff]/10 border border-white/5 transition-all"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleRotateKey}
                                        disabled={loading}
                                        className="w-full bg-[#00f3ff] py-5 rounded-2xl font-black text-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                                    >
                                        <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
                                        Initialize Key Rotation
                                    </button>
                                </div>
                            )}

                            {activeModule === 'notifications' && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest pl-1">Primary Dispatch Email</label>
                                            <div className="relative">
                                                <input
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white italic outline-none focus:border-[#39ff14]/50 transition-all"
                                                    value={settings.notifications?.admin_email || ''}
                                                    readOnly
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />
                                                    <span className="text-[8px] font-black text-[#39ff14] uppercase tracking-widest">Verified</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 opacity-40 grayscale">
                                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-gray-400">
                                                    <div className="h-10 w-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">
                                                        <MessageSquare size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-[11px] uppercase italic tracking-wider">Discord Sub-Neural Link</span>
                                                        <p className="text-[9px] font-bold uppercase tracking-tighter mt-0.5">Integration Bridge v2.1</p>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20 italic">Level-5 Required</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModule(null)} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#39ff14] transition-all italic">
                                        Confirm Channels
                                    </button>
                                </div>
                            )}

                            {activeModule === 'sectors' && (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {settings.sectors.map((sector) => (
                                        <div key={sector.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-4 card-hover">
                                            <div className="flex items-center gap-5">
                                                <div className={`h-4 w-4 rounded-full ${sector.is_enabled ? 'bg-[#39ff14] shadow-[0_0_10px_#39ff14]' : 'bg-[#ff003c]'} border-2 border-black`} />
                                                <div>
                                                    <h4 className="font-black text-white text-[11px] uppercase italic tracking-[0.2em]">{sector.name}</h4>
                                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter mt-1">Scoping ID: {sector.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-[8px] text-gray-600 font-black uppercase tracking-tighter mb-0.5">Link Entity</div>
                                                    <div className="text-[10px] text-white font-black italic">{sector.owner?.name || 'ROOT'}</div>
                                                </div>
                                                <button className="h-10 w-10 rounded-xl bg-white/5 text-gray-500 hover:text-[#bc13fe] border border-white/5 flex items-center justify-center transition-all">
                                                    <SettingsIcon size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="px-12 py-6 bg-black/40 text-[8px] text-gray-700 font-black uppercase tracking-[0.5em] select-none text-center italic border-t border-white/5">
                            Neural Interface Sync: COMPLETED
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ThresholdInput = ({ label, value, onChange }) => (
    <div className="space-y-3">
        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest pl-1">{label}</label>
        <div className="relative group">
            <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                value={value || ''}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00f3ff]/50 group-hover:border-white/10 transition-all font-mono text-sm font-black italic"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#00f3ff]/40 font-black text-[10px] pointer-events-none uppercase italic">Sigma</div>
        </div>
    </div>
);

// HELPER COMPONENTS
const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="w-full max-w-lg glass rounded-3xl p-8 border border-white/10 shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all">
                    <X size={24} />
                </button>
            </div>
            {children}
        </div>
    </div>
);

export default Settings;
