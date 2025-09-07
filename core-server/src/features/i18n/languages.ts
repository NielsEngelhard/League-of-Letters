export const supportedLanguages = ["nl", "en", "de", "fr"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const DefaultLanguage: SupportedLanguage = "en";

export function isSupportedLanguage(lang: string | undefined | null): lang is SupportedLanguage {
  if (lang == undefined || lang == null) return false;

  return (supportedLanguages as readonly string[]).includes(lang);
}