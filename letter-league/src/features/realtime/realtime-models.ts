export type ConnectionStatus = 'empty' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface JoinGameRealtimeModel {
    gameId: string;
    username: string;
    userId: string;
}

export interface LeaveGameRealtimeModel {
    gameId: string;
    username: string;
    userId: string;
}

export interface RealtimeConnectedPlayer {
    userId: string;
    username: string;
    connectionStatus: ConnectionStatus;
}