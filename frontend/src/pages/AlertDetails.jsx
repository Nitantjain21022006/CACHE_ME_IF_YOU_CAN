import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Cpu, Activity, Send, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axiosInstance';
import SeverityBadge from '../components/SeverityBadge';

const AlertDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionResult, setActionResult] = useState(null);

    useEffect(() => {
        fetchAlert();
    }, [id]);

    const fetchAlert = async () => {
        try {
            const response = await api.get(`/alerts/${id}`);
            setAlert(response.data.alert);
        } catch (error) {
            console.error('Error fetching alert details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExecuteAction = async (action, target) => {
        setActionLoading(true);
        setActionResult(null);
        try {
            const response = await api.post('/responses/execute', { action, target, alertId: id });
            setActionResult({ success: true, message: response.data.message });
            // Refresh alert status if needed
        } catch (error) {
            setActionResult({ success: false, message: error.response?.data?.message || 'Action failed' });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">Loading alert details...</div>;
    if (!alert) return <div className="p-12 text-center text-danger">Alert not found.</div>;

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
            >
                <ArrowLeft size={16} />
                Back to Alerts
            </button>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-xl p-8 border-l-4 border-l-danger">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-3">
                                    <SeverityBadge severity={alert.severity} />
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{alert.sector}</span>
                                </div>
                                <h1 className="text-3xl font-bold">{alert.type}</h1>
                                <p className="mt-2 text-gray-400">{alert.explanation}</p>
                            </div>
                            <div className="rounded-full bg-danger/10 p-3 text-danger">
                                <ShieldAlert size={32} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Detection Confidence</p>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="flex-1 h-2 rounded-full bg-gray-800">
                                        <div className="h-full rounded-full bg-primary" style={{ width: `${alert.score * 100}%` }} />
                                    </div>
                                    <span className="text-lg font-bold font-mono">{(alert.score * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Alert Status</p>
                                <p className={`mt-1 text-lg font-bold ${alert.status === 'ACTIVE' ? 'text-danger' : 'text-accent'}`}>
                                    {alert.status}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-8">
                        <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                            <Cpu size={20} className="text-primary" />
                            Raw Event Metadata
                        </h3>
                        <pre className="overflow-x-auto rounded-lg bg-black/50 p-4 text-xs text-gray-400 font-mono">
                            {JSON.stringify(alert.metadata, null, 2)}
                        </pre>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass rounded-xl p-6 bg-gradient-to-b from-primary/5 to-transparent border border-primary/20">
                        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                            <Send size={18} className="text-primary" />
                            Recommended Response
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Automated analysis suggests the following defensive actions:
                        </p>

                        {alert.severity === 'HIGH' && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleExecuteAction('BLOCK_IP', alert.metadata?.ip || '127.0.0.1')}
                                    disabled={actionLoading}
                                    className="w-full rounded-lg bg-danger/20 border border-danger/30 py-3 text-sm font-semibold text-danger hover:bg-danger/30 transition-all flex items-center justify-center gap-2"
                                >
                                    BLOCK SOURCE IP
                                </button>
                                <button
                                    onClick={() => handleExecuteAction('DISABLE_USER', alert.metadata?.email || alert.metadata?.user_id || 'unknown@user.com')}
                                    disabled={actionLoading}
                                    className="w-full rounded-lg border border-white/10 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-all"
                                >
                                    DISABLE AFFECTED USER
                                </button>
                                <button
                                    onClick={() => handleExecuteAction('NOTIFY_ADMIN', 'SECURITY_OFFICER')}
                                    disabled={actionLoading}
                                    className="w-full rounded-lg border border-primary/20 bg-primary/5 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-all"
                                >
                                    ESCALATE TO ADMIN
                                </button>
                            </div>
                        )}

                        {alert.severity !== 'HIGH' && (
                            <div className="rounded-lg bg-white/5 p-4 text-center">
                                <p className="text-xs text-gray-500 italic">
                                    Automated responses are restricted to HIGH severity alerts.
                                </p>
                            </div>
                        )}

                        {actionResult && (
                            <div className={`mt-6 rounded-lg p-4 text-xs flex gap-3 ${actionResult.success ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-danger/10 text-danger border border-danger/20'
                                }`}>
                                {actionResult.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                <span>{actionResult.message}</span>
                            </div>
                        )}
                    </div>

                    <div className="glass rounded-xl p-6">
                        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                            <Activity size={18} className="text-warning" />
                            Timeline
                        </h3>
                        <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                            <div className="relative pl-6">
                                <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-danger bg-background" />
                                <p className="text-xs font-bold text-white">Threat Detected</p>
                                <p className="text-[10px] text-gray-500">{new Date(alert.created_at).toLocaleString()}</p>
                            </div>
                            <div className="relative pl-6">
                                <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                                <p className="text-xs font-bold text-white">ML Analysis Completed</p>
                                <p className="text-[10px] text-gray-500">2.4ms later</p>
                            </div>
                            <div className="relative pl-6 opacity-40">
                                <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-gray-600 bg-background" />
                                <p className="text-xs font-bold text-gray-400">Awaiting Response</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertDetails;
