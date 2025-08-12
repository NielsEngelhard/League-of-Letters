import { GuessWordResponse } from "../game/actions/command/guess-word-command";

interface TriggerRealtimeEvent {
    room: string;
    event: string;
    data: any;
}

async function TriggerRealtimeEventOnSocketServer(request: TriggerRealtimeEvent): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_BASE_ADDRESS}/emit-to-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    return response.ok;
  } catch (error) {
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