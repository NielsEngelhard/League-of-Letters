import z from "zod";

export const createOnlineLobbySchema = z.object({
    hostUserId: z.string()
});
export type CreateOnlineLobbySchema = z.infer<typeof createOnlineLobbySchema>;

export const joinOnlineLobbySchema = z.object({
    gameId: z.string()
});
export type JoinOnlineLobbySchema = z.infer<typeof joinOnlineLobbySchema>;