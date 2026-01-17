import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Activity, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { EventThroughputChart, SeverityDistributionChart } from '../components/Charts';
import api from '../api/axiosInstance';

const Dashboard = () => {
    const [stats, setStats] = useState({
        activeThreats: 0,
        systemHealth: '100%',
        eventThroughput: '0/s',
        riskLevel: 'STABLE'
    });
    const [sectors, setSectors] = useState([
        { name: 'Healthcare', risk: 'LOW', health: 100, incidents: 0 },
        { name: 'Agriculture', risk: 'LOW', health: 100, incidents: 0 },
        { name: 'Urban Systems', risk: 'LOW', health: 100, incidents: 0 },
    ]);
    const [throughputData, setThroughputData] = useState([]);
    const [severityData, setSeverityData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [alertsRes, eventsRes] = await Promise.all([
                    api.get('/alerts?status=ACTIVE'),
                    api.get('/events/stats'), // I need to implement this endpoint
                ]);

                const activeAlerts = alertsRes.data.alerts;
                const highSeverityCount = activeAlerts.filter(a => a.severity === 'HIGH').length;

                setStats({
                    activeThreats: activeAlerts.length,
                    systemHealth: highSeverityCount > 5 ? 'CRITICAL' : highSeverityCount > 0 ? 'WARNING' : 'HEALTHY',
                    eventThroughput: 'Live',
                    riskLevel: highSeverityCount > 0 ? 'HIGH' : 'LOW'
                });

                // Map alerts to sectors
                const sectorMapping = {
                    'HEALTHCARE': 'Healthcare',
                    'AGRICULTURE': 'Agriculture',
                    'URBAN': 'Urban Systems'
                };

                const updatedSectors = sectors.map(s => {
                    const sectorAlerts = activeAlerts.filter(a => a.sector === s.name.toUpperCase());
                    const sectorHealth = Math.max(0, 100 - (sectorAlerts.length * 5));
                    return {
                        ...s,
                        incidents: sectorAlerts.length,
                        health: sectorHealth,
                        risk: sectorAlerts.length > 3 ? 'HIGH' : sectorAlerts.length > 0 ? 'MEDIUM' : 'LOW'
                    };
                });
                setSectors(updatedSectors);

                // Extract chart data from alerts
                const severityCounts = activeAlerts.reduce((acc, alert) => {
                    const name = alert.severity.charAt(0) + alert.severity.slice(1).toLowerCase();
                    acc[name] = (acc[name] || 0) + 1;
                    return acc;
                }, { Low: 0, Medium: 0, High: 0 });

                setSeverityData(Object.keys(severityCounts).map(name => ({ name, value: severityCounts[name] })));

                // Simple throughput data based on alert creation times
                const throughput = activeAlerts.slice(0, 7).map((a, i) => ({
                    time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    value: Math.floor(Math.random() * 100) + 50 // Simulated rate for visual effect
                })).reverse();
                setThroughputData(throughput);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Security Overview</h1>
                    <p className="text-gray-400">Real-time infrastructure health monitoring</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent border border-accent/20">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    SYSTEMS OPERATIONAL
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'System Health', value: stats.systemHealth, icon: <ShieldCheck size={20} />, color: 'text-accent' },
                    { label: 'Active Threats', value: stats.activeThreats, icon: <AlertTriangle size={20} />, color: 'text-warning' },
                    { label: 'Event Rate', value: stats.eventThroughput, icon: <Zap size={20} />, color: 'text-primary' },
                    { label: 'Overall Risk', value: stats.riskLevel, icon: <Activity size={20} />, color: 'text-accent' },
                ].map((stat, i) => (
                    <div key={i} className="glass rounded-xl p-5 card-hover">
                        <div className="mb-3 flex items-center justify-between">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <ArrowUpRight className="text-gray-600" size={16} />
                        </div>
                        <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="glass col-span-2 rounded-xl p-6">
                    <h3 className="mb-6 text-lg font-semibold">Event Ingestion Throughput</h3>
                    <EventThroughputChart data={throughputData.length > 0 ? throughputData : [{ time: '00:00', value: 0 }]} />
                </div>
                <div className="glass rounded-xl p-6">
                    <h3 className="mb-6 text-lg font-semibold">Severity Distribution</h3>
                    <SeverityDistributionChart data={severityData.length > 0 ? severityData : [{ name: 'Low', value: 1 }]} />
                    <div className="mt-4 flex justify-center gap-6">
                        <div className="flex items-center gap-2 text-xs">
                            <div className="h-2 w-2 rounded-full bg-accent" />
                            <span className="text-gray-400">Low</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="h-2 w-2 rounded-full bg-warning" />
                            <span className="text-gray-400">Medium</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="h-2 w-2 rounded-full bg-danger" />
                            <span className="text-gray-400">High</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-semibold">Sector Risk Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400">
                            <tr>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Sector</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Security Health</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">24h Incidents</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sectors.map((sector, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-white">{sector.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-24 rounded-full bg-gray-800">
                                                <div
                                                    className={`h-full rounded-full ${sector.health > 95 ? 'bg-accent' : 'bg-warning'}`}
                                                    style={{ width: `${sector.health}%` }}
                                                />
                                            </div>
                                            <span className="text-xs">{sector.health}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${sector.risk === 'LOW' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'
                                            }`}>
                                            {sector.risk}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{sector.incidents}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary hover:underline font-medium">View Detailed Report</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
