import z from "zod";
import { supportedLanguages } from "../i18n/languages";

export const loginSchema = z.object({
    username: z.string().min(1, "Required"),
    password: z.string().min(1, "Required")
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
    email: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),    
    username: z.string().optional(),
    language: z.enum(supportedLanguages),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;

export const guestLoginSchema = z.object({
    language: z.enum(supportedLanguages),
    username: z.string().max(12).optional()
});
export type GuestLoginSchema = z.infer<typeof guestLoginSchema>;