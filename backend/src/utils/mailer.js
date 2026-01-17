import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendOTPEmail = async (to, otp) => {
  const fromEmail = process.env.BREVO_USER || 'alerts@cyber-resilience.com';

  try {
    const response = await axios.post(BREVO_API_URL, {
      sender: { name: "Cyber-Resilience", email: fromEmail },
      to: [{ email: to }],
      subject: "🔐 Your Verification Code",
      htmlContent: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>Verify your account</h2>
                    <p>Use the following code to complete your registration:</p>
                    <h1 style="color: #3b82f6; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ OTP Email sent via API:', response.data.messageId);
    return { success: true };
  } catch (err) {
    console.error('❌ Brevo API Error:', err.response?.data || err.message);
    return { success: false, error: err.message };
  }
};

export const sendResetPasswordEmail = async (to, token) => {
  const fromEmail = process.env.BREVO_USER || 'alerts@cyber-resilience.com';
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await axios.post(BREVO_API_URL, {
      sender: { name: "Cyber-Resilience", email: fromEmail },
      to: [{ email: to }],
      subject: "🔑 Reset Your Password",
      htmlContent: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>Reset your password</h2>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return { success: true };
  } catch (err) {
    console.error('❌ Reset Email failed:', err.response?.data || err.message);
    return { success: false, error: err.message };
  }
};

export const sendAlertEmail = async (to, alertData) => {
  const fromEmail = process.env.BREVO_USER || 'alerts@cyber-resilience.com';
  const { sector, severity, type, explanation } = alertData;

  try {
    await axios.post(BREVO_API_URL, {
      sender: { name: "Cyber-Resilience", email: fromEmail },
      to: [{ email: to }],
      subject: `🚨 [${severity}] Cyber Threat Alert - ${sector}`,
      textContent: `A ${severity} severity threat has been detected in the ${sector} sector.\n\nType: ${type}\nExplanation: ${explanation}`
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('❌ Alert Email failed:', err.response?.data || err.message);
  }
};
