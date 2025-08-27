import { SupportedLanguage } from "./languages";

export async function loadTranslations(lang: SupportedLanguage) {
  try {
    const [home, words, header] = await Promise.all([
      import(`./locales/${lang}/home.json`),
      import(`./locales/${lang}/words.json`),
      import(`./locales/${lang}/header.json`),
    ]);

    return {
      home: home.default,
      words: words.default,
      header: header.default
    };
  } catch (error) {
    
  }
}