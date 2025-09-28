import { ActiveGameModel, GameRoundModel } from "./game-models";

export function GetCurrentRound(game: ActiveGameModel): GameRoundModel | null {
    return game.rounds.find(r => r.roundNumber == game.currentRoundIndex) ?? null;
}

export function GetCurrentRoundIndexInArray(game: ActiveGameModel): number {
    return game.rounds.findIndex(r => r.roundNumber == game.currentRoundIndex) ?? null;
}
