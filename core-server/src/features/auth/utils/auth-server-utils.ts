"use server";
import { cache } from "react";
import { cookies } from "next/headers";
import { JWTPayload, JWTService } from "../jwt-service";
import { AUTH_TOKEN_COOKIE_NAME } from "../auth-constants";

// Cache the authenticated user for the duration of the request
export const getAuthenticatedUser_Server = cache(async (): Promise<JWTPayload | null> => {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
  if (!authTokenCookie) return null;
  
  return JWTService.verifyToken(authTokenCookie.value);
});

// This will automatically benefit from the cached user
export async function isAuthenticated_Server(): Promise<boolean> {
  const authenticatedUser = await getAuthenticatedUser_Server();
  return authenticatedUser != null;
}