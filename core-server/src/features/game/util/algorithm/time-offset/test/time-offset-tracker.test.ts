import { GameTimeOffsetTracker } from "../game-time-offset-tracker";

describe("GameTimeOffsetTracker - No Offset Cases", () => {
    const testCases = [
        { currentGuess: 1, currentRound: 1, guessesPerRound: 10, maxRounds: 10, timePerGuess: 20, nSecondsLastGuessAgo: 10, expectedGuess: null, expectedRound: null, description: "Time not elapsed enough" },
        { currentGuess: 5, currentRound: 2, guessesPerRound: 6, maxRounds: 5, timePerGuess: 30, nSecondsLastGuessAgo: 15, expectedGuess: null, expectedRound: null, description: "Mid-round, insufficient time" },
        { currentGuess: 1, currentRound: 1, guessesPerRound: 8, maxRounds: 3, timePerGuess: 45, nSecondsLastGuessAgo: 44, expectedGuess: null, expectedRound: null, description: "One second before trigger" },
        { currentGuess: 3, currentRound: 1, guessesPerRound: 5, maxRounds: 4, timePerGuess: 60, nSecondsLastGuessAgo: 0, expectedGuess: null, expectedRound: null, description: "No time elapsed" },
    ];

    test.each(testCases)(
        "$description - Round $currentRound, Guess $currentGuess, $nSecondsLastGuessAgo seconds ago",
        ({ currentGuess, currentRound, guessesPerRound, maxRounds, timePerGuess, nSecondsLastGuessAgo }) => {
            const currentUnixTimeStamp_sec = Math.floor(Date.now() / 1000);
            const lastGuessUnixTimeStamp_sec = currentUnixTimeStamp_sec - nSecondsLastGuessAgo;
            
            const result = GameTimeOffsetTracker.calculate({
                currentGuessNumber: currentGuess,
                currentRoundNumber: currentRound,
                guessesPerRound: guessesPerRound,
                maxRounds: maxRounds,
                lastGuessUnixUtcTimeStamp_InSeconds: lastGuessUnixTimeStamp_sec,
                timePerGuess: timePerGuess
            });

            expect(result).toBeNull();
        }
    );
});

describe("GameTimeOffsetTracker - Single Guess Advancement", () => {
    const testCases = [
        { currentGuess: 1, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 30, expectedGuess: 2, expectedRound: 1, description: "First guess to second" },
        { currentGuess: 3, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 35, expectedGuess: 4, expectedRound: 1, description: "Mid-round advancement" },
        { currentGuess: 5, currentRound: 2, guessesPerRound: 6, maxRounds: 3, timePerGuess: 45, nSecondsLastGuessAgo: 50, expectedGuess: 6, expectedRound: 2, description: "Near end of round" },
        { currentGuess: 2, currentRound: 1, guessesPerRound: 8, maxRounds: 2, timePerGuess: 20, nSecondsLastGuessAgo: 25, expectedGuess: 3, expectedRound: 1, description: "Fast game timing" },
        { currentGuess: 1, currentRound: 3, guessesPerRound: 4, maxRounds: 3, timePerGuess: 60, nSecondsLastGuessAgo: 75, expectedGuess: 2, expectedRound: 3, description: "Last round advancement" },
    ];

    test.each(testCases)(
        "$description - Round $currentRound, Guess $currentGuess → Round $expectedRound, Guess $expectedGuess",
        ({ currentGuess, currentRound, guessesPerRound, maxRounds, timePerGuess, nSecondsLastGuessAgo, expectedGuess, expectedRound }) => {
            const currentUnixTimeStamp_sec = Math.floor(Date.now() / 1000);
            const lastGuessUnixTimeStamp_sec = currentUnixTimeStamp_sec - nSecondsLastGuessAgo;
            
            const result = GameTimeOffsetTracker.calculate({
                currentGuessNumber: currentGuess,
                currentRoundNumber: currentRound,
                guessesPerRound: guessesPerRound,
                maxRounds: maxRounds,
                lastGuessUnixUtcTimeStamp_InSeconds: lastGuessUnixTimeStamp_sec,
                timePerGuess: timePerGuess
            });

            expect(result?.actualGuess).toBe(expectedGuess);
            expect(result?.actualRound).toBe(expectedRound);
        }
    );
});

