"use server"

import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "./routes"
import { redirect } from "next/navigation";
import HomePageClient from "@/components/layout/HomePageClient";
import { GetCurrentUser_Server } from "@/features/auth/current-user";

export default async function HomePageWithoutLocale() {
    // Check if logged in
    const currentUser = await GetCurrentUser_Server();
    if (currentUser && currentUser.language) {
        redirect(LANGUAGE_ROUTE(currentUser.language, PICK_GAME_MODE_ROUTE));
    }
    
    return <HomePageClient />
}