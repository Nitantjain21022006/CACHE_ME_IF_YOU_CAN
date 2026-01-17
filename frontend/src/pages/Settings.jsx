import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Key, Globe } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Platform Settings</h1>
                <p className="text-gray-400">Configure thresholds and system behavior</p>
            </div>

            <div className="space-y-4">
                {[
                    { icon: <Shield />, title: 'Security Thresholds', desc: 'Adjust ML sensitivity and auto-response triggers.' },
                    { icon: <Bell />, title: 'Notification Channels', desc: 'Configure email, Slack, and SMS alert destinations.' },
                    { icon: <Key />, title: 'API Access', desc: 'Manage service tokens and ingestion keys.' },
                    { icon: <Globe />, title: 'Sector Management', desc: 'Define monitoring scope for healthcare and urban systems.' },
                ].map((item, i) => (
                    <div key={i} className="glass rounded-xl p-6 flex items-center justify-between card-hover cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-white/5 text-primary">{item.icon}</div>
                            <div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Manage</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
