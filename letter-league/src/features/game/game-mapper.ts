import { DbGamePlayer, DbGameRound, DbActiveGameWithRoundsAndPlayers, DbOnlineLobbyPlayer, DbAuthSession } from "@/drizzle/schema";
import { ActiveGameModel, GamePlayerModel, GameRoundModel, JoinGameLobbyResponse } from "./game-models";
import { ConnectionStatus } from "../realtime/realtime-models";

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
                return GameMapper.GameRoundToModel(round);
            }),
            players: game.players.map((player) => {
                return GameMapper.GamePlayerToModel(player);
            }),
        }
    }

    static GamePlayerToModel(player: DbGamePlayer): GamePlayerModel {
        return {
            id: player.userId,
            score: player.score,
            username: player.username ?? "anonymous",
            connectionStatus: "connected",
            isHost: false
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

    static AuthSessionToLobbyPlayer(authSession: DbAuthSession, connectionStatus: ConnectionStatus = "connected"): DbOnlineLobbyPlayer {
        return {
            id: authSession.id,
            connectionStatus: connectionStatus,
            username: authSession.username
        }
    }

    static DbOnlineLobbyPlayerToModel(player: DbOnlineLobbyPlayer): GamePlayerModel {
        return {
            id: player.id,
            username: player.username,
            connectionStatus: player.connectionStatus,
            score: 0,
            isHost: false
        }
    }
}

export class JoinGameResponseFactory {
    static success(gameId: string, players: GamePlayerModel[]): JoinGameLobbyResponse {
        return {
            ok: true,
            players: players,
            errorMsg: undefined,
            gameId: gameId    
        };
    }

    static error(errorMsg?: string): JoinGameLobbyResponse {
        if (!errorMsg) errorMsg = "Could not join game";
        
        return {
            ok: false,
            errorMsg: errorMsg,
            players: [],
            gameId: "?"
        };
    }
}