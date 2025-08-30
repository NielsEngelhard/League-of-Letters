export default interface InGameTranslations {
    round: string;
    time: string;
    theWordWas: string;
    board: {
        players: string;
        time: string;
        round: string;        
    }    
    overview: {
        title: string;
        points: string;
        leaveBtn: string;
        playAgainBtn: string;
        scenarios: {
            solo: {
                subTxt: string;
            },
            duo: {
                subTxt: string;
                winner: string;
                loser: string;
            },
            online: {
                subTxt: string;
                firstPlace: string;
                secondPlace: string;
                thirdPlace: string;
                otherPlace: string;
            }
        }
    }
}