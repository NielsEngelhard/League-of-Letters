import { DbGamePlayer, DbGameRound, DbActiveGameWithRoundsAndPlayers, DbActiveGame } from "@/drizzle/schema";
import { ActiveGameModel, ActiveGameTeaserModel, GamePlayerModel, GameRoundModel } from "./game-models";

export class GameMapper {
    static ActiveGameToModel(game: DbActiveGameWithRoundsAndPlayers): ActiveGameModel {
        return {
            id: game.id,
            currentRoundIndex: game.currentRoundIndex,
            totalRounds: game.nRounds,
            nGuessesPerRound: game.nGuessesPerRound,
            gameMode: game.gameMode,
            createdAt: game.createdAt,
            gameIsOver: game.gameIsOver,
            hostAccountId: game.hostAccountId,
            nSecondsPerGuess: game.nSecondsPerGuess,
            rounds: game.rounds.map((round) => {
                return GameMapper.GameRoundToModel(round);
            }),
            players: game.players.map((player) => {
                return GameMapper.GamePlayerToModel(player, game.hostAccountId);
            }),
        }
    }

    static ActiveGameToTeaserModel(game: DbActiveGame): ActiveGameTeaserModel {
        return {
            id: game.id,
            currentRoundIndex: game.currentRoundIndex,
            totalRounds: game.nRounds,
            gameMode: game.gameMode,
            createdAt: game.createdAt,
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
            wordLength: round.wordLength,
            lastGuessUnixUtcTimestamp_InSeconds: round.lastGuessUnixUtcTimestamp_InSeconds ?? undefined,
            startingLetter: round.word.word[0]
        }
    }
}
