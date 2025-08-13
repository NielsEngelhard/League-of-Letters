export class TurnTrackerAlgorithm {
    static determineWhosTurnItIs(playerIdsInOrder: string[], currentRound: number, currentGuess: number): string {
        if (!playerIdsInOrder || playerIdsInOrder.length === 0) {
            throw new Error("No player ids provided");
        }
        
        if (playerIdsInOrder.length === 1) {
            return playerIdsInOrder[0];
        }
        
        const numberOfPlayers = playerIdsInOrder.length;
        
        // Calculate who starts the round (0-based index)
        // For round 1, player 0 starts
        // For round 2, player 1 starts, etc.
        const startingPlayerIndex = (currentRound - 1) % numberOfPlayers;
        
        // Calculate the current player based on the starting player and current guess
        // Subtract 1 from currentGuess to get 0-based indexing for guesses
        const playerOffset = (currentGuess - 1) % numberOfPlayers;
        
        // Calculate the final index, ensuring it wraps around properly
        const currentPlayerIndex = (startingPlayerIndex + playerOffset) % numberOfPlayers;
        
        return playerIdsInOrder[currentPlayerIndex];
    }
}