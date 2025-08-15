import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';
import { hasValidApikey } from '../webhook-utils';
import UpdateOnlineLobbyPlayerConnectionStatus from '@/features/lobby/actions/command/update-online-lobby-player-connectionstatus';
import { ConnectionStatus } from '@/features/realtime/realtime-models';
import UpdateActiveGamePlayerConnectionStatus from '@/features/game/actions/command/update-active-game-player-connectionstatus';

export interface UpdatePlayerConnectionStatusPayload {
  gameId: string;
  userId: string;
  connectionStatus: ConnectionStatus;
}

export async function POST(req: NextRequest) {
  if (!hasValidApikey(req)) {
    return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
  }

  try {
    const body: UpdatePlayerConnectionStatusPayload = await req.json();

    await db.transaction(async (tx) => {
      await UpdateOnlineLobbyPlayerConnectionStatus({
        lobbyId: body.gameId,
        userId: body.userId,
        connectionStatus: body.connectionStatus
      }, tx);

      await UpdateActiveGamePlayerConnectionStatus({
        gameId: body.gameId,
        userId: body.userId,
        connectionStatus: body.connectionStatus
      }, tx);      
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook "UpdatePlayerConnectionStatus":', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
