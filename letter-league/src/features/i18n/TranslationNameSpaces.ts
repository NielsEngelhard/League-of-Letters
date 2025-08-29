import BeforeGameTranslations from "./translation-file-interfaces/BeforeGameTranslations";
import { HeaderTranslations } from "./translation-file-interfaces/HeaderTranslations";
import HomePageTranslations from "./translation-file-interfaces/HomePageTranslations";
import InGameTranslations from "./translation-file-interfaces/InGameTranslations";
import ScoreTranslations from "./translation-file-interfaces/ScoreTranslations";
import { WordsTranslations } from "./translation-file-interfaces/WordsTranslations";

export interface TranslationNamespaces {
  home: HomePageTranslations;
  header: HeaderTranslations;
  words: WordsTranslations;
  score: ScoreTranslations;
  beforeGame: BeforeGameTranslations;
  inGame: InGameTranslations;
}