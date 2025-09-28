import { NextRequest, NextResponse } from 'next/server';
import { hasValidApikey } from '../webhook-utils';
import SkipTurn from '@/features/game/actions/command/skip-turn';

interface TimerEndedPayload {
  gameId: string;
}

// Timer ended
export async function POST(req: NextRequest) {
  if (!hasValidApikey(req)) {
    return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
  }

  const body: TimerEndedPayload = await req.json();

  try {
    await SkipTurn(body.gameId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook "timer-ended":', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
