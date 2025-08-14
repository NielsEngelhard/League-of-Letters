import z from "zod";
import { themeOptions, wordInputOptions } from "./profile-models";

export const settingsSchema = z.object({
    keyboardInput: z.enum(wordInputOptions).default("on-screen-keyboard").optional(),
    theme: z.enum(themeOptions).default("light").optional(),
    playSoundEffects: z.boolean().default(true).optional(),
    playBackgroundMusic: z.boolean().default(true).optional(),
});
export type SettingsSchema = z.infer<typeof settingsSchema>;