import { cookies } from "next/headers";
import { JWTPayload, JWTService } from "../jwt-service";
import { AUTH_TOKEN_COOKIE_NAME } from "../auth-constants";

export async function isAuthenticated_Server(): Promise<boolean> {
  const authenticatedUser = await getAuthenticatedUser_Server();

  return authenticatedUser != null;
}

export async function getAuthenticatedUser_Server(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
  if (!authTokenCookie) return null;

  return JWTService.verifyToken(authTokenCookie.value);
}
