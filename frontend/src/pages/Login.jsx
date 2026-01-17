import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, Terminal, Key } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Access Denied: Invalid Authentication Tokens');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#020204] px-4 cyber-grid relative overflow-hidden">
            <div className="cyber-scanline pointer-events-none" />

            <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
                <div className="glass overflow-hidden rounded-3xl border border-[#00f3ff]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                    {/* Header Detail */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#00f3ff]/50 to-transparent" />

                    <div className="p-10">
                        <div className="mb-10 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#00f3ff]/10 text-[#00f3ff] border border-[#00f3ff]/20 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                                <Terminal size={36} className="animate-pulse" />
                            </div>
                            <h1 className="text-3xl font-black tracking-[0.15em] text-white neon-text-blue uppercase">Access Portal</h1>
                            <p className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Identity Verification Required</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 rounded-xl bg-[#ff003c]/10 p-4 text-xs font-bold text-[#ff003c] border border-[#ff003c]/20 animate-glitch">
                                    <AlertCircle size={18} />
                                    <span className="uppercase tracking-widest">{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Secure Identity (Email)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#00f3ff]/40 group-focus-within:text-[#00f3ff] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-xl border border-white/5 bg-black/60 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-700 outline-none focus:border-[#00f3ff]/50 focus:ring-1 focus:ring-[#00f3ff]/20 transition-all font-medium"
                                        placeholder="user@sector.crip"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Access Key (Password)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#00f3ff]/40 group-focus-within:text-[#00f3ff] transition-colors">
                                        <Key size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-white/5 bg-black/60 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-700 outline-none focus:border-[#00f3ff]/50 focus:ring-1 focus:ring-[#00f3ff]/20 transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-xl bg-[#00f3ff] py-4 text-sm font-black text-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_40px_rgba(0,243,255,0.5)] transition-all active:scale-[0.98] disabled:opacity-70 group relative overflow-hidden"
                            >
                                <span className="relative z-10">{isLoading ? 'Verifying Tokens...' : 'Initialize Session'}</span>
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </form>

                        <div className="mt-10 flex flex-col gap-4 text-center">
                            <Link to="/register" className="text-[10px] font-black text-[#00f3ff] hover:text-white uppercase tracking-[0.2em] transition-colors">
                                No Clearance? Request Credentials
                            </Link>
                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em]">
                                Unauthorized access is strictly monitored
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
