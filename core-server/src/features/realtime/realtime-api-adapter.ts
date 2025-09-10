"use server"

import { GuessWordResponse } from "../game/actions/command/guess-word-command";

interface TriggerRealtimeEvent<T> {
    room: string;
    event: string;
    data: T;
}

async function TriggerRealtimeEventOnSocketServer<T>(request: TriggerRealtimeEvent<T>): Promise<boolean> {
  const realtimeApiUrl = `${process.env.ACTIONS_SERVER_API_URL}/emit-to-room`;
  
  console.log("realtimeApiUrl " + realtimeApiUrl);
  console.log("Request payload:", JSON.stringify(request, null, 2));
  
  try {
    const response = await fetch(realtimeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    console.log("Response status:", response.status);
    console.log("Response statusText:", response.statusText);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
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
    
    // Additional debugging for network errors
    if (err instanceof TypeError && err.message === 'fetch failed') {
      console.log("This is likely a network connectivity issue:");
      console.log("- Check if the server is running");
      console.log("- Verify the URL is correct:", realtimeApiUrl);
      console.log("- Check firewall/network restrictions");
      console.log("- Verify SSL/TLS configuration if using HTTPS");
    }
    
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