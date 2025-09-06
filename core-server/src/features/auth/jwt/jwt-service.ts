import jwt from 'jsonwebtoken';
import { CreateTokenResponse, GenerateAndSetAuthCookiesResponse, JwtAccountPayload, ParseAndCheckExpireResponse } from './jwt-models';
import { AUTH_TOKEN_COOKIE_NAME, JWT_EXPIRES_SOON_THRESHOLD_IN_MINUTES, REFRESH_COOKIE_NAME, REFRESH_TOKEN_EXPIRE_TIME_IN_DAYS } from '../auth-constants';
import { cookies } from 'next/headers';
import UpdateAccountRefreshTokenCommand from '../actions/command/update-account-refresh-token-command';

const JWT_SECRET = process.env.JWT_SECRET!;

export class JWTService {
  async generateTokensAndSetAuthCookies(payload: JwtAccountPayload): Promise<GenerateAndSetAuthCookiesResponse> {
    const authToken = JWTService.generateToken(payload);
    const refreshToken = payload.isGuest ? null : JWTService.generateRefreshToken(); // Only set refresh token for non-guest accounts

    const cookieStore = await cookies();

    // Set auth token cookie
    cookieStore.set(AUTH_TOKEN_COOKIE_NAME, authToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: authToken.secondsUntillExpired,
    });

    // Set refresh token cookie (if not guest account)
    if (refreshToken != null) {
      cookieStore.set(REFRESH_COOKIE_NAME, refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: refreshToken.secondsUntillExpired,
      });

      await UpdateAccountRefreshTokenCommand(payload.accountId, refreshToken);
    }

    return {
      authTokenExpireDateUtc: JWTService.secondsUntillExpiredToDate(authToken.secondsUntillExpired),
      refreshTokenExpireDateUtc: refreshToken ? JWTService.secondsUntillExpiredToDate(refreshToken.secondsUntillExpired) : null
    }
  }

  static async clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
    cookieStore.delete(REFRESH_COOKIE_NAME);
  }

  static generateToken(payload: JwtAccountPayload): CreateTokenResponse {
    const expiresInSeconds = this.getAuthTokenExpiresInSeconds(payload.isGuest);
    const authToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: expiresInSeconds
    });

    return {
      token: authToken,
      secondsUntillExpired: expiresInSeconds
    } 
  }

  static tokenIsValid(token: string): boolean {
    try {
      const verifiedJwt = jwt.verify(token, JWT_SECRET);
      return verifiedJwt != null && verifiedJwt != undefined;
    } catch {
      return false;
    }
  }  

  static parseToken(token: string): JwtAccountPayload | null {
    try {
      const verifiedJwt = jwt.verify(token, JWT_SECRET);
      return verifiedJwt as JwtAccountPayload;
    } catch {
      return null;
    }
  }

  static generateRefreshToken(): CreateTokenResponse {
    return {
        token: crypto.randomUUID(),
        secondsUntillExpired: 60 * 60 * 24 * REFRESH_TOKEN_EXPIRE_TIME_IN_DAYS // sec*min*hour*days
    };
  }  

  static getAuthTokenExpiresInSeconds(isGuestAccount: boolean) {
    if (isGuestAccount) {
        return 5;
        // return 60 * 60 * GUEST_USER_JWT_EXPIRE_TIME_IN_HOURS;
    } else {
        // return 60 * 60 * REGULAR_USER_JWT_EXPIRE_TIME_IN_HOURS;
        return 5;
    }
  }

  static getRefreshTokenExpiresInSeconds() {
    return 60 * 60 * REFRESH_TOKEN_EXPIRE_TIME_IN_DAYS;
  }    

  static parseTokenAndCheckExpiresSoon(token: string): ParseAndCheckExpireResponse | null {
    try {
      const parsedToken = this.parseToken(token);
      if (!parsedToken || !parsedToken.exp) return null;

      // Get the current time in seconds (Unix timestamp).
      const now = Math.floor(Date.now() / 1000);

      // Calculate the expiration time in seconds minus a x-minute buffer (x * 60 seconds).
      const expiresSoonThreshold = parsedToken.exp - (JWT_EXPIRES_SOON_THRESHOLD_IN_MINUTES * 60);

      // If the current time is after the threshold, the token is expiring soon or is already expired.
      // A JWT `exp` is in seconds, so we compare it to a timestamp in seconds.
      return {
        parsedToken: parsedToken,
        expiresSoon: now >= expiresSoonThreshold
      }

    } catch (error) {
      return null;
    }
  }

  static secondsUntillExpiredToDate(seconds: number) {
    const now = new Date();
    return new Date(now.getTime() + seconds * 1000);
  }
}
