import { NextResponse } from 'next/server';

// Healthcheck for the 'core api'
export async function GET() {
  try {
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Healthcheck endpoint error":', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
