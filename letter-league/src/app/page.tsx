"use client"

import { useRouter } from "next/navigation"
import { HOME_ROUTE } from "./routes"
import { useRouteToPage } from "./useRouteToPage";

export default function HomePageWithoutLocale() {
    const router = useRouter();
    const route = useRouteToPage();
    router.push(route(HOME_ROUTE));
}