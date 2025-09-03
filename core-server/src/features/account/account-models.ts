import { SupportedLanguage } from "../i18n/languages";
import { SettingsSchema } from "./account-schemas";

export const wordInputOptions = ['on-screen-keyboard', 'html-input', 'keystroke'] as const;
export type WordInputOption = (typeof wordInputOptions)[number];

export const themeOptions = ['light', 'dark', 'candy', 'hackerman'] as const;
export type ThemeOption = (typeof themeOptions)[number];

export interface PublicAccountModel {
    id: string;
    username: string;
    favouriteWord: string;
    nGamesPlayed: number;
    highestScoreAchieved: number;
    colorHex: string;
    createdAt: Date;
    language: SupportedLanguage;
    isGuest?: boolean;
    settings?: SettingsSchema;
    tokenExpireUtcDate?: Date;
}

export interface PrivateAccountModel {
    id: string;
    email: string;
    username: string;
    favouriteWord: string;
    nGamesPlayed: number;
    highestScoreAchieved: number;
    colorHex: string;
    createdAt: Date;
    language: SupportedLanguage;
    isGuest?: boolean;
}
