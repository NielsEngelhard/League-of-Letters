export const supportedLanguages = ["nl", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const DefaultLanguage: SupportedLanguage = "en";