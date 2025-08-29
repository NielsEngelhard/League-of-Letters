import { SupportedLanguage } from "@/features/i18n/languages";

export function LANGUAGE_ROUTE(language: SupportedLanguage, route: string): string {
    return `/${language}${route}`;
}

export const HOME_ROUTE = "/";
export const PICK_GAME_MODE_ROUTE = "/game-mode";
export const SOLO_GAME_ROUTE = "/solo";
export const MULTIPLAYER_GAME_ROUTE = "/online";
export const CREATE_MULTIPLAYER_GAME_ROUTE = "/online/create";
export const PROFILE_ROUTE = "/account";
export const RECONNECT_ROUTE = "/reconnect";
export const SCORE_ROUTE = "/score";

export const PRIVACY_POLICY_ROUTE = "/privacy-policy";
export const TERMS_OF_SERVICE_ROUTE = "/terms-of-service";
export const HEALTH_CHECK_ROUTE = "/healthcheck";

export const PLAY_GAME_ROUTE = (gameId: string): string => {
    return `/game/${gameId}`;
}

export const JOIN_GAME_ROUTE = (gameId: string): string => {
    return `/online/join/${gameId}`;
}
