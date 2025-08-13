export const supportedLanguages = ["nl"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];