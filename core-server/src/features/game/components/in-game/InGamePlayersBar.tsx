import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import { GamePlayerModel } from "../../game-models";
import InGameConnectionStatusIndicator from "./InGameConnectionStatusIndicator";
import InGamePlayerCard from "./InGamePlayerCard";

interface Props {
    players: GamePlayerModel[];
    currentPlayerId?: string;
    playersLabel: string;
}

export default function InGamePlayerBar({ players, currentPlayerId, playersLabel }: Props) {

    const disconnectedPlayers: GamePlayerModel[] = players.filter(p => p.connectionStatus != "connected");
    const isSoloGame: boolean = players.length == 1;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    {isSoloGame ? (
                        <span>
                            {players[0].username}
                        </span>
                    ) : (
                        <>
                        <RealtimeStatusIndicator status={disconnectedPlayers.length == 0 ? "connected" : "disconnected"} />
                        <span>
                            {playersLabel} ({players.length - disconnectedPlayers.length}/{players.length})
                        </span>
                        </>
                    )}
                </h3>
                <div className="flex flex-col gap-1 text-end">
                    {isSoloGame ? (
                        <span className="text-primary/50">{players[0].score}pt</span>
                    ) : (
                        <InGameConnectionStatusIndicator players={players} />
                    )}
                </div>
            </div>
            
            {!isSoloGame && (
                <div className="overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {players.sort((a, b) => b.score - a.score).map((player, index) => (
                            <div key={index} className="flex-shrink-0">
                                <InGamePlayerCard
                                    player={player}
                                    scorePosition={index + 1}
                                    isHisTurn={player.accountId == currentPlayerId}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}