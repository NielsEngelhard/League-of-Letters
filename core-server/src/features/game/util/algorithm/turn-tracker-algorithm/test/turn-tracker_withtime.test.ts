import { TurnTrackerAlgorithm } from "../turn-tracker";

describe("Determine whose turn it is with time being a factor - so based on time difference other players have a turn while the current_round and current_guess indexes are the same", () => {
    const testCases = [
        { secondsBetweenLastGuess: 0, secondsPerGuess: 20, expectedPlayerId: "1" },     // 0-20
        { secondsBetweenLastGuess: 21, secondsPerGuess: 20, expectedPlayerId: "2" },    // 20-40
        { secondsBetweenLastGuess: 42, secondsPerGuess: 20, expectedPlayerId: "3" },    // 40-60
        { secondsBetweenLastGuess: 79, secondsPerGuess: 20, expectedPlayerId: "1" },    // 60-80
        { secondsBetweenLastGuess: 80, secondsPerGuess: 20, expectedPlayerId: "2" },    // 80-100
        { secondsBetweenLastGuess: 105, secondsPerGuess: 20, expectedPlayerId: "3" },   // 100-120
        { secondsBetweenLastGuess: 123, secondsPerGuess: 20, expectedPlayerId: "1" },   // 120-140
        { secondsBetweenLastGuess: 157, secondsPerGuess: 20, expectedPlayerId: "2" },   // 140-160
        { secondsBetweenLastGuess: 161, secondsPerGuess: 20, expectedPlayerId: "3" },   // 160-180
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