// app/api/webhook/route.ts

import { db } from '@/drizzle/db';
import ActiveGamePlayerDisconnectedCommand from '@/features/game/actions/command/active-game-player-disconnected-command';
import DisconnectOnlineLobbyPlayer from '@/features/lobby/actions/command/disconnect-online-lobby-player';
import { NextRequest, NextResponse } from 'next/server';
import { hasValidApikey } from '../webhook-utils';

// TODO: REWRITE DO JUST NORMAL ENDPOINT WITH UPDATE CONNECTION STATUS
export interface PlayerDisconnectedPayload {
  gameId: string;
  userId: string;
}

export async function POST(req: NextRequest) {
  if (!hasValidApikey(req)) throw Error("UnAuthorized");

  try {
    const body: PlayerDisconnectedPayload = await req.json();

    await db.transaction(async (tx) => {
      await DisconnectOnlineLobbyPlayer({
        lobbyId: body.gameId,
        userId: body.userId
      }, tx);

      await ActiveGamePlayerDisconnectedCommand({
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
