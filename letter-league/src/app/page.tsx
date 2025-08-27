"use client"

import { redirect } from "next/navigation"
import { HOME_ROUTE } from "./routes"
import { DefaultLanguage } from "@/features/i18n/languages"

export default function HomePageWithoutLocale() {
    redirect(`/${DefaultLanguage}/${HOME_ROUTE}`)
}