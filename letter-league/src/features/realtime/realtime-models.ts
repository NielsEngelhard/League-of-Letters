export const connectionStatusses = ['empty', 'connecting', 'connected', 'disconnected', 'error'] as const;
export type ConnectionStatus = (typeof connectionStatusses)[number];

export interface JoinGameRealtimeModel {
    gameId: string;
    username: string;
    accountId: string;
    isHost?: boolean;
}

export interface LeaveGameRealtimeModel {
    gameId: string;
    username: string;
    accountId: string;
}