import { DbActiveGameWithRoundsAndPlayers } from "@/drizzle/schema";
import { ActiveGameModel } from "@/features/game/game-models";

export interface TimeOffsetRequestData {
    timePerGuess: number;
    currentRoundNumber: number; // 1-based
    currentGuessNumber: number; // 1-based  
    lastGuessUnixUtcTimeStamp_InSeconds: number;
    guessesPerRound: number;
    maxRounds: number;
}

export interface TimeOffsetResponse {
    actualGuess: number; // 1-based
    actualRound: number; // 1-based
}

// Calculate the actual current guess and round based on the time that has past 
export class GameTimeOffsetTracker {

    static calculateForGame(game: ActiveGameModel | DbActiveGameWithRoundsAndPlayers): TimeOffsetResponse | null {
        if (!game.nSecondsPerGuess) return null;
        
        const currentRound = game.rounds.find(r => r.roundNumber == game.currentRoundIndex);
        if (!currentRound) return null;
        
        if (!currentRound.lastGuessUnixUtcTimestamp_InSeconds) throw Error("INVALID GAME STATE: seconds per guess is defined but no last unix timestamp provided");
        
        return this.calculate({
            currentRoundNumber: game.currentRoundIndex,
            currentGuessNumber: currentRound.currentGuessIndex,
            guessesPerRound: game.nGuessesPerRound,
            lastGuessUnixUtcTimeStamp_InSeconds: currentRound.lastGuessUnixUtcTimestamp_InSeconds,
            maxRounds: game.rounds.length,
            timePerGuess: game.nSecondsPerGuess
        });
    }

    // Calculate the actual guess and round when playing with time. The database can indicate round 1 guess 1, but when you play with time
    // It can be that e.g. it is guess 2 in reality.
    // Returns null if no time has elapsed (no offset needed)
    static calculate(data: TimeOffsetRequestData): TimeOffsetResponse | null {
        // Validate input
        if (data.timePerGuess <= 0) {
            throw new Error("timePerGuess must be positive");
        }

        // Calculate elapsed time since last guess
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const elapsedSeconds = currentTimeInSeconds - data.lastGuessUnixUtcTimeStamp_InSeconds;

        // If no time has elapsed, no offset needed
        if (elapsedSeconds < data.timePerGuess) {
            return null;
        }

        // Calculate how many guesses should have passed based on elapsed time
        const guessesElapsed = Math.floor(elapsedSeconds / data.timePerGuess);

        // Start from current position and add elapsed guesses
        // Convert to 0-based for calculation, then back to 1-based
        let actualGuess = (data.currentGuessNumber - 1) + guessesElapsed;
        let actualRound = data.currentRoundNumber - 1; // Convert to 0-based

        // Handle round overflow - move to next rounds if we've exceeded guesses per round
        while (actualGuess >= data.guessesPerRound) {
            actualGuess -= data.guessesPerRound;
            actualRound++;
        }

        // Ensure we don't exceed total rounds
        if (actualRound >= data.maxRounds) {
            actualRound = data.maxRounds - 1; // Last round (0-based)
            actualGuess = data.guessesPerRound - 1; // Last guess of final round (0-based)
        }

        // Convert back to 1-based indexing
        return {
            actualGuess: actualGuess + 1,
            actualRound: actualRound + 1
        };
    }
}