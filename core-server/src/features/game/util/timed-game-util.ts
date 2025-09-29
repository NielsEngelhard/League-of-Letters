import { getCurrentUtcDatePlusSeconds, msToSeconds } from "@/lib/time-util";
import { LETTER_ANIMATION_TIME_MS } from "../game-constants";

export function GetNextGuessExpiresUtcDate(nSecondsPerGuess: number | undefined | null, wordLength: number): Date | undefined {
    if (!nSecondsPerGuess) return undefined;

    const baseSeconds = nSecondsPerGuess; // x sec per round so always at this
    const animationLengthSeconds = msToSeconds(wordLength * LETTER_ANIMATION_TIME_MS); // ANIMATION length

    return getCurrentUtcDatePlusSeconds(baseSeconds + animationLengthSeconds);
}