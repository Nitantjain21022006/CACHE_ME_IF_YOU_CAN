import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import api from '../api/axiosInstance';
import SeverityBadge from '../components/SeverityBadge';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSector, setFilterSector] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('');

    useEffect(() => {
        fetchAlerts();
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Security Alerts</h1>
                    <p className="text-gray-400">Manage and respond to system anomalies</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <select
                            value={filterSector}
                            onChange={(e) => setFilterSector(e.target.value)}
                            className="appearance-none rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-8 text-sm outline-none focus:border-primary/50 transition-all"
                        >
                            <option value="">All Sectors</option>
                            <option value="HEALTHCARE">Healthcare</option>
                            <option value="AGRICULTURE">Agriculture</option>
                            <option value="URBAN">Urban Systems</option>
                        </select>
                    </div>

                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="appearance-none rounded-lg border border-white/10 bg-white/5 py-2 px-4 text-sm outline-none focus:border-primary/50 transition-all"
                    >
                        <option value="">All Severities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading alerts...</div>
                ) : alerts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-gray-500">
                            <CheckCircle size={24} />
                        </div>
                        <p className="text-gray-400">No active alerts found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Alert Type</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Sector</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Severity</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Detected At</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {alerts.map((alert) => (
                                    <tr key={alert.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded bg-opacity-10 ${alert.severity === 'HIGH' ? 'bg-danger text-danger' : 'bg-warning text-warning'
                                                    }`}>
                                                    <AlertTriangle size={16} />
                                                </div>
                                                <span className="font-medium text-white">{alert.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{alert.sector}</td>
                                        <td className="px-6 py-4"><SeverityBadge severity={alert.severity} /></td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold ${alert.status === 'ACTIVE' ? 'text-danger' : 'text-gray-500'}`}>
                                                {alert.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(alert.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/alerts/${alert.id}`}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-primary/20 hover:text-primary transition-all"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alerts;
