import Card from "@/components/ui/card/Card"
import { useActiveGame } from "../active-game-context"

interface Props {
    
}

export default function PreviousRoundWords() {
    const { game } = useActiveGame();

    return (
        <>
            {game && (
                <div className="flex flex-row gap-2 overflow-x-auto pb-1">
                    {game.rounds
                        .filter(r => r.word)
                        .sort((a, b) => b.roundNumber - a.roundNumber)
                        .map(round => {
                            return (
                                <div key={round.roundNumber} className="flex-shrink-0 border border-border py-1.5 px-3 rounded-lg text-xs">
                                    <span className="text-foreground-muted font-medium">
                                        {round.roundNumber}
                                    </span>
                                    <span className="ml-1.5 font-semibold">
                                        {round.word}
                                    </span>
                                </div>
                            )
                        })}
                </div>            
            )}
        </>
    )
}