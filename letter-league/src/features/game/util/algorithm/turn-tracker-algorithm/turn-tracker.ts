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
        
        const numberOfPlayers = data.playerIdsInOrder.length;
        
        // Calculate who starts the round (0-based index)
        // For round 1, player 0 starts
        // For round 2, player 1 starts, etc.
        const startingPlayerIndex = (data.currentRound - 1) % numberOfPlayers;
        
        // Calculate the current player based on the starting player and current guess
        // Subtract 1 from currentGuess to get 0-based indexing for guesses
        const playerOffset = (data.currentGuess - 1) % numberOfPlayers;
        
        // Calculate the final index, ensuring it wraps around properly
        const currentPlayerIndex = (startingPlayerIndex + playerOffset) % numberOfPlayers;
        
        return data.playerIdsInOrder[currentPlayerIndex];
    }
}