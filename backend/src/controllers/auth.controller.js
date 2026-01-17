import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import supabase from '../utils/supabaseClient.js';
import { sendOTPEmail, sendResetPasswordEmail } from '../utils/mailer.js';

export const register = async (req, res) => {
    const { email, password, role, name, sector } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 1. Check if user already exists
        const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
        if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

        // 2. Create unverified user in Supabase
        const { data: newUser, error: createError } = await supabase.from('users').insert([{
            email,
            password: hashedPassword,
            role,
            name,
            sector: role === 'SECTOR_OWNER' ? sector?.toUpperCase() : null,
            is_verified: false
        }]).select().single();

        if (createError) throw createError;

        // 3. Store OTP
        await supabase.from('otp_verifications').insert([{
            email,
            otp_code: otp,
            purpose: 'REGISTER',
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        }]);

        // 4. Send Email
        await sendOTPEmail(email, otp);

        res.status(201).json({ success: true, message: 'OTP sent to email. Please verify to complete registration.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp, purpose } = req.body;

    try {
        const { data: verification, error } = await supabase
            .from('otp_verifications')
            .select('*')
            .eq('email', email)
            .eq('otp_code', otp)
            .eq('purpose', purpose)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !verification) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        if (purpose === 'REGISTER') {
            await supabase.from('users').update({ is_verified: true }).eq('email', email);
        }

        // Single use OTP - delete after use
        await supabase.from('otp_verifications').delete().eq('id', verification.id);

        res.json({ success: true, message: 'Verification successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();

        if (error || !user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        if (!user.is_verified) return res.status(403).json({ success: false, message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name, sector: user.sector },
            process.env.JWT_SECRET || 'supersecret',
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, user: { id: user.id, email: user.email, role: user.role, name: user.name, sector: user.sector } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        await supabase.from('otp_verifications').insert([{
            email,
            otp_code: hashedToken,
            purpose: 'FORGOT_PASSWORD',
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        }]);

        await sendResetPasswordEmail(email, resetToken);

        res.json({ success: true, message: 'Password reset link sent to email' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const { data: verification } = await supabase
            .from('otp_verifications')
            .select('*')
            .eq('otp_code', hashedToken)
            .eq('purpose', 'FORGOT_PASSWORD')
            .gt('expires_at', new Date().toISOString())
            .single();

        if (!verification) return res.status(400).json({ success: false, message: 'Invalid or expired reset link' });

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await supabase.from('users').update({ password: newHashedPassword }).eq('email', verification.email);
        await supabase.from('otp_verifications').delete().eq('id', verification.id);

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = (req, res) => {
    res.json({ success: true, user: req.user });
};
