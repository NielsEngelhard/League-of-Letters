import { HeaderTranslations } from "./translation-file-interfaces/HeaderTranslations";
import HomePageTranslations from "./translation-file-interfaces/HomePageTranslations";
import { WordsTranslations } from "./translation-file-interfaces/WordsTranslations";

export interface TranslationNamespaces {
  home: HomePageTranslations;
  header: HeaderTranslations;
  words: WordsTranslations;
}