import { DbActiveGamePlayer } from "@/drizzle/schema";
import {v4 as uuid} from 'uuid';

export class GamePlayerFactory {
    static createGamePlayer(gameId: string, userId: string, username: string | null = null): DbActiveGamePlayer {
        return {
            id: uuid(),
            gameId: gameId,
            userId: userId,
            score: 0,
            username: username            
        }
    }
}