"use server"

import { getAuthenticatedUser_Server } from "@/features/auth/utils/auth-server-utils"
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "./routes"
import { redirect } from "next/navigation";
import HomePageClient from "@/components/layout/HomePageClient";

export default async function HomePageWithoutLocale() {
    // Check if logged in
    const loggedInUser = await getAuthenticatedUser_Server();
    if (loggedInUser && loggedInUser.language) {
        redirect(LANGUAGE_ROUTE(loggedInUser.language, PICK_GAME_MODE_ROUTE));
    }
    
    return <HomePageClient />
}