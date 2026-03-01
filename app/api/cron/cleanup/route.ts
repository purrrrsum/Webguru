import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db-client';
import { deleteFile } from '@/lib/file-storage';

export const maxDuration = 300; // Allows cron to run longer if there are many files

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Delete messages older than 48 hours
        const deletedMessages = await sql`
      DELETE FROM messages
      WHERE created_at < NOW() - INTERVAL '48 hours'
      RETURNING id
    `;

        // 2. Fetch files older than 48 hours for physical deletion
        const oldFiles = await sql`
      SELECT id, url
      FROM files
      WHERE uploaded_at < NOW() - INTERVAL '48 hours'
    `;

        let deletedFilesCount = 0;

        // Delete physically from storage one by one
        for (const file of oldFiles.rows) {
            if (file.url) {
                try {
                    await deleteFile(file.url);
                    deletedFilesCount++;
                } catch (e) {
                    console.error(`Failed to physically delete file ${file.url}:`, e);
                }
            }
        }

        // 3. Delete file records from database
        if (oldFiles.rows.length > 0) {
            await sql`
        DELETE FROM files
        WHERE uploaded_at < NOW() - INTERVAL '48 hours'
      `;
        }

        // 4. Process Pending Escrows > 24 Hours
        const processedEscrows = await sql`
      UPDATE escrow_holds 
      SET status = 'released', released_at = NOW() 
      WHERE status = 'held' AND created_at < NOW() - INTERVAL '24 hours' 
      RETURNING id
    `;

        return NextResponse.json({
            success: true,
            cleanedUp: {
                messagesDeleted: deletedMessages.rows.length,
                filesDeleted: deletedFilesCount,
                escrowsReleased: processedEscrows.rows.length
            }
        });

    } catch (error) {
        console.error('Error in cleanup cron:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
