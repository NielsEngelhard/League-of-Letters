export default interface InGameTranslations {
    round: "Round",
    time: "Time",
    theWordWas: "The word was",
    letterState: {
        correct: "correct",
        close: "close",
        wrong: "wrong"
    },
    overview: {
        title: "Game Overview",
        points: "points",
        leaveBtn: "Leave Game",
        playAgainBtn: "Play Again",
        scenarios: {
            solo: {
                subTxt: "Results"
            },
            duo: {
                subTxt: "Duel Results",
                winner: "WINNER",
                loser: "LOSER"
            },
            online: {
                subTxt: "Game Results",
                firstPlace: "Champion",
                secondPlace: "Runner-up",
                thirdPlace: "Third place",
                otherPlace: "Tried"
            }
        }
    }
}