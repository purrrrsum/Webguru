import { NextResponse } from 'next/server';
import { getAvailableAgents } from '@/lib/db';

export async function GET() {
  try {
    const availableAgents = await getAvailableAgents();
    return NextResponse.json({ 
      count: availableAgents.length,
      agents: availableAgents.map(a => ({ id: a.id, name: a.name }))
    });
  } catch (error) {
    console.error('Error fetching available agents count:', error);
    return NextResponse.json({ count: 0, agents: [] });
  }
}

