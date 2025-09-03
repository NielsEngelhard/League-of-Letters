"use client"

import { useAuth } from "@/features/auth/AuthContext";
import { useEffect } from "react"

export default function LayoutClient() {
    const { settings } = useAuth();
    // On initial load perform actions on the client like setting your settings correctly

    // On load set theme
    useEffect(() => {
        if (!settings.theme) return;

        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    return <></>;
}