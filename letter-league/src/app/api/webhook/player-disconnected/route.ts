// app/api/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';

export interface PlayerDisconnectedPayload {
  gameId: string;
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Do something with the webhook payload
    console.log('Received webhook:', body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
