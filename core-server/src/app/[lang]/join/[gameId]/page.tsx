"use server"

import { JOINED_GAME_ROUTE, LANGUAGE_ROUTE } from "@/app/routes";
import AuthenticationRequiredBlock from "@/components/layout/AuthenticationRequiredBlock";
import { GetCurrentUser_Server } from "@/features/auth/current-user";
import { DefaultLanguage } from "@/features/i18n/languages";
import { redirect } from "next/navigation";

export default async function JoinGamePage({params}: {params: Promise<{gameId: string }>}) {
    const { gameId } = await params;

    const authenticatedUser = await GetCurrentUser_Server();

    if (authenticatedUser != undefined && authenticatedUser != null) {
        redirect(LANGUAGE_ROUTE(authenticatedUser.language, JOINED_GAME_ROUTE(gameId)));
    }
    
    return <AuthenticationRequiredBlock lang={DefaultLanguage} />
}