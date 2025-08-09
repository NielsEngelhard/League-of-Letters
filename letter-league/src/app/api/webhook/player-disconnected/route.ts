// app/api/webhook/route.ts

import { db } from '@/drizzle/db';
import PlayerDisconnectedCommand from '@/features/game/actions/command/active-game-player-disconnected-command';
import DisconnectOnlineLobbyPlayer from '@/features/lobby/actions/command/disconnect-online-lobby-player';
import { NextRequest, NextResponse } from 'next/server';

export interface PlayerDisconnectedPayload {
  gameId: string;
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await db.transaction(async (tx) => {
      await DisconnectOnlineLobbyPlayer({
        lobbyId: body.gameId,
        userId: body.userId
      }, tx);

      await PlayerDisconnectedCommand({
        gameId: body.gameId,
        userId: body.userId
      }, tx);      
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook "PlayerDisconnected":', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
