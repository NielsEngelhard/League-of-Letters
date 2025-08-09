import { DbAuthSession, DbOnlineLobbyPlayer, DbOnlineLobbyWithPlayers } from "@/drizzle/schema"
import { ConnectionStatus } from "../realtime/realtime-models"
import { OnlineLobbyModel, OnlineLobbyPlayerModel } from "./lobby-models"

export class OnlineLobbyMapper {
    static AuthSessionToLobbyPlayer(authSession: DbAuthSession, lobbyId: string, connectionStatus: ConnectionStatus = "connected"): DbOnlineLobbyPlayer {
        return {
            id: undefined!,
            userId: authSession.id,
            lobbyId: lobbyId,
            connectionStatus: connectionStatus,
            username: authSession.username,
            createdAt: undefined!
        }
    }

    static DbLobbyToModel(lobby: DbOnlineLobbyWithPlayers): OnlineLobbyModel {
        return {
            id: lobby.id,
            players: lobby.players.map(p => this.DbLobbyPlayerToModel(p)),
            createdAt: lobby.createdAt,
            userHostId: lobby.userHostId
        }
    }

    static DbLobbyPlayerToModel(lobbyPlayer: DbOnlineLobbyPlayer): OnlineLobbyPlayerModel {
        return {
            userId: lobbyPlayer.userId,            
            username: lobbyPlayer.username,
            connectionStatus: lobbyPlayer.connectionStatus,
        }
    }
}
