import { SupportedLanguage } from "@/features/i18n/languages";

export interface JwtAccountPayload {
  accountId: string;
  email: string;
  username: string;
  isGuest: boolean;
  language: SupportedLanguage;
  
  iat?: number;
  exp?: number;  
}

export interface CreateTokenResponse {
    token: string;
    secondsUntillExpired: number;
}

export interface GenerateAndSetJwtResponse {
    authTokenExpireDate: Date;
    refreshTokenExpireDate: Date;
    refreshToken: string;
}

export interface ParseAndCheckExpireResponse {
    parsedToken: JwtAccountPayload;
    expiresSoon: boolean;
}

export interface GenerateAndSetAuthCookiesResponse {
    authTokenExpireDateUtc: Date;
    refreshTokenExpireDateUtc: Date | null;
}