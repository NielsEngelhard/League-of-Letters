import z from "zod";
import { wordInputOptions } from "./settings-models";

export const settingsSchema = z.object({
    keyboardInput: z.enum(wordInputOptions).default("on-screen-keyboard").optional(),
    playSoundEffects: z.boolean().default(true).optional(),
    playBackgroundMusic: z.boolean().default(true).optional(),
    enableDarkMode: z.boolean().default(false).optional(),
});
export type SettingsSchema = z.infer<typeof settingsSchema>;