import { DbGamePlayer } from "@/drizzle/schema";
import { ConnectionStatus } from "@/features/realtime/realtime-models";
import {v4 as uuid} from 'uuid';

export class GamePlayerFactory {
    static createGamePlayer(gameId: string, accountId: string, position: number, connectionStatus: ConnectionStatus, username: string | null = null): DbGamePlayer {
        return {
            id: uuid(),
            gameId: gameId,
            accountId: accountId,
            position: position,
            score: 0,
            username: username,
            connectionStatus: connectionStatus
        }
    }
}