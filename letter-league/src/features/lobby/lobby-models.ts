import { GamePlayerModel } from "../game/game-models";

export interface OnlineLobbyModel {
    id: string;
    userHostId: string;
    players: GamePlayerModel[];
    createdAt: Date;
}