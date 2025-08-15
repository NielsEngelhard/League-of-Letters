export const wordInputOptions = ['on-screen-keyboard', 'html-input', 'keystroke'] as const;
export type WordInputOption = (typeof wordInputOptions)[number];

export const themeOptions = ['light', 'dark', 'candy', 'hackerman'] as const;
export type ThemeOption = (typeof themeOptions)[number];
