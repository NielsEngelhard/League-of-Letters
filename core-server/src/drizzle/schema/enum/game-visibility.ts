import { pgEnum } from "drizzle-orm/pg-core";

export const gameVisibilities = ["public", "private"] as const;
export type GameVisibility = (typeof gameVisibilities)[number];

export const gameVisibilityEnum = pgEnum('game_visibility', gameVisibilities);