import PopupCard from "@/components/ui/card/PopupCard";

interface Props {
    currentRoundIndex: number;
    totalRounds: number;
}

export default function GameProgressionBar({ currentRoundIndex, totalRounds }: Props) {
    return (
        <PopupCard>
            <>
                <div className="flex items-center justify-between">
                    {/* Game Stats */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-foreground">
                                    Round {currentRoundIndex}/{totalRounds}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground-muted">Time:</span>
                            <span className="text-sm font-mono text-bold">∞</span>
                        </div>
                    </div>

                    {/* Round Progress Indicator */}
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="flex gap-1">
                            {Array.from({ length: totalRounds }, (_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        i + 1 === currentRoundIndex
                                            ? "bg-primary scale-125"
                                            : i + 1 < currentRoundIndex
                                            ? "bg-success"
                                            : "bg-foreground-muted"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentRoundIndex / totalRounds) * 100}%` }}
                    />
                </div>            
            </>
        </PopupCard>        
    )
}