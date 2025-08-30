"use server"

import { JOINED_GAME_ROUTE, LANGUAGE_ROUTE } from "@/app/routes";
import AuthenticationRequiredBlock from "@/components/layout/AuthenticationRequiredBlock";
import { getAuthenticatedUser_Server } from "@/features/auth/utils/auth-server-utils"
import { DefaultLanguage } from "@/features/i18n/languages";
import { redirect } from "next/navigation";

export default async function JoinGamePage({params}: {params: Promise<{gameId: string }>}) {
    const { gameId } = await params;

    const authenticatedUser = await getAuthenticatedUser_Server();

    if (authenticatedUser != undefined && authenticatedUser != null) {
        redirect(LANGUAGE_ROUTE(authenticatedUser.language, JOINED_GAME_ROUTE(gameId)));
    }
    
    return <AuthenticationRequiredBlock lang={DefaultLanguage} />
}