describe("GameTimeOffsetTracker - Multiple Guess Advancement Within Round", () => {
    const testCases = [
        { currentGuess: 1, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 60, expectedGuess: 3, expectedRound: 1, description: "Advance 2 guesses" },
        { currentGuess: 2, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 20, nSecondsLastGuessAgo: 80, expectedGuess: 6, expectedRound: 1, description: "Advance 4 guesses to end of round" },
        { currentGuess: 1, currentRound: 2, guessesPerRound: 8, maxRounds: 4, timePerGuess: 15, nSecondsLastGuessAgo: 75, expectedGuess: 6, expectedRound: 2, description: "Advance 5 guesses in large round" },
        { currentGuess: 3, currentRound: 1, guessesPerRound: 10, maxRounds: 2, timePerGuess: 25, nSecondsLastGuessAgo: 75, expectedGuess: 6, expectedRound: 1, description: "Advance 3 guesses in long round" },
        { currentGuess: 4, currentRound: 2, guessesPerRound: 6, maxRounds: 5, timePerGuess: 40, nSecondsLastGuessAgo: 121, expectedGuess: 1, expectedRound: 3, description: "Would exceed round but capped" },
    ];

    test.each(testCases)(
        "$description - Round $currentRound, Guess $currentGuess → Round $expectedRound, Guess $expectedGuess",
        ({ currentGuess, currentRound, guessesPerRound, maxRounds, timePerGuess, nSecondsLastGuessAgo, expectedGuess, expectedRound }) => {
            const currentUnixTimeStamp_sec = Math.floor(Date.now() / 1000);
            const lastGuessUnixTimeStamp_sec = currentUnixTimeStamp_sec - nSecondsLastGuessAgo;
            
            const result = GameTimeOffsetTracker.calculate({
                currentGuessNumber: currentGuess,
                currentRoundNumber: currentRound,
                guessesPerRound: guessesPerRound,
                maxRounds: maxRounds,
                lastGuessUnixUtcTimeStamp_InSeconds: lastGuessUnixTimeStamp_sec,
                timePerGuess: timePerGuess
            });

            expect(result?.actualGuess).toBe(expectedGuess);
            expect(result?.actualRound).toBe(expectedRound);
        }
    );
});

describe("GameTimeOffsetTracker - Round Advancement", () => {
    const testCases = [
        { currentGuess: 6, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 30, expectedGuess: 1, expectedRound: 2, description: "Last guess to next round first guess" },
        { currentGuess: 5, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 60, expectedGuess: 1, expectedRound: 2, description: "Cross round boundary with 2 guesses" },
        { currentGuess: 4, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 90, expectedGuess: 1, expectedRound: 2, description: "Cross round boundary with 3 guesses" },
        { currentGuess: 6, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 20, nSecondsLastGuessAgo: 140, expectedGuess: 1, expectedRound: 3, description: "Skip entire round" },
        { currentGuess: 3, currentRound: 2, guessesPerRound: 4, maxRounds: 4, timePerGuess: 25, nSecondsLastGuessAgo: 75, expectedGuess: 2, expectedRound: 3, description: "Advance to next round mid-way" },
        { currentGuess: 2, currentRound: 1, guessesPerRound: 5, maxRounds: 4, timePerGuess: 5, nSecondsLastGuessAgo: 51, expectedGuess: 2, expectedRound: 3, description: "Multiple round advancement" },
    ];

    test.each(testCases)(
        "$description - Round $currentRound, Guess $currentGuess → Round $expectedRound, Guess $expectedGuess",
        ({ currentGuess, currentRound, guessesPerRound, maxRounds, timePerGuess, nSecondsLastGuessAgo, expectedGuess, expectedRound }) => {
            const currentUnixTimeStamp_sec = Math.floor(Date.now() / 1000);
            const lastGuessUnixTimeStamp_sec = currentUnixTimeStamp_sec - nSecondsLastGuessAgo;
            
            const result = GameTimeOffsetTracker.calculate({
                currentGuessNumber: currentGuess,
                currentRoundNumber: currentRound,
                guessesPerRound: guessesPerRound,
                maxRounds: maxRounds,
                lastGuessUnixUtcTimeStamp_InSeconds: lastGuessUnixTimeStamp_sec,
                timePerGuess: timePerGuess
            });

            expect(result?.actualGuess).toBe(expectedGuess);
            expect(result?.actualRound).toBe(expectedRound);
        }
    );
});

