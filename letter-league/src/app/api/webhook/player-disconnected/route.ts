// app/api/webhook/route.ts

import PlayerDisconnectedCommand from '@/features/game/actions/command/player-disconnected-command';
import { NextRequest, NextResponse } from 'next/server';

export interface PlayerDisconnectedPayload {
  gameId: string;
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await PlayerDisconnectedCommand({
      gameId: body.gameId,
      userId: body.userId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook "PlayerDisconnected":', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
