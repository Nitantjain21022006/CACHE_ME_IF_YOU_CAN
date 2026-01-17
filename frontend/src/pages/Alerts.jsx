import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, AlertTriangle, Eye, CheckCircle, ChevronDown } from 'lucide-react';
import api from '../api/axiosInstance';
import SeverityBadge from '../components/SeverityBadge';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSector, setFilterSector] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const alertsPerPage = 10;

    useEffect(() => {
        fetchAlerts();
        setCurrentPage(1); // Reset to first page on filter change
    }, [filterSector, filterSeverity]);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/alerts', {
                params: { sector: filterSector, severity: filterSeverity }
            });
            setAlerts(response.data.alerts);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination Logic
    const indexOfLastAlert = currentPage * alertsPerPage;
    const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
    const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);
    const totalPages = Math.ceil(alerts.length / alertsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#ff003c] text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                        <AlertTriangle size={12} className="animate-pulse" />
                        Active Vector Intelligence
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Anomaly Stream</h1>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Intercepted Infrastructure Events</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00f3ff]/40 group-focus-within:text-[#00f3ff]" />
                        <select
                            value={filterSector}
                            onChange={(e) => setFilterSector(e.target.value)}
                            className="appearance-none rounded-xl border border-white/5 bg-black/40 py-3 pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-[#00f3ff] outline-none focus:border-[#00f3ff]/50 transition-all cursor-pointer shadow-inner"
                        >
                            <option value="">All Sectors</option>
                            <option value="HEALTHCARE">Healthcare Grid</option>
                            <option value="AGRICULTURE">Agro-Network</option>
                            <option value="URBAN">Urban Nexus</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00f3ff]/40 pointer-events-none" />
                    </div>

                    <div className="relative group">
                        <select
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            className="appearance-none rounded-xl border border-white/5 bg-black/40 py-3 px-6 pr-10 text-[10px] font-black uppercase tracking-widest text-[#ff003c] outline-none focus:border-[#ff003c]/50 transition-all cursor-pointer shadow-inner"
                        >
                            <option value="" className="bg-[#0a0a0a] text-gray-400">All Severities</option>
                            <option value="LOW" className="bg-[#0a0a0a] text-gray-400">Class: LOW</option>
                            <option value="MEDIUM" className="bg-[#0a0a0a] text-gray-400">Class: MEDIUM</option>
                            <option value="HIGH" className="bg-[#0a0a0a] text-gray-400">Class: HIGH</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff003c]/40 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border-[#00f3ff]/5 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f3ff]/20 to-transparent" />

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#00f3ff]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00f3ff] animate-pulse">Decrypting Anomaly Pipeline...</span>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic italic">Neural Shield Active</h3>
                        <p className="mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">No critical anomalies detected in current cycle</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                    <th className="px-8 py-5">Anomaly Classification</th>
                                    <th className="px-8 py-5">Origin Vector</th>
                                    <th className="px-8 py-5">Threat Magnitude</th>
                                    <th className="px-8 py-5">Operational State</th>
                                    <th className="px-8 py-5">Timestamp</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {currentAlerts.map((alert) => (
                                    <tr key={alert.id} className="hover:bg-[#00f3ff]/5 transition-all group border-l-2 border-transparent hover:border-l-[#00f3ff]">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 border border-white/5 ${alert.severity === 'HIGH' ? 'text-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,0.1)]' : 'text-[#ff9900]'
                                                    }`}>
                                                    <AlertTriangle size={18} className={alert.severity === 'HIGH' ? 'animate-pulse' : ''} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-white uppercase italic tracking-wider group-hover:neon-text-blue transition-all">{alert.type}</span>
                                                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">ID: {alert.id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{alert.sector}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <SeverityBadge severity={alert.severity} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${alert.status === 'ACTIVE' ? 'bg-[#ff003c] animate-ping' : 'bg-gray-700'}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${alert.status === 'ACTIVE' ? 'text-[#ff003c]' : 'text-gray-600'}`}>
                                                    {alert.status === 'ACTIVE' ? 'LIVE THREAT' : 'RESOLVED'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-tighter">
                                            [{new Date(alert.created_at).toLocaleString()}]
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                to={`/alerts/${alert.id}`}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:bg-[#00f3ff]/10 hover:text-[#00f3ff] hover:border-[#00f3ff]/30 border border-white/5 transition-all group/btn shadow-inner"
                                            >
                                                <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && alerts.length > 0 && (
                    <div className="flex items-center justify-between px-8 py-6 bg-black/40 border-t border-white/5">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                            Displaying {indexOfFirstAlert + 1}-{Math.min(indexOfLastAlert, alerts.length)} OF {alerts.length} Records
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex h-10 w-24 items-center justify-center rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed border border-white/5 transition-all"
                            >
                                <ChevronDown size={14} className="rotate-90 mr-1" />
                                Previous
                            </button>
                            <div className="flex items-center gap-1.5 mx-4">
                                {[...Array(totalPages)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-500 ${currentPage === i + 1 ? 'w-6 bg-[#00f3ff]' : 'w-2 bg-white/10'}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex h-10 w-24 items-center justify-center rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed border border-white/5 transition-all"
                            >
                                Next
                                <ChevronDown size={14} className="-rotate-90 ml-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alerts;
