import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { 
  AUTH_TOKEN_COOKIE_NAME, 
  REFRESH_COOKIE_NAME,
  GUEST_USER_JWT_EXPIRE_TIME_IN_HOURS, 
  REGULAR_USER_JWT_EXPIRE_TIME_IN_HOURS,
  REFRESH_TOKEN_EXPIRE_TIME_IN_DAYS
} from './auth-constants';
import { SupportedLanguage } from '../i18n/languages';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export interface JWTPayload {
  accountId: string;
  email: string;
  username: string;
  isGuest: boolean;
  language: SupportedLanguage;

  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  accountId: string;
  tokenVersion?: number; // Optional: for token invalidation
  iat?: number;
  exp?: number;
}

export class JWTService {
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, accountType: 'account' | 'guest'): string {
    const expiresInSeconds = this.getExpiresInSeconds(accountType);
        
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: expiresInSeconds
    });
  }

  static generateRefreshToken(accountId: string, tokenVersion?: number): string {
    const payload: RefreshTokenPayload = {
      accountId,
      ...(tokenVersion !== undefined && { tokenVersion })
    };

    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXPIRE_TIME_IN_DAYS}d`
    });
  }

  static getExpiresInSeconds(accountType: 'account' | 'guest'): number {
    switch(accountType) {
      case 'account':
        return 60 * 60 * REGULAR_USER_JWT_EXPIRE_TIME_IN_HOURS;
      case 'guest':
        return 60 * 60 * GUEST_USER_JWT_EXPIRE_TIME_IN_HOURS;
    }
  }

  static getRefreshTokenExpiresInSeconds(): number {
    return 60 * 60 * 24 * REFRESH_TOKEN_EXPIRE_TIME_IN_DAYS;
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
    } catch {
      return null;
    }
  }

  static async setAuthCookies(
    payload: Omit<JWTPayload, 'iat' | 'exp'>,
    accountType: 'account' | 'guest',
    tokenVersion?: number
  ): Promise<{ accessTokenExpires: Date; refreshTokenExpires: Date }> {
    const accessToken = this.generateToken(payload, accountType);
    const refreshToken = this.generateRefreshToken(payload.accountId, tokenVersion);
    const cookieStore = await cookies();

    const accessTokenMaxAge = this.getExpiresInSeconds(accountType);
    const refreshTokenMaxAge = this.getRefreshTokenExpiresInSeconds();

    // Set access token cookie
    cookieStore.set(AUTH_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
    });

    // Set refresh token cookie
    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
    });

    // Calculate expiration UTC Dates
    const accessTokenExpires = new Date(Date.now() + accessTokenMaxAge * 1000);
    const refreshTokenExpires = new Date(Date.now() + refreshTokenMaxAge * 1000);

    return {
      accessTokenExpires,
      refreshTokenExpires
    };
  }

  // Keep the old method for backward compatibility
  static async setAuthCookie(
    payload: Omit<JWTPayload, 'iat' | 'exp'>,
    accountType: 'account' | 'guest'
  ): Promise<Date> {
    const result = await this.setAuthCookies(payload, accountType);
    return result.accessTokenExpires;
  }
    
  static async getAuthCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
    return cookie?.value || null;
  }

  static async getRefreshCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(REFRESH_COOKIE_NAME);
    return cookie?.value || null;
  }

  static async clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
    cookieStore.delete(REFRESH_COOKIE_NAME);
  }

  // Keep the old method for backward compatibility
  static async clearAuthCookie(): Promise<void> {
    await this.clearAuthCookies();
  }

  static async getCurrentUser(): Promise<JWTPayload | null> {
    const token = await this.getAuthCookie();
    if (!token) return null;
        
    return this.verifyToken(token);
  }

  static async refreshAccessToken(
    getUserData: (accountId: string) => Promise<Omit<JWTPayload, 'iat' | 'exp'> | null>
  ): Promise<{ user: JWTPayload; accessTokenExpires: Date } | null> {
    const refreshToken = await this.getRefreshCookie();
    if (!refreshToken) return null;

    const refreshPayload = this.verifyRefreshToken(refreshToken);
    if (!refreshPayload) return null;

    // Get fresh user data from your database
    const userData = await getUserData(refreshPayload.accountId);
    if (!userData) return null;

    // Determine account type based on user data
    const accountType = userData.isGuest ? 'guest' : 'account';

    // Generate new access token
    const newAccessToken = this.generateToken(userData, accountType);
    const cookieStore = await cookies();
    const accessTokenMaxAge = this.getExpiresInSeconds(accountType);

    // Update only the access token cookie
    cookieStore.set(AUTH_TOKEN_COOKIE_NAME, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
    });

    const accessTokenExpires = new Date(Date.now() + accessTokenMaxAge * 1000);
    
    return {
      user: { ...userData, iat: Math.floor(Date.now() / 1000), exp: Math.floor(accessTokenExpires.getTime() / 1000) },
      accessTokenExpires
    };
  }

  static async getCurrentUserWithRefresh(
    getUserData: (accountId: string) => Promise<Omit<JWTPayload, 'iat' | 'exp'> | null>
  ): Promise<JWTPayload | null> {
    // Try to get current user with existing token
    const user = await this.getCurrentUser();
    if (user) return user;

    // If no valid access token, try to refresh
    const refreshResult = await this.refreshAccessToken(getUserData);
    if (refreshResult) return refreshResult.user;

    return null;
  }
}