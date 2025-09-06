'use server';

import { cookies } from 'next/headers';
import { JWTService } from '../jwt/jwt-service';
import { AUTH_TOKEN_COOKIE_NAME, REFRESH_COOKIE_NAME } from '../auth-constants';
import { redirect } from 'next/navigation';
import { HOME_ROUTE } from '@/app/routes';
import RefreshJwtToken from '../actions/command/refresh-token-command';

// Reusable wrapper that refreshes the auth token if needed
export async function withAuth<T>(action: any): Promise<T> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  try {
    if (!accessToken) throw Error("Unauthorized");
    const tokenInfo = JWTService.parseTokenAndCheckExpiresSoon(accessToken);

    // If the refresh token is expired, refresh it
    if (tokenInfo == null || tokenInfo.expiresSoon == true) {
      if (!refreshToken) throw Error("JWT ERROR: refresh token not found");

      const refreshPayload = await RefreshJwtToken(refreshToken);
      if (!refreshPayload) throw Error("JWT ERROR: error while refreshing the jwt");
    }

    // Retry the action with the new token
    return action() as T;    
  } catch {
    JWTService.clearAuthCookies();
    redirect(HOME_ROUTE);
  }
}
