import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { generateOTP, sendOTPEmail } from '@/lib/otp';

export async function POST(request: NextRequest) {
    try {
        const { name, email, company, industry, preferredService } = await request.json();

        if (!email || !email.includes('@') || !name) {
            return NextResponse.json({ error: 'Name and valid email required' }, { status: 400 });
        }

        // 1. Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists. Please log in.' }, { status: 409 });
        }

        // 2. Generate a secure random password (e.g. 10 chars)
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let password = "";
        for (let i = 0, n = charset.length; i < 10; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }

        // 3. Create the profile in the database
        await createUser({
            name,
            email,
            company: company || '',
            industry: industry || '',
            preferredService: preferredService || '',
            address: '',
            phone: '',
            role: 'user',
            password, // Save generated password
            jobCount: 0
        });

        // 4. Send email to the user with their password
        // We reuse the OTP email structure but pass the password as the 'code' 
        // to simulate the email flow as requested or send a custom email if resend is configured.
        try {
            await sendOTPEmail(email, password);
        } catch (e) {
            console.warn('Email failed to send. Password was:', password);
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful! Check your email for login credentials.'
        });
    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
    }
}
