import { SupportedLanguage, supportedLanguages } from "../i18n/languages";

/**
 * Changes the language prefix of a path.
 * * @param path - The path (e.g., "/en/about?x=1#section").
 * @param newLang - The new language code (e.g., "de", "nl").
 * @returns The updated path with the new language prefix.
 */
export function changePathLanguagePrefix(
  path: string,
  newLang: string,
): string {
  try {
    // Split off query and hash
    const [pathname, rest] = path.split(/(?=[?#])/); // keeps ? and # in rest
    
    // Remove leading slash before splitting
    const segments = pathname.replace(/^\//, '').split('/').filter(Boolean);

    if (segments.length > 0 && supportedLanguages.includes(segments[0] as SupportedLanguage)) {
      // Replace existing language
      segments[0] = newLang;
    } else {
      // Prepend if missing
      segments.unshift(newLang);
    }

    return "/" + segments.join("/") + (rest ?? "");
  } catch {
    return path; // fallback
  }
}