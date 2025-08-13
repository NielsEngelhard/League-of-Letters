import { Router, Unplug } from "lucide-react";
import { GamePlayerModel } from "../../game-models";

interface Props {
    players: GamePlayerModel[];
}

export default function GameConnectionStatusIndicator({ players }: Props) {

    const disconnectedPlayers: GamePlayerModel[] = players.filter(p => p.connectionStatus != "connected");

    return (
        <div className="font-semibold text-xs flex flex-row gap-2">
            {disconnectedPlayers.length > 0 ? (
                disconnectedPlayers.map((dp, i) => {
                    return <span className="text-error flex flex-row items-center">
                        <Unplug size={14} />
                        {dp.username}
                    </span>
                })
            ): (
                <span className="text-success flex flex-row items-top gap-0.5">
                    <Router size={14} />
                    All connected
                </span>
            )}
        </div>
    )
}