import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Gauge, Cpu, Network, Database, Activity } from 'lucide-react';
import api from '../api/axiosInstance';

const SystemMetrics = () => {
    const [metrics, setMetrics] = useState({
        cpu: { label: '0%', current: 0 },
        memory: { label: '0GB / 0GB', used: 0, total: 0 },
        network: { label: '0 Req/hr', requests: 0 }
    });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/system/metrics');
                setMetrics(response.data.metrics);
                setHistory(response.data.history);
            } catch (error) {
                console.error('Error fetching system metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex h-[400px] flex-col items-center justify-center text-[#00f3ff]">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#00f3ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Synchronizing Telemetry...</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#39ff14] text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                        <Gauge size={12} className="animate-pulse" />
                        Infrastructure Sensor Network
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Telemetry Lab</h1>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Real-time hardware utilization analytics</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-black/40 border border-[#39ff14]/20 px-4 py-2 text-[10px] font-black text-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.05)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#39ff14] animate-ping" />
                    SENSORS CALIBRATED
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                    { label: 'CPU Computation Load', value: metrics.cpu.label, icon: <Cpu />, color: 'text-[#00f3ff]', glow: 'shadow-[#00f3ff]/10' },
                    { label: 'Neural Memory Matrix', value: metrics.memory.label, icon: <Database />, color: 'text-[#bc13fe]', glow: 'shadow-[#bc13fe]/10' },
                    { label: 'Packet Throughput', value: metrics.network.label, icon: <Network />, color: 'text-[#39ff14]', glow: 'shadow-[#39ff14]/10' },
                ].map((m, i) => (
                    <div key={i} className="glass rounded-[2rem] p-8 card-hover border-[#00f3ff]/5 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            {React.cloneElement(m.icon, { size: 100 })}
                        </div>
                        <div className={`p-4 rounded-2xl bg-black/60 border border-white/5 inline-flex mb-6 ${m.color} ${m.glow} shadow-inner`}>
                            {m.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.label}</p>
                            <p className="text-3xl font-black text-white italic tracking-tighter font-mono">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass rounded-[2.5rem] p-10 border-[#00f3ff]/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Activity size={200} />
                </div>
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-[0.2em] italic">Resource Lifecycle Telemetry</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Cross-layered utilization history</p>
                    </div>
                </div>
                <div className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#bc13fe" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#39ff14" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(2, 2, 4, 0.95)',
                                    border: '1px solid rgba(0, 243, 255, 0.2)',
                                    borderRadius: '16px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="cpu"
                                stackId="1"
                                stroke="#00f3ff"
                                strokeWidth={3}
                                fill="url(#colorCpu)"
                            />
                            <Area
                                type="monotone"
                                dataKey="mem"
                                stackId="1"
                                stroke="#bc13fe"
                                strokeWidth={3}
                                fill="url(#colorMem)"
                            />
                            <Area
                                type="monotone"
                                dataKey="network"
                                stackId="1"
                                stroke="#39ff14"
                                strokeWidth={3}
                                fill="url(#colorNet)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-10">
                    {[
                        { label: 'Neural Processing', color: 'bg-[#00f3ff]' },
                        { label: 'Grid Buffer', color: 'bg-[#bc13fe]' },
                        { label: 'Ether Flux', color: 'bg-[#39ff14]' }
                    ].map(l => (
                        <div key={l.label} className="flex items-center gap-2.5 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                            <div className={`h-2 w-2 rounded-full ${l.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
                            {l.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemMetrics;
