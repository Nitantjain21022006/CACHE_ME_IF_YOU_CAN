import React, { useState } from 'react';
import { Network, AlertCircle } from 'lucide-react';

const IPPatternBadge = ({ alert }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    // Extract IP pattern from metadata
    const context = alert.metadata?.context || {};
    const uniqueIps = context.unique_ips_60s || 0;
    const eventRate = context.event_rate_60s || 0;
    const metrics = alert.metadata?.metrics || {};
    const ip = metrics.ip || alert.metadata?.ip || 'N/A';
    
    // Determine pattern based on unique_ips_60s and event structure
    let pattern = 'UNKNOWN';
    let description = 'Pattern analysis pending';
    
    // Pattern detection logic
    if (uniqueIps === 1 || uniqueIps === 0) {
        // Single IP pattern - could be Single IP → Single Server or Single IP → Multiple Servers
        // We'll check if there are multiple locations/devices
        const locationId = metrics.location_id || 0;
        const deviceId = metrics.device_id || 0;
        pattern = 'SINGLE_IP_SINGLE_SERVER';
        description = 'Single IP targeting single server - Potential focused attack or legitimate user';
    } else if (uniqueIps >= 2 && uniqueIps <= 5) {
        pattern = 'MULTI_IP_SINGLE_SERVER';
        description = 'Multiple IPs targeting single server - Distributed attack or coordinated access';
    } else if (uniqueIps > 5) {
        pattern = 'MULTI_IP_MULTI_SERVER';
        description = 'Multiple IPs across multiple servers - Large-scale distributed attack';
    }
    
    const patternConfig = {
        SINGLE_IP_SINGLE_SERVER: {
            label: '1 IP → 1 Server',
            color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            icon: <Network size={12} />
        },
        MULTI_IP_SINGLE_SERVER: {
            label: 'N IPs → 1 Server',
            color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            icon: <AlertCircle size={12} />
        },
        MULTI_IP_MULTI_SERVER: {
            label: 'N IPs → N Servers',
            color: 'bg-red-500/10 text-red-400 border-red-500/20',
            icon: <AlertCircle size={12} />
        }
    };
    
    const config = patternConfig[pattern] || patternConfig.SINGLE_IP_SINGLE_SERVER;
    
    return (
        <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${config.color}`}>
                {config.icon}
                {config.label}
            </span>
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-black/95 border border-white/10 p-3 text-[10px] shadow-xl z-50">
                    <div className="font-black text-white uppercase mb-1.5">{pattern.replace(/_/g, ' ')}</div>
                    <div className="text-gray-400 mb-2">{description}</div>
                    <div className="space-y-1 text-gray-500">
                        <div>Unique IPs: {uniqueIps}</div>
                        <div>Event Rate: {eventRate}/min</div>
                        <div className="pt-1 border-t border-white/5 text-[9px]">
                            {pattern === 'MULTI_IP_SINGLE_SERVER' && 'Suspicious: Coordinated access from multiple sources targeting same resource'}
                            {pattern === 'MULTI_IP_MULTI_SERVER' && 'Critical: Large-scale distributed attack pattern detected'}
                            {pattern === 'SINGLE_IP_SINGLE_SERVER' && 'Monitoring: Single source activity - may indicate focused attack or legitimate traffic'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IPPatternBadge;
