import { Resend } from 'resend';

// Lazy initialize Resend to avoid build-time errors
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is required');
  }
  return new Resend(apiKey);
}

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, otp: string): void {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email, { otp, expiresAt });
}

export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore.get(email);
  if (!stored || stored.expiresAt < Date.now()) {
    return false;
  }
  const isValid = stored.otp === otp;
  if (isValid) {
    otpStore.delete(email);
  }
  return isValid;
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'noreply@thesupport.in',
      to: email,
      subject: 'Your OTP for thesupport.in',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background: #25D366; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">thesupport.in</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p style="color: #666; font-size: 16px;">Your one-time password is:</p>
            <div style="background: white; border: 2px dashed #25D366; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #25D366; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}

