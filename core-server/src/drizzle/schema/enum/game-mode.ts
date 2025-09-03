import { pgEnum } from "drizzle-orm/pg-core";

export const gameModes = ["solo", "online"] as const;
export type GameMode = (typeof gameModes)[number];

export const gameModeEnum = pgEnum('game_mode', gameModes);