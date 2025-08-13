import { TurnTrackerAlgorithm } from "../turn-tracker";

describe("Determine whose turn it is with time not being a factor", () => {
    const testCases = [
        { playerIds: ["1", "2", "3"], round: 1, guess: 1, expected: "1" },
        { playerIds: ["1", "2", "3"], round: 2, guess: 2, expected: "3" },
        { playerIds: ["1", "2", "3"], round: 3, guess: 1, expected: "3" },
        { playerIds: ["1", "2"], round: 2, guess: 3, expected: "2" },
        { playerIds: ["1", "2", "3", "4"], round: 2, guess: 3, expected: "4" },
    ];

    test.each(testCases)(
        "TESTCASE: Players: '$playerIds.length' | round '$round' | guess '$guess' | expected '$expected'",
        ({ playerIds, round, guess, expected }) => {
            const result = TurnTrackerAlgorithm.determineWhosTurnItIs(playerIds, round, guess);
            expect(result).toBe(expected);
        }
    );
});

describe("Solo player should return the only player no matter what round or guess it is", () => {
        const playerIds = ["1"];
        
        const testCases = [
            { round: 1, guess: 1 },
            { round: 2, guess: 1 },
            { round: 1, guess: 4 },
            { round: 100, guess: 5 }
        ]

    test.each(testCases)(
        "Validate scenario",
        ({ round, guess }) => {
            const result = TurnTrackerAlgorithm.determineWhosTurnItIs(playerIds, round, guess);
            
            expect(result).toEqual(playerIds[0]);
        });
});    

describe("Game with 2 players", () => {
    it("should have correct first and second turn when sorting on player position", () => {
        const players = [{ userId: "player_one", username: "something1", position: 2 }, { userId: "player_two", username: "something2", position: 1 }];

        const sortedPlayerIds = players
            .slice() // create a copy so original array is not mutated
            .sort((a, b) => a.position - b.position)
            .map(p => p.userId);

        const firstRoundResult = TurnTrackerAlgorithm.determineWhosTurnItIs(sortedPlayerIds, 1, 1);
        expect(firstRoundResult).toBe(players[0].userId);

        const secondRoundResult = TurnTrackerAlgorithm.determineWhosTurnItIs(sortedPlayerIds, 1, 2);
        expect(secondRoundResult).toBe(players[1].userId);
    });        
});