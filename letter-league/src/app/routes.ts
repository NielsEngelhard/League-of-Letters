export const PICK_GAME_MODE_ROUTE = "/";
export const SOLO_GAME_ROUTE = "/solo";
export const MULTIPLAYER_GAME_ROUTE = "/online";
export const CREATE_MULTIPLAYER_GAME_ROUTE = "/online/create";
export const PROFILE_ROUTE = "/account";

export const PRIVACY_POLICY_ROUTE = "/privacy-policy";
export const TERMS_OF_SERVICE_ROUTE = "/terms-of-service";

export const PLAY_GAME_ROUTE = (gameId: string): string => {
    return `/game/${gameId}`;
}

export const JOIN_GAME_ROUTE = (gameId: string): string => {
    return `/online/join/${gameId}`;
}