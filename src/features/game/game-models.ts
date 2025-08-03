export interface ActiveGameModel {
    id: string;
    wordLength: number;
    currentRound: number;
    totalRounds: number;
}

// Data that is send when the current round has ended
export interface RoundTransitionData {    
    currentWord: string;
    isEndOfGame: boolean;
    nextRoundFirstLetter?: string;    
}