import { TurnTrackerAlgorithm } from "../turn-tracker";

describe("Determine whose turn it is with time being a factor - so based on time difference other players have a turn while the current_round and current_guess indexes are the same", () => {
    const testCases = [
        { secondsBetweenLastGuess: 0, secondsPerGuess: 20, expectedPlayerId: "1" },
        { secondsBetweenLastGuess: 21, secondsPerGuess: 20, expectedPlayerId: "2" },
        { secondsBetweenLastGuess: 41, secondsPerGuess: 20, expectedPlayerId: "3" },
        { secondsBetweenLastGuess: 61, secondsPerGuess: 20, expectedPlayerId: "1" },
    ];

    const playerIds = ["1", "2", "3"];
    const round = 1;
    const guess = 1;

    test.each(testCases)(
        "TESTCASE: lastGuessUnixTimestamp: '$lastGuessUnixTimestamp' | expectedPlayerId '$expectedPlayerId'",
        ({ secondsBetweenLastGuess, secondsPerGuess, expectedPlayerId }) => {
            const result = TurnTrackerAlgorithm.determineWhosTurnItIs({
                currentGuess: guess,
                currentRound: round,
                playerIdsInOrder: playerIds,
                secondsBetweenLastGuess: secondsBetweenLastGuess,
                secondsPerGuess: secondsPerGuess
            });
            
            expect(result).toBe(expectedPlayerId);
        }
    );
});