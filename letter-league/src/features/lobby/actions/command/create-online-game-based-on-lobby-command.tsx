"use server"

import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";

 interface Props {
    gameId: string;
 }

export default async function CreateOnlineGameBasedOnLobbyCommand(data: Props, secretKey: string): Promise<string> {
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");    
    
    // GET CURRENT LOBBY

    // CREATE GAME BASED ON CURRENT LOBBY

    // DELETE LOBBY

    // EMIT EVENT TO ALL PLAYERS THAT THE GAME CAN BE STARTED??

    return "";
}