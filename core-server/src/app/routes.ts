import { SupportedLanguage } from "@/features/i18n/languages";

export function LANGUAGE_ROUTE(language: SupportedLanguage, route: string): string {
    return `/${language}${route}`;
}

export const HOME_ROUTE = "/";
export const PICK_GAME_MODE_ROUTE = "/game-mode";
export const SOLO_GAME_ROUTE = "/solo";
export const MULTIPLAYER_GAME_ROUTE = "/online";
export const CREATE_MULTIPLAYER_GAME_ROUTE = "/online/connect/create";
export const PROFILE_ROUTE = "/account";
export const RECONNECT_ROUTE = "/reconnect";
export const SCORE_ROUTE = "/score";

export const PRIVACY_POLICY_ROUTE = "/privacy-policy";
export const TERMS_OF_SERVICE_ROUTE = "/terms-of-service";
export const HEALTH_CHECK_ROUTE = "/healthcheck";

export const PLAY_SOLO_GAME_ROUTE = (gameId: string): string => {
    return `/solo/play/${gameId}`;
}

export const PLAY_ONLINE_GAME_ROUTE = (gameId: string): string => {
    return `/online/connect/play/${gameId}`;
}

// Join game but we dont know if authenticated
export const JOIN_GAME_ROUTE = (gameId: string): string => {
    return `/join/${gameId}`;
}

// Join game, we know that authenticated
export const JOINED_GAME_ROUTE = (gameId: string): string => {
    return `/online/connect/joined/${gameId}`;
}

export const PLAY_SOLO_GAME_DEMO_ROUTE = (): string => {
    return `${SOLO_GAME_ROUTE}?playDemoGame=true`;
}