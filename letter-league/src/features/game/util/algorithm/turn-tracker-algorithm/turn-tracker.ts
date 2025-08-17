export interface DetermineWhosTurnItIsData {
    playerIdsInOrder: string[];
    currentRound: number;
    currentGuess: number;
    secondsBetweenLastGuess?: number;
    secondsPerGuess?: number | null;
}

export class TurnTrackerAlgorithm {
    static determineWhosTurnItIs(data: DetermineWhosTurnItIsData): string {
        if (!data.playerIdsInOrder || data.playerIdsInOrder.length === 0) {
            throw new Error("No player ids provided");
        }
        
        if (data.playerIdsInOrder.length === 1) {
            return data.playerIdsInOrder[0];
        }
        
        const nPlayers = data.playerIdsInOrder.length;

        const startingPlayerIndex = calculateStartingPlayerForRound(data.currentRound, nPlayers);
        
        const currentGuessOffset = calculatePlayerOffsetForCurrentGuess(data.currentGuess, nPlayers);
        
        const currentPlayerIndexByRoundAndGuessIndex = calculateCurrentPlayerIndexByCurrentRoundAndCurrentGuess(startingPlayerIndex, currentGuessOffset, nPlayers);
        
        const withoutTime: boolean = (!data.secondsBetweenLastGuess || !data.secondsPerGuess);
        if (withoutTime) {
            return data.playerIdsInOrder[currentPlayerIndexByRoundAndGuessIndex];
        }

        const passedTimeOffset = calculateTimePassedOffset(data.secondsPerGuess!, data.secondsBetweenLastGuess!);
        const playerIndexAdjustedWithTimeOffset = (currentPlayerIndexByRoundAndGuessIndex + passedTimeOffset) % nPlayers;

        return data.playerIdsInOrder[playerIndexAdjustedWithTimeOffset];
    }
}

// Calculate who starts the round (0-based index)
// For round 1, player 0 starts
// For round 2, player 1 starts, etc.
function calculateStartingPlayerForRound(currentRoundIndex: number, nPlayers: number) {
    return (currentRoundIndex - 1) % nPlayers;
}

// Calculate the current player based on the starting player and current guess
// Subtract 1 from currentGuess to get 0-based indexing for guesses
function calculatePlayerOffsetForCurrentGuess(currentGuessIndex: number, nPlayers: number) {
    return (currentGuessIndex - 1) % nPlayers;
}

// Calculate the final index
function calculateCurrentPlayerIndexByCurrentRoundAndCurrentGuess(startingPlayerIndex: number, currentGuessOffset: number, nPlayers: number) {
    return (startingPlayerIndex + currentGuessOffset) % nPlayers;
}

function calculateTimePassedOffset(secondsPerGuess: number, secondsBetweenLastGuess: number) {
    if (secondsBetweenLastGuess < secondsPerGuess) return 0;

    return Math.floor(secondsBetweenLastGuess / secondsPerGuess);
}
