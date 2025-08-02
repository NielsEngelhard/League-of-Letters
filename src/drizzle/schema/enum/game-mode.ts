import { pgEnum } from "drizzle-orm/pg-core";

export enum GameMode {
  Solo = "solo",
  Online = "online",
}
export const gameModeEnum = pgEnum('game_mode', [
  GameMode.Solo,
  GameMode.Online,
]);