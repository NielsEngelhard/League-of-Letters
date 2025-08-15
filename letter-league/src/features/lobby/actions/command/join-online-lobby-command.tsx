"use server"

import { db } from "@/drizzle/db";
import { DbOnlineLobby, DbOnlineLobbyPlayer, OnlineLobbyPlayerTable } from "@/drizzle/schema";
import { MAX_ONLINE_GAME_PLAYERS } from "../../../game/game-constants";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { JoinOnlineLobbySchema } from "@/features/lobby/lobby-schemas";
import { OnlineLobbyModel } from "@/features/lobby/lobby-models";
import { OnlineLobbyMapper } from "@/features/lobby/lobby-mapper";
import GetOnlineLobbyAndPlayersByIdRequest from "../query/get-lobby-and-players-by-id-command";
import ReconnectOnlineLobbyPlayer from "./reconnect-online-lobby-player";
import { CurrentUserData, getCurrentUserOrCrash } from "@/features/auth/current-user";

export default async function JoinGameLobbyCommand(command: JoinOnlineLobbySchema): Promise<ServerResponse<OnlineLobbyModel | null>> {
    const currentUser = await getCurrentUserOrCrash();
    
    const lobby = await GetOnlineLobbyAndPlayersByIdRequest(command.gameId);
    if (!lobby) {
        return ServerResponseFactory.error(`Lobby with '${command.gameId}' does not exist`);
    }
    
    if (lobby.players.some(p => p.userId == currentUser.accountId)) {
        await ReconnectOnlineLobbyPlayer({
            lobbyId: lobby.id,
            userId: currentUser.accountId
        });
    } else {
        if (lobby.players.length >= MAX_ONLINE_GAME_PLAYERS) {
            return ServerResponseFactory.error(`Game is full`);
        }

        const newPlayer = await CreateNewPlayer(lobby, currentUser);
        lobby.players.push(newPlayer);
    }

    const lobbyModel = OnlineLobbyMapper.DbLobbyToModel(lobby);

    return ServerResponseFactory.success(lobbyModel);
}

async function CreateNewPlayer(lobby: DbOnlineLobby, currentUser: CurrentUserData): Promise<DbOnlineLobbyPlayer> {
    const player: DbOnlineLobbyPlayer = OnlineLobbyMapper.CurrentUserToLobbyPlayer(currentUser, lobby.id);

    await db.insert(OnlineLobbyPlayerTable)
        .values(player);
        
    return player;
;
}
