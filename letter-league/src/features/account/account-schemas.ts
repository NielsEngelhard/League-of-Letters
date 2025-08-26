import z from "zod";
import { themeOptions, wordInputOptions } from "./account-models";
import { supportedLanguages } from "../i18n/languages";

export const settingsSchema = z.object({    
    theme: z.enum(themeOptions).default("light").optional(),
    
    // Keyboard
    keyboardInput: z.enum(wordInputOptions).default("on-screen-keyboard").optional(),
    showKeyboardHints: z.boolean().default(true).optional(),
    showCompleteCorrect: z.boolean().default(false).optional(),

    // Display
    preFillGuess: z.boolean().default(false).optional(),

    // Sound
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

export const guestLoginSchema = z.object({
    language: z.enum(supportedLanguages),
});
export type GuestLoginSchema = z.infer<typeof guestLoginSchema>;