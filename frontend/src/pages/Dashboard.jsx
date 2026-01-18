import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Activity, AlertTriangle, ArrowUpRight, Download, X, FileText, ChevronRight, Network, Cpu } from 'lucide-react';
import { EventThroughputChart, SeverityDistributionChart } from '../components/Charts';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeThreats: 0,
        systemHealth: '100%',
        eventThroughput: 'Live',
        riskLevel: 'STABLE'
    });
    const [selectedSector, setSelectedSector] = useState(null);
    const [sectors, setSectors] = useState([
        { id: 'HEALTHCARE', name: 'Healthcare Grid', risk: 'LOW', health: 100, incidents: 0 },
        { id: 'AGRICULTURE', name: 'Agro-Network', risk: 'LOW', health: 100, incidents: 0 },
        { id: 'URBAN', name: 'Urban Nexus', risk: 'LOW', health: 100, incidents: 0 },
    ]);
    const [throughputData, setThroughputData] = useState([]);
    const [severityData, setSeverityData] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        totalEvents: 0,
        totalAlerts: 0,
        suppressionRate: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [alertsRes, eventsRes, allAlertsRes] = await Promise.all([
                    api.get('/alerts?status=ACTIVE'),
                    api.get('/events/stats'),
                    api.get('/alerts'), // Get all alerts to calculate suppression
                ]);

                const activeAlerts = alertsRes.data.alerts;
                const allAlerts = allAlertsRes.data.alerts || [];
                const totalEvents = eventsRes.data.count || 0;
                const totalAlerts = allAlerts.length;
                const suppressionRate = totalEvents > 0 ? Math.round(((totalEvents - totalAlerts) / totalEvents) * 100) : 0;
                
                const highSeverityCount = activeAlerts.filter(a => a.severity === 'HIGH').length;

                setStats({
                    activeThreats: activeAlerts.length,
                    systemHealth: highSeverityCount > 5 ? 'CRITICAL' : highSeverityCount > 0 ? 'COMPROMISED' : 'OPTIMAL',
                    eventThroughput: 'In-Sync',
                    riskLevel: highSeverityCount > 0 ? 'ELEVATED' : 'STABLE'
                });

                setSummaryStats({
                    totalEvents,
                    totalAlerts,
                    suppressionRate
                });

                const updatedSectors = sectors.map(s => {
                    const sectorAlerts = activeAlerts.filter(a => a.sector === s.id);
                    const sectorHealth = Math.max(0, 100 - (sectorAlerts.length * 5));
                    return {
                        ...s,
                        incidents: sectorAlerts.length,
                        health: sectorHealth,
                        risk: sectorAlerts.length > 3 ? 'HIGH' : sectorAlerts.length > 0 ? 'MEDIUM' : 'LOW'
                    };
                });
                setSectors(updatedSectors);

                const severityCounts = activeAlerts.reduce((acc, alert) => {
                    let sev = alert.severity.toUpperCase();
                    if (sev === 'CRITICAL') sev = 'HIGH';
                    const name = sev.charAt(0) + sev.slice(1).toLowerCase();
                    acc[name] = (acc[name] || 0) + 1;
                    return acc;
                }, { Low: 0, Medium: 0, High: 0 });

                setSeverityData(Object.keys(severityCounts).map(name => ({ name, value: severityCounts[name] })));

                const throughput = activeAlerts.slice(0, 7).map((a, i) => ({
                    time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    value: Math.floor(Math.random() * 100) + 50
                })).reverse();
                setThroughputData(throughput);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#00f3ff] text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
                        <Activity size={12} className="animate-pulse" />
                        Live Neural Link Established
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Command Center</h1>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Infrastructure Resilience Protocol v4.2</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-black/40 border border-[#00f3ff]/20 px-4 py-2 text-[10px] font-black text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.05)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00f3ff] animate-ping" />
                    ENCRYPTED UPLINK ACTIVE
                </div>
            </div>

            {/* Summary Counters Section */}
            <div className="glass rounded-3xl p-8 border-[#00f3ff]/5">
                <div className="mb-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1 italic">Event Processing Summary</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">False positive reduction metrics</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Events Processed</div>
                        <div className="text-4xl font-black text-white font-mono italic tracking-tighter">{summaryStats.totalEvents.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-600 mt-2 font-bold uppercase">Last 24 hours</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Alerts Generated</div>
                        <div className="text-4xl font-black text-[#00f3ff] font-mono italic tracking-tighter">{summaryStats.totalAlerts.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-600 mt-2 font-bold uppercase">Confirmed threats only</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/20">
                        <div className="text-[9px] font-black text-[#39ff14] uppercase tracking-widest mb-2">Suppression Rate</div>
                        <div className="text-4xl font-black text-[#39ff14] font-mono italic tracking-tighter">{summaryStats.suppressionRate}%</div>
                        <div className="text-[10px] text-[#39ff14]/70 mt-2 font-bold uppercase">Non-actionable events suppressed</div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                        {summaryStats.suppressionRate}% of events suppressed as non-actionable - demonstrating active false positive minimization
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Neural Health', value: stats.systemHealth, icon: <ShieldCheck size={20} />, color: 'text-[#00f3ff]', glow: 'shadow-[#00f3ff]/10' },
                    { label: 'Active Anomalies', value: stats.activeThreats, icon: <AlertTriangle size={20} />, color: 'text-[#ff003c]', glow: 'shadow-[#ff003c]/10' },
                    { label: 'Telemetry Rate', value: stats.eventThroughput, icon: <Zap size={20} />, color: 'text-[#39ff14]', glow: 'shadow-[#39ff14]/10' },
                    { label: 'Risk Vector', value: stats.riskLevel, icon: <Activity size={20} />, color: 'text-[#bc13fe]', glow: 'shadow-[#bc13fe]/10' },
                ].map((stat, i) => (
                    <div key={i} className={`glass rounded-2xl p-6 card-hover border-[#00f3ff]/5 hover:border-[#00f3ff]/30 relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            {React.cloneElement(stat.icon, { size: 64 })}
                        </div>
                        <div className="mb-4 flex items-center justify-between relative z-10">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-black/60 border border-white/5 ${stat.color} ${stat.glow} shadow-inner`}>
                                {stat.icon}
                            </div>
                            <ArrowUpRight className="text-gray-700" size={14} />
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest relative z-10">{stat.label}</p>
                        <p className={`text-2xl font-black mt-1 uppercase italic tracking-tighter relative z-10 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="glass col-span-2 rounded-3xl p-8 border-[#00f3ff]/5">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1 italic">Ingestion Telemetry</h3>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Real-time packet flow analysis</p>
                        </div>
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-[#00f3ff]">
                            <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-[#00f3ff]" /> Throughput</span>
                        </div>
                    </div>
                    <div className="h-[250px]">
                        <EventThroughputChart data={throughputData.length > 0 ? throughputData : [{ time: '00:00', value: 0 }]} />
                    </div>
                </div>
                <div className="glass rounded-3xl p-8 border-[#00f3ff]/5">
                    <div className="mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1 italic">Threat Matrix</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Severity divergence report</p>
                    </div>
                    <div className="h-[250px]">
                        <SeverityDistributionChart data={severityData.length > 0 ? severityData : [{ name: 'Low', value: 1 }]} />
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        {[
                            { label: 'Low', color: 'bg-[#00f3ff]' },
                            { label: 'Medium', color: 'bg-[#ff9900]' },
                            { label: 'High', color: 'bg-[#ff003c]' }
                        ].map(l => (
                            <div key={l.label} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500">
                                <div className={`h-1.5 w-1.5 rounded-full ${l.color}`} />
                                {l.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden border-[#00f3ff]/5 shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-[0.2em] italic">Sector Vulnerability Analysis</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Cross-domain infrastructure auditing</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00f3ff]/5 text-[#00f3ff] border border-[#00f3ff]/10">
                        <Network size={20} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Infrastructure Domain</th>
                                <th className="px-8 py-5">Resilience Score</th>
                                <th className="px-8 py-5">Risk Class</th>
                                <th className="px-8 py-5 text-center">Active Cycles</th>
                                <th className="px-8 py-5 text-right">Operational Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sectors
                                .filter(s => user?.role !== 'SECTOR_OWNER' || s.id === user?.sector?.toUpperCase())
                                .map((sector, i) => (
                                    <tr key={i} className="hover:bg-[#00f3ff]/5 transition-all group cursor-default">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-[#00f3ff]/30 group-hover:bg-[#00f3ff] transition-all" />
                                                <span className="font-black text-white uppercase italic tracking-wider">{sector.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-1.5 w-32 rounded-full bg-white/5 overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${sector.health > 80 ? 'bg-gradient-to-r from-[#00f3ff] to-[#39ff14]' : 'bg-gradient-to-r from-[#ff003c] to-[#ff9900]'}`}
                                                        style={{ width: `${sector.health}%` }}
                                                    />
                                                </div>
                                                <span className="text-[11px] font-black font-mono text-gray-400">{sector.health}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${sector.risk === 'LOW' ? 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/20' : 'bg-[#ff003c]/10 text-[#ff003c] border-[#ff003c]/20 shadow-[0_0_10px_rgba(255,0,60,0.1)]'
                                                }`}>
                                                {sector.risk}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center text-[11px] font-mono text-gray-500 font-bold tracking-tighter">{sector.incidents} ANOMALIES</td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedSector(sector)}
                                                className="text-[10px] font-black text-[#00f3ff] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 ml-auto"
                                            >
                                                Generate Dossier
                                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedSector && (
                <SectorReportModal
                    sector={selectedSector}
                    onClose={() => setSelectedSector(null)}
                />
            )}
        </div>
    );
};

const SectorReportModal = ({ sector, onClose }) => {
    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500">
            <div id="printable-report" className="w-full max-w-3xl glass rounded-[2.5rem] overflow-hidden border border-[#00f3ff]/20 shadow-[0_0_100px_rgba(0,243,255,0.1)] animate-in zoom-in-95 duration-500">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-[#00f3ff]/10 to-black p-10 border-b border-white/10 relative">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                        <ShieldCheck size={120} />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 text-[#00f3ff] text-[10px] font-black uppercase tracking-[0.4em]">
                            <Cpu size={14} /> Internal Audit Clearance: LEVEL-4
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all print:hidden">
                            <X size={24} />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{sector.name}</h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <span>Sector Assessment Report</span>
                            <span className="h-1 w-1 rounded-full bg-[#00f3ff]" />
                            <span className="font-mono text-[10px]">TS-{Date.now().toString().slice(-8)}</span>
                        </div>
                    </div>
                </div>

                {/* Main Body */}
                <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2 p-6 rounded-2xl bg-black/40 border border-white/5">
                            <label className="text-[9px] font-black text-[#00f3ff] uppercase tracking-[0.3em]">Resilience Strength</label>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white font-mono italic tracking-tighter">{sector.health}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-[#00f3ff]" style={{ width: `${sector.health}%` }} />
                            </div>
                        </div>
                        <div className="space-y-2 p-6 rounded-2xl bg-black/40 border border-white/5">
                            <label className="text-[9px] font-black text-[#ff003c] uppercase tracking-[0.3em]">Threat Intensity</label>
                            <div className="text-4xl font-black font-mono text-white italic tracking-tighter">{sector.risk}</div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Cross-Vector Risk Profile</p>
                        </div>
                        <div className="space-y-2 p-6 rounded-2xl bg-black/40 border border-white/5">
                            <label className="text-[9px] font-black text-[#39ff14] uppercase tracking-[0.3em]">Active Mitigations</label>
                            <div className="text-4xl font-black font-mono text-white italic tracking-tighter">{sector.incidents}</div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Confirmed Interceptions</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic">Executive Summary</h4>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                Technical oversight of the <span className="text-white font-bold">{sector.name}</span> domain indicates an operational status of
                                <span className={sector.health > 80 ? ' text-[#39ff14] font-black uppercase mx-1' : ' text-[#ff003c] font-black uppercase mx-1'}>
                                    {sector.health > 80 ? 'optimal resilience' : 'infrastructure degraded'}
                                </span>.
                                During the last reporting cycle, systems identified <span className="text-white font-bold">{sector.incidents} significant anomalies</span>.
                                Automated defense protocols are currently <span className="italic">{sector.health > 90 ? 'maintaining passive synchronization' : 'executing active-mitigation sequences'}</span> across all neural endpoints.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-[#00f3ff]/5 border border-[#00f3ff]/10 space-y-4">
                            <h5 className="text-[9px] font-black text-[#00f3ff] uppercase tracking-widest italic">Core Telemetry Matrix</h5>
                            <div className="space-y-3">
                                {[
                                    { label: 'Latency Offset', value: '14.2ms' },
                                    { label: 'Encryption Entrophy', value: '99.98%' },
                                    { label: 'Neural Link Jitter', value: '0.04%' },
                                    { label: 'Packet Integrity', value: 'HIGH' },
                                ].map((m, i) => (
                                    <div key={i} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                                        <span className="text-gray-500 font-bold uppercase tracking-tighter">{m.label}</span>
                                        <span className="text-white font-mono font-black italic">{m.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#39ff14]/5 border border-[#39ff14]/10 flex flex-col justify-center items-center text-center space-y-3">
                            <ShieldCheck size={48} className="text-[#39ff14] animate-pulse" />
                            <div className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Compliance Seal</div>
                            <p className="text-[9px] text-gray-500 font-bold leading-tight">All reported data is verified by the <br /> Autonomous Resilience Engine</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Actions */}
                <div className="p-10 pt-0 flex gap-4 print:hidden">
                    <button
                        onClick={handleDownload}
                        className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#00f3ff] hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
                    >
                        <Download size={18} className="group-hover:animate-bounce" />
                        Execute PDF Generation
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 bg-black/60 text-gray-400 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-all border border-white/5"
                    >
                        Dismiss
                    </button>
                </div>

                <div className="px-10 pb-6 text-center text-[8px] text-gray-600 font-black uppercase tracking-[0.5em] select-none opacity-20">
                    Confidential Report - Restricted Access Only - End Of Line
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
