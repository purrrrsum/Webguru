import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobById, updateUser } from '@/lib/db';
import sql from '@/lib/db-client';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { jobId, revieweeId, rating, comment } = await request.json();

        if (!jobId || !revieweeId || rating === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        const job = await getJobById(jobId);
        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const reviewerId = session.user.id;

        // Verify the reviewer was part of this job
        if (job.userId !== reviewerId && job.agentId !== reviewerId) {
            return NextResponse.json({ error: 'You are not authorized to review this job' }, { status: 403 });
        }

        // Check if review already exists
        const existing = await sql`
      SELECT id FROM reviews 
      WHERE job_id = ${jobId} AND reviewer_id = ${reviewerId}
    `;

        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'You have already reviewed this job' }, { status: 400 });
        }

        // Insert Review
        const reviewId = nanoid();
        await sql`
      INSERT INTO reviews (id, job_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (${reviewId}, ${jobId}, ${reviewerId}, ${revieweeId}, ${rating}, ${comment || null})
    `;

        // Recalculate Averages
        const stats = await sql`
      SELECT ROUND(AVG(rating)::numeric, 2) as rating_avg, COUNT(id) as review_count
      FROM reviews
      WHERE reviewee_id = ${revieweeId}
    `;

        const newAvg = parseFloat(stats.rows[0].rating_avg || '0');
        const newCount = parseInt(stats.rows[0].review_count || '0', 10);

        // Update target user cache
        await updateUser(revieweeId, {
            ratingAvg: newAvg,
            reviewCount: newCount
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
