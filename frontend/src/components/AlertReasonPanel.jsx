import React from 'react';
import { AlertCircle } from 'lucide-react';

const AlertReasonPanel = ({ alert }) => {
    // Extract reasons from ML response or explanation
    const mlResponse = alert.metadata?.ml_response || {};
    const explanation = alert.explanation || '';
    
    // Parse reasons - could be from ml_response.reason (array) or explanation (string)
    let reasons = [];
    
    if (mlResponse.reason && Array.isArray(mlResponse.reason)) {
        reasons = mlResponse.reason;
    } else if (mlResponse.reason && typeof mlResponse.reason === 'string') {
        reasons = [mlResponse.reason];
    } else if (explanation) {
        // Parse explanation string for common reason patterns
        const reasonPatterns = [
            /High event rate/i,
            /Multiple IPs/i,
            /Data integrity/i,
            /CPU usage/i,
            /Memory usage/i,
            /Packet size/i,
            /Latency/i,
            /Anomalous/i,
            /Suspicious/i
        ];
        
        reasons = reasonPatterns
            .filter(pattern => pattern.test(explanation))
            .map(pattern => {
                const match = explanation.match(new RegExp(pattern.source, 'i'));
                return match ? match[0] : null;
            })
            .filter(Boolean);
        
        // If no patterns found, use full explanation
        if (reasons.length === 0) {
            reasons = [explanation];
        }
    }
    
    // Fallback to default if no reasons found
    if (reasons.length === 0) {
        reasons = ['Anomaly detected by ML system'];
    }
    
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <AlertCircle size={12} />
                Detection Reasons
            </div>
            <div className="space-y-1.5">
                {reasons.map((reason, index) => (
                    <div 
                        key={index}
                        className="flex items-start gap-2 text-[10px] text-gray-400 bg-black/30 rounded-lg px-3 py-2 border border-white/5"
                    >
                        <div className="h-1 w-1 rounded-full bg-[#00f3ff] mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">{reason}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertReasonPanel;
