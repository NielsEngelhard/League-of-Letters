"use client"

import RefreshJwtToken from "@/features/auth/actions/command/refresh-token-command";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react"
import { HOME_ROUTE, LANGUAGE_ROUTE } from "../../routes";
import { useAuth } from "@/features/auth/AuthContext";
import { LogoutCommand } from "@/features/auth/actions/command/logout-command";

// This is needed for refreshing the auth cookie on page load (when the cookie was expired)
// Setting cookies (new auth and refresh token) in page.tsx components is not possible, so this workaround is introduced.
export default function AuthRefresh() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    

    useEffect(() => {
        performRefresh();
    }, []);

    async function performRefresh() {
        const refreshResult = await RefreshJwtToken();
        if (!callbackUrl || refreshResult == null) {
            // Clear cookies to prevent infinite loop scenarios
            LogoutCommand();
            redirect(LANGUAGE_ROUTE("en", HOME_ROUTE));
        };
      
        redirect(callbackUrl);
    }

    return (
        <div>
            Checking auth...
        </div>
    )
}