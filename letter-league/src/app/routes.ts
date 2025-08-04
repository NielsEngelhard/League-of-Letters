export const PICK_GAME_MODE_ROUTE = "/";
export const SOLO_GAME_ROUTE = "/solo";
export const MULTIPLAYER_GAME_ROUTE = "/online";
export const CREATE_MULTIPLAYER_GAME_ROUTE = "/online/create";
export const PROFILE_ROUTE = "/profile";

export const PLAY_GAME_ROUTE = (gameId: string): string => {
    return `/game/${gameId}`;
}