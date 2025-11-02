import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP, sendOTPEmail } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp);

    return NextResponse.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error in OTP route:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

