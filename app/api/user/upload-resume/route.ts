import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveFile } from '@/lib/file-storage';
import { updateUser } from '@/lib/db';

export async function POST(request: NextRequest) {
    let savedFileUrl: string | null = null;

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
        }

        const maxSize = 5 * 1024 * 1024; // 5MB limit for resumes
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
        }

        try {
            savedFileUrl = await saveFile(file, `resume_${session.user.id}_${Date.now()}.pdf`);
        } catch (fileError: any) {
            console.error('Error saving resume to disk:', fileError);
            return NextResponse.json({
                error: 'Failed to save resume',
                details: fileError.message
            }, { status: 500 });
        }

        const host = request.headers.get('host');
        const protocol = request.headers.get('x-forwarded-proto') || 'https';
        const baseUrl = process.env.NEXTAUTH_URL
            || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null)
            || process.env.NEXT_PUBLIC_BASE_URL
            || (process.env.NODE_ENV === 'production' ? 'https://www.thesupport.agency' : null)
            || (host ? `${protocol}://${host}` : null);

        if (!baseUrl) {
            return NextResponse.json({
                error: 'Base URL not configured',
            }, { status: 500 });
        }

        const fullUrl = `${baseUrl}${savedFileUrl}`;

        // Update the user's resume_pdf_url directly
        await updateUser(session.user.id, { resumePdfUrl: fullUrl });

        return NextResponse.json({ success: true, url: fullUrl });
    } catch (error: any) {
        console.error('Unexpected error uploading resume:', error);
        if (savedFileUrl) {
            try {
                const { deleteFile } = await import('@/lib/file-storage');
                await deleteFile(savedFileUrl);
            } catch (cleanupError) {
                console.error('Failed to cleanup file:', cleanupError);
            }
        }
        return NextResponse.json({
            error: 'Failed to upload resume',
            details: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
