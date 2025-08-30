"use server"

import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
import { db } from "@/drizzle/db";
import { getCurrentUserOrRedirect } from "@/features/auth/current-user";
import DeleteGameByIdCommand from "@/features/game/actions/command/delete-game-by-id-command";
import { redirect } from "next/navigation";
import CreateOnlineLobbyCommand from "./create-online-lobby-command";
import { OnlineLobbyModel } from "../../lobby-models";

// When the active game has ended, play again with everyone who still is connected - take them to new lobby with same gameid
export default async function CreateNewLobbyBasedOnEndedGame(gameId: string): Promise<string> {
    const account = await getCurrentUserOrRedirect();
    const endedGameExists = await endedGameExist(gameId, account.accountId);
    if (!endedGameExists) return redirect(LANGUAGE_ROUTE(account.language, MULTIPLAYER_GAME_ROUTE));

    const newLobby = await createLobbyAndDeleteOldEndedGame(gameId);

    return newLobby.id;
}

async function createLobbyAndDeleteOldEndedGame(gameId: string): Promise<OnlineLobbyModel> {
    await DeleteGameByIdCommand(gameId);
    const result = await CreateOnlineLobbyCommand(gameId);     

    if (result.ok == false || !result.data) throw Error(`ERROR creating new lobby ${result.errorMsg}`);

    return result.data;
}

async function endedGameExist(gameId: string, hostAccountId: string) {
    const game = await db.query.ActiveGameTable.findFirst({
        where: (game, { eq, and }) =>
            and(
            eq(game.id, gameId),
            eq(game.hostAccountId, hostAccountId),
            eq(game.gameIsOver, true)
            ),
            columns: { id: true },
        });

    return game != null && game != undefined;
}