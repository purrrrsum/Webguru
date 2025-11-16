import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFileToS3, createFileRecord } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobId = formData.get('jobId') as string;
    const originalFileId = formData.get('originalFileId') as string;

    if (!file || !jobId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload to S3
    const fileId = nanoid();
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFileToS3(fileId, buffer, file.type, file.name);

    // Create file record
    const fileRecord = await createFileRecord({
      id: fileId,
      jobId,
      url,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: session.user.id,
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({ file: fileRecord });
  } catch (error) {
    console.error('Error uploading annotated file:', error);
    return NextResponse.json({ error: 'Failed to upload annotated file' }, { status: 500 });
  }
}

