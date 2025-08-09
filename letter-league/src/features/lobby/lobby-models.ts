import { ConnectionStatus } from "../realtime/realtime-models";

export interface OnlineLobbyModel {
    id: string;
    userHostId: string;
    players: OnlineLobbyPlayerModel[];
    createdAt: Date;
}

export interface OnlineLobbyPlayerModel {    
    userId: string;
    isHost: boolean;
    username: string;
    connectionStatus: ConnectionStatus;    
}