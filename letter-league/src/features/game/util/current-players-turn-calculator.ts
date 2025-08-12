
// TODO: VOOR MORGEN HIER JEST TEST WANT IK DENK DAT HET ZO IS DAT 0 1 ARRAY GEDOE ER IS
export class DetermineCurrentPlayerAlgorithm {
    static execute(playerIdsInOrder: string[], currentRound: number, currentGuess: number) {
        if (!playerIdsInOrder || playerIdsInOrder.length === 0) {
            throw new Error("No player ids provided");
        }
        if (playerIdsInOrder.length === 1) {
            return playerIdsInOrder[0];
        }

        const numberOfPlayers = playerIdsInOrder.length;

        // Determine who starts this round
        const startingPlayerIndex = (currentRound - 1) % numberOfPlayers;

        // Determine current player based on guess offset
        const currentPlayerIndex = (startingPlayerIndex + currentGuess) % numberOfPlayers;

        return playerIdsInOrder[currentPlayerIndex];
    }
}
