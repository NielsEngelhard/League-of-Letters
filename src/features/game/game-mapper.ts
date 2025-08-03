import { DbActiveGamePlayer, DbActiveGameRound, DbActiveGameWithRoundsAndPlayers } from "@/drizzle/schema";
import { ActiveGameModel, ActiveGamePlayerModel, ActiveGameRoundModel } from "./game-models";

export class GameMapper {
    static ActiveGameToModel(game: DbActiveGameWithRoundsAndPlayers): ActiveGameModel {
        return {
            id: game.id,
            currentRoundIndex: game.currentRoundIndex,
            wordLength: game.wordLength,
            totalRounds: game.nRounds,
            nGuessesPerRound: game.nGuessesPerRound,
            gameMode: game.gameMode,
            createdAt: game.createdAt,
            rounds: game.rounds.map((round) => {
                return GameMapper.ActiveGameRoundToModel(round);
            }),
            players: game.players.map((player) => {
                return GameMapper.ActiveGamePlayerToModel(player);
            }),
        }
    }

    static ActiveGamePlayerToModel(player: DbActiveGamePlayer): ActiveGamePlayerModel {
        return {
            id: player.userId,
            score: player.score,
            username: player.username ?? "anonymous"
        }
    }

    static ActiveGameRoundToModel(round: DbActiveGameRound): ActiveGameRoundModel {
        return {
            id: round.id,
            roundNumber: round.roundNumber,
            currentGuessIndex: round.currentGuessIndex,            
            guesses: round.guesses,
            guessedLetters: round.evaluatedLetters
        }
    }        
}