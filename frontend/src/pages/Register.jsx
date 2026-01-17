import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, Briefcase, AlertCircle, ChevronDown, Cpu, Network, Database } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'ANALYST', sector: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const isSectorOwner = formData.role === 'SECTOR_OWNER';
    const canSubmit = !isSectorOwner || (isSectorOwner && formData.sector);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) {
            setError('Operational Error: Sector assignment required for Sector Owner clearance');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await register(formData);
            navigate('/verify-otp', { state: { email: formData.email, purpose: 'REGISTER' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Access Denied: Infrastructure Deployment Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#020204] px-4 py-16 cyber-grid relative overflow-hidden">
            <div className="cyber-scanline pointer-events-none" />

            <div className="w-full max-w-lg z-10 animate-in fade-in zoom-in duration-700">
                <div className="glass overflow-hidden rounded-3xl border border-[#00f3ff]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#39ff14]/50 to-transparent" />

                    <div className="p-10">
                        <div className="mb-10 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                                <Network size={36} className="animate-pulse" />
                            </div>
                            <h1 className="text-3xl font-black tracking-[0.15em] text-white neon-text-green uppercase">Personnel Registry</h1>
                            <p className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Initialize Operational Identity</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-3 rounded-xl bg-[#ff003c]/10 p-4 text-xs font-bold text-[#ff003c] border border-[#ff003c]/20 animate-glitch">
                                    <AlertCircle size={18} />
                                    <span className="uppercase tracking-widest">{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Callsign (Name)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#39ff14]/40 group-focus-within:text-[#39ff14] transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full rounded-xl border border-white/5 bg-black/60 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-700 outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all font-medium"
                                            placeholder="Agent Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Terminal Address (Email)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#39ff14]/40 group-focus-within:text-[#39ff14] transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full rounded-xl border border-white/5 bg-black/60 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-700 outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all font-medium"
                                            placeholder="agent@sector.crip"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Access Key (Password)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#39ff14]/40 group-focus-within:text-[#39ff14] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full rounded-xl border border-white/5 bg-black/60 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-700 outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Sector Role</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#39ff14]/40 group-focus-within:text-[#39ff14] transition-colors z-10 pointer-events-none">
                                            <Briefcase size={18} />
                                        </div>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value, sector: e.target.value !== 'SECTOR_OWNER' ? '' : formData.sector })}
                                            className="w-full rounded-xl border border-white/5 bg-black/60 py-4 pl-12 pr-10 text-sm text-white outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all appearance-none cursor-pointer font-medium"
                                        >
                                            <option value="ANALYST">Analyst</option>
                                            <option value="ADMIN">Administrator</option>
                                            <option value="SECTOR_OWNER">Sector Authority</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 pointer-events-none transition-colors">
                                            <ChevronDown size={18} />
                                        </div>
                                    </div>
                                </div>

                                {isSectorOwner && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <label className="text-[10px] font-black text-[#39ff14] uppercase tracking-[0.2em] ml-1">Domain Assignment</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#39ff14] z-10 pointer-events-none">
                                                <Shield size={18} />
                                            </div>
                                            <select
                                                required
                                                value={formData.sector}
                                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                                className="w-full rounded-xl border border-[#39ff14]/30 bg-[#39ff14]/5 py-4 pl-12 pr-10 text-sm text-white outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/20 transition-all appearance-none cursor-pointer font-medium"
                                            >
                                                <option value="">Select Domain</option>
                                                <option value="HEALTHCARE" className="bg-black">Healthcare Grid</option>
                                                <option value="AGRICULTURE" className="bg-black">Agricultural Network</option>
                                                <option value="URBAN" className="bg-black">Urban Infrastructure</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#39ff14] pointer-events-none">
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !canSubmit}
                                className="w-full rounded-xl bg-[#39ff14] py-4 text-sm font-black text-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6 group relative overflow-hidden"
                            >
                                <span className="relative z-10">{loading ? 'Synthesizing Clearance...' : 'Deploy Credentials'}</span>
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </form>

                        <div className="mt-10 flex flex-col gap-4 text-center">
                            <Link to="/login" className="text-[10px] font-black text-[#39ff14] hover:text-white uppercase tracking-[0.2em] transition-colors">
                                Key Already Active? Secure Access
                            </Link>
                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em]">
                                All deployments are cryptographically logged
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
