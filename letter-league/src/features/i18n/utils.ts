import { SupportedLanguage } from "./languages";
import { TranslationNamespaces } from "./TranslationNameSpaces";

export async function loadTranslations<
  N extends (keyof TranslationNamespaces)[]
>(
  lang: SupportedLanguage,
  namespaces: [...N]
): Promise<Pick<TranslationNamespaces, N[number]>> {
  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await import(`./locales/${lang}/${ns}.json`);
      return [ns, mod.default] as const;
    })
  );

  return Object.fromEntries(entries) as Pick<TranslationNamespaces, N[number]>;
}