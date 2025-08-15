import { DbGamePlayer, DbGameRound, DbActiveGameWithRoundsAndPlayers } from "@/drizzle/schema";
import { ActiveGameModel, GamePlayerModel, GameRoundModel } from "./game-models";

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
            gameIsOver: game.gameIsOver,
            hostAccountId: game.hostAccountId,
            rounds: game.rounds.map((round) => {
                return GameMapper.GameRoundToModel(round);
            }),
            players: game.players.map((player) => {
                return GameMapper.GamePlayerToModel(player, game.hostAccountId);
            }),
        }
    }

    static GamePlayerToModel(player: DbGamePlayer, hostUserId?: string): GamePlayerModel {
        return {
            accountId: player.accountId,
            score: player.score,
            username: player.username ?? "anonymous",            
            isHost: player.accountId == hostUserId,
            position: player.position,
            connectionStatus: player.connectionStatus,
        }
    }

    static GameRoundToModel(round: DbGameRound): GameRoundModel {
        return {
            id: round.id,
            roundNumber: round.roundNumber,
            currentGuessIndex: round.currentGuessIndex,            
            guesses: round.guesses,
            guessedLetters: round.evaluatedLetters
        }
    }
}
