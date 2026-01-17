import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const purpose = location.state?.purpose || 'REGISTER';

    useEffect(() => {
        if (!email) navigate('/register');
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await verifyOTP({ email, otp, purpose });
            if (purpose === 'REGISTER') {
                navigate('/login', { state: { message: 'Account verified! You can now login.' } });
            } else {
                navigate('/reset-password', { state: { email, otp } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="glass rounded-2xl p-8 shadow-2xl text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Verify Email</h1>
                    <p className="mt-2 text-gray-400 px-4">
                        We've sent a 6-digit code to <strong>{email}</strong>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger border border-danger/20 text-left">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <input
                            type="text"
                            maxLength="6"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full text-center text-3xl font-bold tracking-[1em] rounded-lg border border-gray-800 bg-black/50 py-4 text-white outline-none focus:border-primary/50 transition-all font-mono"
                            placeholder="000000"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary py-3 font-semibold text-white shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verifying...' : (
                                <>
                                    Verify Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-gray-500">
                        Didn't receive the code?{' '}
                        <button className="text-primary hover:underline" onClick={() => navigate(-1)}>Go Back</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
