import { LETTER_ANIMATION_TIME_MS } from "../game-constants";

export function GetLetterAnimationDurationInMs(nLetters: number) {
    return LETTER_ANIMATION_TIME_MS * nLetters;
}