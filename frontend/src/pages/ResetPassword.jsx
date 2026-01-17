import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setError('');
        try {
            await resetPassword({ token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <RefreshCw size={32} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Set New Password</h1>
                        <p className="mt-2 text-gray-400">Secure your account with a new password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger border border-danger/20">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent border border-accent/20">
                                <CheckCircle size={18} />
                                <span>Password reset successfully! Redirecting to login...</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    disabled={success || !token}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-800 bg-black/50 py-2.5 pl-10 pr-3 text-white outline-none focus:border-primary/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    disabled={success || !token}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-800 bg-black/50 py-2.5 pl-10 pr-3 text-white outline-none focus:border-primary/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success || !token}
                            className="w-full rounded-lg bg-primary py-3 font-semibold text-white shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? 'Updating...' : 'Reset Password'}
                        </button>
                    </form>

                    {!success && (
                        <div className="mt-8 text-center text-sm">
                            <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors">
                                <ArrowLeft size={16} /> Back to Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
