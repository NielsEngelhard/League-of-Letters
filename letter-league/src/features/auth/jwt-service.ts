import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { COOKIE_NAME, GUEST_USER_JWT_EXPIRE_TIME_IN_HOURS, REGULAR_USER_JWT_EXPIRE_TIME_IN_HOURS } from './auth-constants';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  accountId: string;
  email: string;
  username: string;
  isGuest: boolean;
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

  static getExpiresInSeconds(accountType: 'account' | 'guest'): number {
    switch(accountType) {
      case 'account':
        return 60 * 60 * REGULAR_USER_JWT_EXPIRE_TIME_IN_HOURS;
      case 'guest':
        return 60 * 60 * GUEST_USER_JWT_EXPIRE_TIME_IN_HOURS; 
    }
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static async setAuthCookie(payload: Omit<JWTPayload, 'iat' | 'exp'>, accountType: 'account' | 'guest'): Promise<void> {
    const token = this.generateToken(payload, accountType);
    const cookieStore = await cookies();
    
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  static async getAuthCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    return cookie?.value || null;
  }

  static async clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  }

  static async getCurrentUser(): Promise<JWTPayload | null> {
    const token = await this.getAuthCookie();
    if (!token) return null;
    
    return this.verifyToken(token);
  }
}