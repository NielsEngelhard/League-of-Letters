export const wordInputOptions = ['on-screen-keyboard', 'html-input', 'keystroke'] as const;
export type WordInputOption = (typeof wordInputOptions)[number];