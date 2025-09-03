import { DbOnlineLobbyPlayer, DbOnlineLobbyWithPlayers } from "@/drizzle/schema"
import { ConnectionStatus } from "../realtime/realtime-models"
import { OnlineLobbyModel } from "./lobby-models"
import { GamePlayerModel } from "../game/game-models"
import { CurrentUserData } from "../auth/current-user"

export class OnlineLobbyMapper {
    static CurrentUserToLobbyPlayer(currentUser: CurrentUserData, lobbyId: string, connectionStatus: ConnectionStatus = "connected"): DbOnlineLobbyPlayer {
        return {
            id: undefined!,
            accountId: currentUser.accountId,
            lobbyId: lobbyId,
            connectionStatus: connectionStatus,
            username: currentUser.username,
            createdAt: undefined!
        }
    }

    static DbLobbyToModel(lobby: DbOnlineLobbyWithPlayers): OnlineLobbyModel {
        return {
            id: lobby.id,
            players: lobby.players.map(p => this.DbLobbyPlayerToModel(p)),
            createdAt: lobby.createdAt,
            hostAccountId: lobby.hostAccountId,
            language: lobby.language
        }
    }

    static DbLobbyPlayerToModel(lobbyPlayer: DbOnlineLobbyPlayer): GamePlayerModel {
        return {
            accountId: lobbyPlayer.accountId,            
            username: lobbyPlayer.username,
            connectionStatus: lobbyPlayer.connectionStatus,
            isHost: false,
            position: 0,
            score: 0
        }
    }
}