describe("GameTimeOffsetTracker - Maximum Bounds Capping", () => {
    const testCases = [
        { currentGuess: 1, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 1000, expectedGuess: 6, expectedRound: 3, description: "Excessive time - cap at final position" },
        { currentGuess: 5, currentRound: 3, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 100, expectedGuess: 6, expectedRound: 3, description: "Already at last round, cap at end" },
        { currentGuess: 6, currentRound: 3, guessesPerRound: 6, maxRounds: 3, timePerGuess: 30, nSecondsLastGuessAgo: 60, expectedGuess: 6, expectedRound: 3, description: "Already at final position, stay there" },
        { currentGuess: 2, currentRound: 2, guessesPerRound: 4, maxRounds: 2, timePerGuess: 20, nSecondsLastGuessAgo: 200, expectedGuess: 4, expectedRound: 2, description: "Cap at last round, last guess" },
        { currentGuess: 1, currentRound: 5, guessesPerRound: 3, maxRounds: 5, timePerGuess: 15, nSecondsLastGuessAgo: 500, expectedGuess: 3, expectedRound: 5, description: "Max round already reached" },
    ];

    test.each(testCases)(
        "$description - Round $currentRound, Guess $currentGuess → Round $expectedRound, Guess $expectedGuess",
        ({ currentGuess, currentRound, guessesPerRound, maxRounds, timePerGuess, nSecondsLastGuessAgo, expectedGuess, expectedRound }) => {
            const currentUnixTimeStamp_sec = Math.floor(Date.now() / 1000);
            const lastGuessUnixTimeStamp_sec = currentUnixTimeStamp_sec - nSecondsLastGuessAgo;
            
            const result = GameTimeOffsetTracker.calculate({
                currentGuessNumber: currentGuess,
                currentRoundNumber: currentRound,
                guessesPerRound: guessesPerRound,
                maxRounds: maxRounds,
                lastGuessUnixUtcTimeStamp_InSeconds: lastGuessUnixTimeStamp_sec,
                timePerGuess: timePerGuess
            });

            expect(result?.actualGuess).toBe(expectedGuess);
            expect(result?.actualRound).toBe(expectedRound);
        }
    );
});

describe("GameTimeOffsetTracker - Edge Cases", () => {
    const testCases = [
        { currentGuess: 1, currentRound: 1, guessesPerRound: 1, maxRounds: 10, timePerGuess: 30, nSecondsLastGuessAgo: 90, expectedGuess: 1, expectedRound: 4, description: "Single guess per round" },
        { currentGuess: 1, currentRound: 2, guessesPerRound: 2, maxRounds: 3, timePerGuess: 45, nSecondsLastGuessAgo: 90, expectedGuess: 1, expectedRound: 3, description: "Two guesses per round" },
        { currentGuess: 1, currentRound: 1, guessesPerRound: 12, maxRounds: 2, timePerGuess: 10, nSecondsLastGuessAgo: 60, expectedGuess: 7, expectedRound: 1, description: "Many guesses per round" },
        { currentGuess: 1, currentRound: 1, guessesPerRound: 5, maxRounds: 3, timePerGuess: 120, nSecondsLastGuessAgo: 300, expectedGuess: 3, expectedRound: 1, description: "Long time per guess" },
        { currentGuess: 2, currentRound: 1, guessesPerRound: 3, maxRounds: 8, timePerGuess: 40, nSecondsLastGuessAgo: 125, expectedGuess: 2, expectedRound: 2, description: "Fractional with remainder (125/40 = 3.125)" },
    ];

    test.each(testCases)(
        "$description - Round $currentRound, Guess $currentGuess → Round $expectedRound, Guess $expectedGuess",
        ({ currentGuess, currentRound, guessesPerRound, maxRounds, timePerGuess, nSecondsLastGuessAgo, expectedGuess, expectedRound }) => {
            const currentUnixTimeStamp_sec = Math.floor(Date.now() / 1000);
            const lastGuessUnixTimeStamp_sec = currentUnixTimeStamp_sec - nSecondsLastGuessAgo;
            
            const result = GameTimeOffsetTracker.calculate({
                currentGuessNumber: currentGuess,
                currentRoundNumber: currentRound,
                guessesPerRound: guessesPerRound,
                maxRounds: maxRounds,
                lastGuessUnixUtcTimeStamp_InSeconds: lastGuessUnixTimeStamp_sec,
                timePerGuess: timePerGuess
            });

            expect(result?.actualGuess).toBe(expectedGuess);
            expect(result?.actualRound).toBe(expectedRound);
        }
    );
});

