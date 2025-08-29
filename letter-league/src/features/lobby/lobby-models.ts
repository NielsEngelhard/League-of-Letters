import { GamePlayerModel } from "../game/game-models";
import { SupportedLanguage } from "../i18n/languages";

export interface OnlineLobbyModel {
    id: string;
    hostAccountId: string;
    players: GamePlayerModel[];
    createdAt: Date;
    language: SupportedLanguage;
}