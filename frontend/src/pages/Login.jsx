import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';

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
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="glass overflow-hidden rounded-2xl p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Cyber Resilience</h1>
                        <p className="mt-2 text-gray-400">Secure Infrastructure Platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger border border-danger/20">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-gray-800 bg-black/50 py-2.5 pl-10 pr-3 text-white placeholder-gray-600 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="admin@cyber.res"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-800 bg-black/50 py-2.5 pl-10 pr-3 text-white placeholder-gray-600 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-primary py-3 font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {isLoading ? 'Verifying...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col gap-2 text-center text-sm">
                        <Link to="/forgot-password" size="sm" className="text-gray-500 hover:text-primary transition-colors">
                            Forgot your password?
                        </Link>
                        <p className="text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:underline font-medium">Join Now</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
