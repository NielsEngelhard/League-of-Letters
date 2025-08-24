import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';

// Healthcheck for the database
export async function GET(req: NextRequest) {
  try {
    await db.execute('SELECT 1');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Healthcheck endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
