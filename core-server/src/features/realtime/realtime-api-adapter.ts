"use server"

import { GuessWordResponse } from "../game/actions/command/guess-word-command";

interface TriggerRealtimeEvent<T> {
    room: string;
    event: string;
    data: T;
}

async function TriggerRealtimeEventOnSocketServer<T>(request: TriggerRealtimeEvent<T>): Promise<boolean> {
  const realtimeApiUrl = `${process.env.ACTIONS_SERVER_API_URL}/emit-to-room`;
  
  try {
    const headers = {
      'Content-Type': 'application/json',
      'api-key': process.env.ACTIONS_SERVER_API_KEY ?? ""
    };

    const response = await fetch(realtimeApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.log("Response error body:", errorBody);
    }
    
    return response.ok;
  } catch(err: any) {
    console.log("TriggerRealtimeEventOnSocketServer failed");
    console.log("Error name:", err?.name);
    console.log("Error message:", err?.message);
    console.log("Full error:", err);
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