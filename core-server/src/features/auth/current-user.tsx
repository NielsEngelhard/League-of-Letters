"use server";

import { JWTService } from "./jwt/jwt-service";
import { cookies, headers } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./auth-constants";
import { JwtAccountPayload } from "./jwt/jwt-models";
import RefreshJwtToken from "./actions/command/refresh-token-command";
import { cache } from "react";
import { redirect } from "next/navigation";
import { AUTH_REFRESH_ROUTE } from "@/app/routes";

// Function with 'cache' to memoize its result per request
// set forInitialPageLoad=true when using in the page.tsx
export const GetCurrentUser_Server = cache(async (forInitialPageLoad: boolean = false): Promise<JwtAccountPayload | null> => {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME);

    // If an auth token exists, parse and check it
    if (authToken) {
        const parsedAuthToken = JWTService.parseTokenAndCheckExpiresSoon(authToken.value);

        // If the token is valid but about to expire, try to refresh it
        if (parsedAuthToken?.expiresSoon && refreshToken) {
            if (forInitialPageLoad) await RouteToAuthRefresh();

            const refreshPayload = await RefreshJwtToken(refreshToken.value);
            if (refreshPayload) {
                return refreshPayload;
            }
        }

        // If the token is valid (and not about to expire, or refresh failed), use it
        if (parsedAuthToken) {
            return parsedAuthToken.parsedToken;
        }
    }

    // Fallback: If no valid auth token, try to use the refresh token directly
    if (refreshToken) {
        if (forInitialPageLoad) await RouteToAuthRefresh();

        const refreshPayload = await RefreshJwtToken(refreshToken.value);
        if (refreshPayload) {
            return refreshPayload;
        }
    }

    // If all else fails, return null
    return null;
});

async function RouteToAuthRefresh() {
    const pagePath = await GetPagePath();
    redirect(AUTH_REFRESH_ROUTE(pagePath));
}

async function GetPagePath(): Promise<string> {
  const headersList = await headers();
  const fullUrl = headersList.get("x-url") || ""; // if you set middleware for absolute url
  return new URL(fullUrl, "http://dummy").pathname;    
}
