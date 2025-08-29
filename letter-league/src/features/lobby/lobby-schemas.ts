import z from "zod";
import { supportedLanguages } from "../i18n/languages";

export const createOnlineLobbySchema = z.object({
    hostUserId: z.string(),
    language: z.enum(supportedLanguages),
});
export type CreateOnlineLobbySchema = z.infer<typeof createOnlineLobbySchema>;

export const joinOnlineLobbySchema = z.object({
    gameId: z.string()
});
export type JoinOnlineLobbySchema = z.infer<typeof joinOnlineLobbySchema>;