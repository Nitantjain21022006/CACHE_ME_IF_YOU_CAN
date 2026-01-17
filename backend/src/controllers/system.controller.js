import os from 'os';
import redisClient from '../utils/redisClient.js';

export const getSystemMetrics = async (req, res) => {
    try {
        // CPU Usage (Approximate using load avg)
        const loadAvg = os.loadavg();
        const cpuUsage = Math.min(Math.round((loadAvg[0] / os.cpus().length) * 100), 100);

        // Memory usage
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsagePercent = Math.round((usedMem / totalMem) * 100);

        // Network/Request metrics from Redis
        // We'll track total requests in the last hour
        const hour = new Date().getHours();
        const requestCount = await redisClient.get(`metrics:requests:${hour}`) || 0;

        // Current status data
        const metrics = {
            cpu: {
                current: cpuUsage,
                label: `${cpuUsage}%`
            },
            memory: {
                used: (usedMem / (1024 ** 3)).toFixed(1),
                total: (totalMem / (1024 ** 3)).toFixed(0),
                label: `${(usedMem / (1024 ** 3)).toFixed(1)}GB / ${(totalMem / (1024 ** 3)).toFixed(0)}GB`
            },
            network: {
                requests: requestCount,
                label: `${requestCount} Req/hr`
            }
        };

        // History (Simulated based on current values for the chart)
        // In a real app, you'd store this in Redis/Supabase every minute
        const history = [
            { name: '12:00', cpu: 45, mem: 60, network: 12 },
            { name: '13:00', cpu: 52, mem: 62, network: 15 },
            { name: '14:00', cpu: 48, mem: 61, network: 11 },
            { name: '15:00', cpu: cpuUsage > 70 ? cpuUsage - 5 : 70, mem: 75, network: 45 },
            { name: '16:00', cpu: cpuUsage, mem: memUsagePercent, network: Math.round(requestCount / 10) },
        ];

        res.json({ metrics, history });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metrics', error: error.message });
    }
};
