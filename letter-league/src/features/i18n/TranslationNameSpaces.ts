import BeforeGameTranslations from "./translation-file-interfaces/BeforeGameTranslations";
import { GeneralTranslations } from "./translation-file-interfaces/GeneralTranslations";
import HomePageTranslations from "./translation-file-interfaces/HomePageTranslations";
import InGameTranslations from "./translation-file-interfaces/InGameTranslations";
import ScoreTranslations from "./translation-file-interfaces/ScoreTranslations";
import { WordsTranslations } from "./translation-file-interfaces/WordsTranslations";

export interface TranslationNamespaces {
  home: HomePageTranslations;
  general: GeneralTranslations;
  words: WordsTranslations;
  score: ScoreTranslations;
  beforeGame: BeforeGameTranslations;
  inGame: InGameTranslations;
}