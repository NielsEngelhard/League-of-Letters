export interface DetermineWhosTurnItIsData {
    playerIdsInOrder: string[];
    currentRound: number;
    currentGuess: number;
    secondsBetweenLastGuess?: number;
    secondsPerGuess?: number;
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

        const startingPlayerIndex = determineStartingPlayerForRound(data.currentRound, nPlayers);
        
        const currentGuessOffset = determinePlayerOffsetForCurrentGuess(data.currentGuess, nPlayers);
        
        // Calculate the final index, ensuring it wraps around properly
        const currentPlayerIndex = determineCurrentPlayerIndexByCurrentRoundAndCurrentGuess(startingPlayerIndex, currentGuessOffset, nPlayers);
        
        return data.playerIdsInOrder[currentPlayerIndex];
    }
}

// Calculate who starts the round (0-based index)
// For round 1, player 0 starts
// For round 2, player 1 starts, etc.
function determineStartingPlayerForRound(currentRoundIndex: number, nPlayers: number) {
    return (currentRoundIndex - 1) % nPlayers;
}

// Calculate the current player based on the starting player and current guess
// Subtract 1 from currentGuess to get 0-based indexing for guesses
function determinePlayerOffsetForCurrentGuess(currentGuessIndex: number, nPlayers: number) {
    return (currentGuessIndex - 1) % nPlayers;
}

// Calculate the final index
function determineCurrentPlayerIndexByCurrentRoundAndCurrentGuess(startingPlayerIndex: number, currentGuessOffset: number, nPlayers: number) {
    return (startingPlayerIndex + currentGuessOffset) % nPlayers;
}