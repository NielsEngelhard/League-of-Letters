import LetterRowGrid from "@/features/word/components/LetterRowGrid";
import ActiveGameWordInput from "./ActiveGameWordInput";
import { useActiveGame } from "./active-game-context";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";

interface Props {}

export default function GameBoard({}: Props) {
    const { currentRoundIndex, totalRounds, submitGuess, wordLength, currentRound, maxAttemptsPerRound, players } = useActiveGame();
    const { authSession } = useAuth();
    const [canGuess, setCanGuess] = useState(true);
    const [currentGuess, setCurrentGuess] = useState<string>("");

    async function onSubmitGuess() {
        setCanGuess(false);
        submitGuess(currentGuess, authSession?.secretKey ?? "??")
            .then(() => {
                setCurrentGuess("");
            })
            .finally(() => {
                setCanGuess(true);
            });
    }

    // Mock players data - replace with actual players from context
    const mockPlayers = [
        { id: "1", username: "You", score: 100, isCurrentPlayer: true },
        { id: "2", username: "Player2", score: 85, isCurrentPlayer: false },
        { id: "3", username: "Player3", score: 92, isCurrentPlayer: false },
    ];

    return (
        <div className="w-full flex flex-col items-center gap-6 max-w-2xl mx-auto">
            {/* Modern Game Header */}
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

            {/* Players List */}
            <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        Players ({mockPlayers.length})
                    </h3>
                    <div className="text-xs text-gray-500">Live</div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {mockPlayers.map((player, index) => (
                        <div
                            key={player.id}
                            className={`
                                relative overflow-hidden rounded-xl p-3 transition-all duration-200
                                ${player.isCurrentPlayer
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md"
                                    : "bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                                }
                            `}
                        >
                            {/* Player indicator */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`
                                        w-2 h-2 rounded-full
                                        ${player.isCurrentPlayer ? "bg-blue-500 animate-pulse" : "bg-green-400"}
                                    `} />
                                    <span className={`
                                        text-sm font-medium truncate
                                        ${player.isCurrentPlayer ? "text-blue-800" : "text-gray-700"}
                                    `}>
                                        {player.username}
                                        {player.isCurrentPlayer && (
                                            <span className="ml-1 text-xs text-blue-600">(You)</span>
                                        )}
                                    </span>
                                </div>
                                
                                <div className={`
                                    text-xs font-bold
                                    ${player.isCurrentPlayer ? "text-blue-600" : "text-gray-600"}
                                `}>
                                    {player.score}
                                </div>
                            </div>

                            {/* Ranking indicator */}
                            <div className="absolute top-1 right-1">
                                <div className={`
                                    w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold
                                    ${index === 0 ? "bg-yellow-100 text-yellow-600" : 
                                      index === 1 ? "bg-gray-100 text-gray-600" : 
                                      index === 2 ? "bg-orange-100 text-orange-600" : 
                                      "bg-gray-50 text-gray-500"}
                                `}>
                                    {index + 1}
                                </div>
                            </div>

                            {/* Current player glow effect */}
                            {player.isCurrentPlayer && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-xl" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Game Grid */}
            <div className="w-full flex justify-center">
                <LetterRowGrid
                    currentGuess={currentGuess}
                    maxNGuesses={maxAttemptsPerRound}
                    preFilledRows={currentRound.guesses}
                    wordLength={wordLength}
                />
            </div>

            {/* Word Input */}
            <div className="w-full max-w-md">
                <ActiveGameWordInput
                    currentGuess={currentGuess}
                    wordLength={wordLength}
                    onChange={setCurrentGuess}
                    onEnter={onSubmitGuess}
                    disabled={!canGuess}
                />
            </div>

            {/* Game Status Indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Game Active</span>
                </div>
                <span>•</span>
                <span>Attempt {currentRound.guesses?.length || 0}/{maxAttemptsPerRound}</span>
            </div>
        </div>
    );
}