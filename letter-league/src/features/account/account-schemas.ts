import z from "zod";
import { themeOptions, wordInputOptions } from "./account-models";

export const settingsSchema = z.object({
    keyboardInput: z.enum(wordInputOptions).default("on-screen-keyboard").optional(),
    theme: z.enum(themeOptions).default("light").optional(),
    playSoundEffects: z.boolean().default(true).optional(),
    playBackgroundMusic: z.boolean().default(true).optional(),
});
export type SettingsSchema = z.infer<typeof settingsSchema>;


export const loginSchema = z.object({
    username: z.string().min(1, "Required"),
    password: z.string().min(1, "Required")
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
    email: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),    
    username: z.string().optional(),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;
