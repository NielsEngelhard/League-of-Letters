export type ConnectionStatus = 'empty' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface JoinGameRealtimeModel {
    gameId: string;
    username: string;
    userId: string;
    isHost?: boolean;
}

export interface LeaveGameRealtimeModel {
    gameId: string;
    username: string;
    userId: string;
}