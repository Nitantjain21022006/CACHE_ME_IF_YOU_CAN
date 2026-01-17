import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Gauge, Cpu, Network, Database } from 'lucide-react';
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
        const interval = setInterval(fetchMetrics, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading infrastructure data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">System Metrics</h1>
                    <p className="text-gray-400">Low-level infrastructure performance data</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                    { label: 'CPU Usage', value: metrics.cpu.label, icon: <Cpu />, color: 'text-primary' },
                    { label: 'Memory', value: metrics.memory.label, icon: <Database />, color: 'text-accent' },
                    { label: 'Network Requests', value: metrics.network.label, icon: <Network />, color: 'text-warning' },
                ].map((m, i) => (
                    <div key={i} className="glass rounded-xl p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-white/5 ${m.color}`}>{m.icon}</div>
                        <div>
                            <p className="text-sm text-gray-400">{m.label}</p>
                            <p className="text-xl font-bold">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass rounded-xl p-8">
                <h3 className="mb-8 text-lg font-semibold">Resource Utilization Over Time</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1f2937' }} />
                            <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="mem" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="network" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SystemMetrics;
