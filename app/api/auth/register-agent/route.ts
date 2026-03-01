import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { sendOTPEmail } from '@/lib/otp';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, specialization, experience, tools, portfolioUrl, certifications } = await request.json();

        if (!email || !email.includes('@') || !name || !specialization) {
            return NextResponse.json({ error: 'Name, email, and specialization are required' }, { status: 400 });
        }

        if (!phone || !/^\+\d{1,3}\d{6,14}$/.test(phone)) {
            return NextResponse.json({ error: 'Phone number is required and must include a valid country code (e.g., +1 for US, +91 for India)' }, { status: 400 });
        }

        // 1. Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists. Please log in.' }, { status: 409 });
        }

        // 2. Generate a secure random password
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let password = "";
        for (let i = 0, n = charset.length; i < 12; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }

        // 3. Create the profile in the database
        // We append the portfolio and skills into the address/company field as a generic way to store them 
        // unless explicit columns were added for agents. Let's combine them into an internal JSON string 
        // or just rely on 'industry' replacing specialization, and 'website' replacing portfolioUrl.
        await createUser({
            name,
            email,
            phone: phone || '',
            company: '', // Agents don't strictly have a company
            address: `Experience: ${experience} | Tools: ${tools} | Certifications: ${certifications}`,
            industry: specialization,
            website: portfolioUrl,
            preferredService: specialization,
            role: 'agent',
            password, // Save generated password
            jobCount: 0
        });

        // 4. Send email to the agent with their password
        try {
            await sendOTPEmail(email, password);
        } catch (e) {
            console.warn('Email failed to send. Password was:', password);
        }

        return NextResponse.json({
            success: true,
            message: 'Agent Application Registration successful! Check your email.'
        });
    } catch (error: any) {
        console.error('Agent Registration Error:', error);
        return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
    }
}