describe("GameTimeOffsetTracker - Different Game Configurations", () => {
    const testCases = [
        // Wordle-style: 6 guesses, 1 round
        { currentGuess: 3, currentRound: 1, guessesPerRound: 6, maxRounds: 1, timePerGuess: 60, nSecondsLastGuessAgo: 120, expectedGuess: 5, expectedRound: 1, description: "Classic Wordle config" },
        { currentGuess: 5, currentRound: 1, guessesPerRound: 6, maxRounds: 1, timePerGuess: 60, nSecondsLastGuessAgo: 90, expectedGuess: 6, expectedRound: 1, description: "Wordle - cap at last guess" },
        
        // Marathon: Many guesses, few rounds
        { currentGuess: 5, currentRound: 1, guessesPerRound: 15, maxRounds: 2, timePerGuess: 45, nSecondsLastGuessAgo: 225, expectedGuess: 10, expectedRound: 1, description: "Marathon round config" },
        { currentGuess: 12, currentRound: 1, guessesPerRound: 15, maxRounds: 2, timePerGuess: 30, nSecondsLastGuessAgo: 150, expectedGuess: 2, expectedRound: 2, description: "Marathon cross to round 2" },
        
        // Blitz mode: Very fast
        { currentGuess: 1, currentRound: 1, guessesPerRound: 8, maxRounds: 5, timePerGuess: 5, nSecondsLastGuessAgo: 25, expectedGuess: 6, expectedRound: 1, description: "Blitz mode timing" },
        { currentGuess: 7, currentRound: 2, guessesPerRound: 8, maxRounds: 5, timePerGuess: 5, nSecondsLastGuessAgo: 40, expectedGuess: 7, expectedRound: 3, description: "Blitz cross rounds" },
    ];

    test.each(testCases)(
        "$description - Round $currentRound, Guess $currentGuess → Round $expectedRound, Guess $expectedGuess",
        ({ currentGuess, currentRound, guessesPerRound, maxRounds, timePerGuess, nSecondsLastGuessAgo, expectedGuess, expectedRound }) => {
            const currentUnixTimeStamp_sec = Math.floor(Date.now() / 1000);
            const lastGuessUnixTimeStamp_sec = currentUnixTimeStamp_sec - nSecondsLastGuessAgo;
            
            const result = GameTimeOffsetTracker.calculate({
                currentGuessNumber: currentGuess,
                currentRoundNumber: currentRound,
                guessesPerRound: guessesPerRound,
                maxRounds: maxRounds,
                lastGuessUnixUtcTimeStamp_InSeconds: lastGuessUnixTimeStamp_sec,
                timePerGuess: timePerGuess
            });

            expect(result?.actualGuess).toBe(expectedGuess);
            expect(result?.actualRound).toBe(expectedRound);
        }
    );
});

describe("GameTimeOffsetTracker - Error Cases", () => {
    const errorTestCases = [
        { currentGuess: 1, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: 0, nSecondsLastGuessAgo: 30, description: "Zero timePerGuess" },
        { currentGuess: 1, currentRound: 1, guessesPerRound: 6, maxRounds: 3, timePerGuess: -10, nSecondsLastGuessAgo: 30, description: "Negative timePerGuess" },
    ];

    test.each(errorTestCases)(
        "Should throw error for $description",
        ({ currentGuess, currentRound, guessesPerRound, maxRounds, timePerGuess, nSecondsLastGuessAgo }) => {
            const currentUnixTimeStamp_sec = Math.floor(Date.now() / 1000);
            const lastGuessUnixTimeStamp_sec = currentUnixTimeStamp_sec - nSecondsLastGuessAgo;
            
            expect(() => {
                GameTimeOffsetTracker.calculate({
                    currentGuessNumber: currentGuess,
                    currentRoundNumber: currentRound,
                    guessesPerRound: guessesPerRound,
                    maxRounds: maxRounds,
                    lastGuessUnixUtcTimeStamp_InSeconds: lastGuessUnixTimeStamp_sec,
                    timePerGuess: timePerGuess
                });
            }).toThrow('timePerGuess must be positive');
        }
    );
});