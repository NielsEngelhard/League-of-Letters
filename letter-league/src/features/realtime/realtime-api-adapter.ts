import { GuessWordResponse } from "../game/actions/command/guess-word-command";

interface TriggerRealtimeEvent<T> {
    room: string;
    event: string;
    data: T;
}

async function TriggerRealtimeEventOnSocketServer<T>(request: TriggerRealtimeEvent<T>): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_BASE_ADDRESS}/emit-to-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

export async function EmitStartGameRealtimeEvent(gameId: string) {
    return await TriggerRealtimeEventOnSocketServer({
        event: "start-game-transition",
        room: gameId,
        data: gameId
    });
}

export async function EmitDeleteGameRealtimeEvent(gameId: string) {
    return await TriggerRealtimeEventOnSocketServer({
        event: "delete-game",
        room: gameId,
        data: gameId
    });
}

export async function EmitGuessWordRealtimeEvent(gameId: string, guessWordResponse: GuessWordResponse) {
    return await TriggerRealtimeEventOnSocketServer({
        event: "guess-word",
        room: gameId,
        data: guessWordResponse
    });
}

export async function EmitPlayerKickedRealtimeEvent(gameId: string, accountId: string) {
    return await TriggerRealtimeEventOnSocketServer({
        event: "kick-player",
        room: gameId,
        data: { accountId: accountId, gameId: gameId}
    });
}