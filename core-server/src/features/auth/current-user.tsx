"use server";

import { JWTService } from "./jwt/jwt-service";
import { cookies, headers } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./auth-constants";
import { JwtAccountPayload } from "./jwt/jwt-models";
import RefreshJwtToken from "./actions/command/refresh-token-command";
import { cache } from "react";
import { redirect } from "next/navigation";
import { AUTH_REFRESH_ROUTE, HOME_ROUTE, LANGUAGE_ROUTE } from "@/app/routes";
import { DefaultLanguage, isSupportedLanguage, SupportedLanguage } from "../i18n/languages";

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

export async function GetCurrentUserOrRedirect_Server(): Promise<JwtAccountPayload> {
    const currentUser = await GetCurrentUserOrRedirect_Server();
    if (currentUser) return currentUser;

    redirect(HOME_ROUTE);
}

async function RouteToAuthRefresh() {
    const pagePath = await GetPagePath();
    const language = getLanguageRouteSegmentOrDefault(pagePath);

    redirect(LANGUAGE_ROUTE(language, AUTH_REFRESH_ROUTE(pagePath)));
}

function getLanguageRouteSegmentOrDefault(path: string): SupportedLanguage {
  // Remove leading slashes
  const normalized = path.replace(/^\/+/, "");
  // Split into parts
  const parts = normalized.split("/");
  // Return first non-empty part if available
  const firstParth = parts.length > 0 && parts[0] !== "" ? parts[0] : null;

  const validLanguage = isSupportedLanguage(firstParth);

  return validLanguage ? firstParth as SupportedLanguage : DefaultLanguage;
}

async function GetPagePath(): Promise<string> {
  const headersList = await headers();
  const fullUrl = headersList.get("x-url") || ""; // if you set middleware for absolute url
  return new URL(fullUrl, "http://dummy").pathname;    
}
