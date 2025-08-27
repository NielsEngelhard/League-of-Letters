import { SupportedLanguage } from "./languages";

export async function loadTranslations(lang: SupportedLanguage) {
  try {
    const [home, words] = await Promise.all([
      import(`./locales/${lang}/home.json`),
      import(`./locales/${lang}/words.json`),
    ]);

    return {
      home: home.default,
      words: words.default
    };
  } catch (error) {
    
  }
}