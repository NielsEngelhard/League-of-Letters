import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { GamePlayerModel } from "../../game-models";
import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator";

interface Props {
    player: GamePlayerModel;
    t: InGameTranslations;
    isCurrentPlayer?: boolean;
}

export default function InGamePlayerCard({ player, t, isCurrentPlayer = false }: Props) {
    return (
        <div
        key={player.accountId}
        className={`
            relative px-2 py-0.5 rounded-lg border transition-all duration-200
            ${isCurrentPlayer
            ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary ring-1 ring-primary' 
            : 'border-border bg-background'
            }
        `}
        >
        <div className="flex items-center justify-between gap-1.5">
            <WebSocketStatusIndicator connectionStatus={player.connectionStatus} showText={false} />

            <div className="flex-1 truncate">
                <p className="text-sm font-semibold text-foreground/80">
                    {player.username}
                </p>
            </div>
            
            <div className="flex gap-0.5 items-center">
            <span className='font-monos text-foreground font-semibold'>
                {player.score}
            </span>
            <span className='text-foreground-muted text-xs'>
                pts
            </span>
            </div>
        </div>
        </div>
    )
}