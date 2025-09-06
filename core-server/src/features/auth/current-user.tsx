"use server";

import { JWTService } from "./jwt/jwt-service";
import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./auth-constants";
import { JwtAccountPayload } from "./jwt/jwt-models";
import RefreshJwtToken from "./actions/command/refresh-token-command";
import { cache } from "react";

// Function with 'cache' to memoize its result per request
export const GetCurrentUser_Server = cache(async (): Promise<JwtAccountPayload | null> => {
    debugger;
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME);

    // If an auth token exists, parse and check it
    if (authToken) {
        const parsedAuthToken = JWTService.parseTokenAndCheckExpiresSoon(authToken.value);

        // If the token is valid but about to expire, try to refresh it
        if (parsedAuthToken?.expiresSoon && refreshToken) {
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
        const refreshPayload = await RefreshJwtToken(refreshToken.value);
        if (refreshPayload) {
            return refreshPayload;
        }
    }

    // If all else fails, return null
    return null;
});

// export async function GetCurrentUserOrRedirect_Server(): JwtAccountPayload {

// }

// TODO: 2 methods, one for server actions
// and one for page.tsx
// because different scenarios. page.tsx needs to do a redirect? That goes to a page saying refreshing token and then redirect if refreshed back to original page?


// export async function isLoggedInServerCheck(): Promise<boolean> {
//   const jwtService = new JWTService();
//   const user = await jwtService.getCurrentUser();
//   return user != undefined;
// }

// export async function getCurrentUserOrNull(): Promise<JWTPayload | null> {
//   try {
//     const jwtService = new JWTService();
//     const user = await jwtService.getCurrentUser();

//     return user;
//   } catch {
//     return null;
//   }
// }

// export async function getCurrentUserOrRedirect(): Promise<JWTPayload> {
//   const jwtService = new JWTService();
//   const user = await jwtService.getCurrentUser();

//   if (!user) {
//     redirect(HOME_ROUTE)
//   };
  
//   return user;
// }

// export async function getCurrentUserOrCrashNoRefresh(): Promise<JWTPayload> {
//   const jwtService = new JWTService();
//   const user = await jwtService.getCurrentUser();

//   if (!user) throw Error("AUTH ERROR: not logged in");
//   return user;
// }