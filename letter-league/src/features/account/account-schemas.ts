import z from "zod";
import { themeOptions, wordInputOptions } from "./account-models";

export const settingsSchema = z.object({    
    theme: z.enum(themeOptions).default("light").optional(),
    
    // Display
    showLettersOnTopOfScreen: z.boolean().default(true).optional(),

    // Keyboard
    keyboardInput: z.enum(wordInputOptions).default("on-screen-keyboard").optional(),
    showKeyboardHints: z.boolean().default(true).optional(),
    showGuessedLettersBar: z.boolean().default(true).optional(),

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
