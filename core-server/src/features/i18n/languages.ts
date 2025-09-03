export const supportedLanguages = ["nl", "en", "de", "fr"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const DefaultLanguage: SupportedLanguage = "en";