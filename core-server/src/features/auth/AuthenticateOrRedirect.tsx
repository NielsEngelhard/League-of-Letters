'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HOME_ROUTE } from '@/app/routes';
import RefreshJwtToken from './actions/command/refresh-token-command';
import { JWTService } from './jwt/jwt-service';
import { AUTH_TOKEN_COOKIE_NAME, REFRESH_COOKIE_NAME } from './auth-constants';
import { JwtAccountPayload } from './jwt/jwt-models';

export async function AuthenticateOrRedirect(): Promise<JwtAccountPayload> {
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  try {
    if (!accessToken) ReturnUnauthorized();
    
    const tokenInfo = JWTService.parseTokenAndCheckExpiresSoon(accessToken!);

    if (!tokenInfo || tokenInfo == null || tokenInfo.expiresSoon == true) {
      if (!refreshToken) ReturnUnauthorized();
      
      const refreshPayload = await RefreshJwtToken(refreshToken);
      if (!refreshPayload) ReturnUnauthorized();

      return refreshPayload;
    }

    return tokenInfo.parsedToken;
  } catch {
    ReturnUnauthorized();
  }
}

function ReturnUnauthorized(): never {
  JWTService.clearAuthCookies();
  redirect(HOME_ROUTE);
}