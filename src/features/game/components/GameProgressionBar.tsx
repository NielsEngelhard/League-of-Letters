interface Props {
    currentRoundIndex: number;
    totalRounds: number;

}

export default function GameProgressionBar({ currentRoundIndex, totalRounds }: Props) {
    return (
        <div className="w-full bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
                {/* Game Stats */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-gray-700">
                                Round {currentRoundIndex}/{totalRounds}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Score:</span>
                        <span className="text-sm font-bold text-blue-600">100</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Time:</span>
                        <span className="text-sm font-mono text-gray-700">∞</span>
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
                                        ? "bg-blue-500 scale-125"
                                        : i + 1 < currentRoundIndex
                                        ? "bg-green-400"
                                        : "bg-gray-200"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentRoundIndex / totalRounds) * 100}%` }}
                />
            </div>
        </div>        
    )
}