import { GamePlayerModel } from "../game/game-models";

export interface OnlineLobbyModel {
    id: string;
    hostAccountId: string;
    players: GamePlayerModel[];
    createdAt: Date;
}