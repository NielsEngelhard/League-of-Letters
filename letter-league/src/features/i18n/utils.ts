import { SupportedLanguage } from "./languages";

export async function loadTranslations(lang: SupportedLanguage) {
  try {
    const [home] = await Promise.all([
      import(`./locales/${lang}/home.json`),
    ]);

    return {
      home: home.default,
    };
  } catch (error) {
    
  }
}