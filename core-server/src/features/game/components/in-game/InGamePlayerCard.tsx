import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { GamePlayerModel } from "../../game-models";
import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator";

interface Props {
    player: GamePlayerModel;
    t: InGameTranslations;
    isCurrentTurn?: boolean;
    turnOrder?: number;
    height?: "sm" | "md" | "lg";
    startsNextRound?: boolean;
}

export default function InGamePlayerCard({ player, t, turnOrder = 1, isCurrentTurn = true, height = "lg", startsNextRound = true }: Props) {
    
    function getHeight() {
        switch (height) {
            case "sm":
                return "py-1.5";
            case "md":
                return "py-2";
            case "lg":
                return "py-3";                                
        }
    }

    return (
        <div
            key={player.accountId}
            className={`
                relative px-4 ${getHeight()} rounded-r-xl transition-all duration-300 ease-out border-l-4 border-l-primary
                ${isCurrentTurn
                    ? 'bg-primary/10 border border-primary font-bold' 
                    : 'bg-background border border-border'
                }
            `}
        >
            <div className="flex items-center gap-2">
                {/* Turn order indicator */}
                {turnOrder && (
                    <div className="text-sm font-bold">
                        {turnOrder}
                    </div>
                )}

                {/* Connection status */}
                <div className="flex-shrink-0">
                    <WebSocketStatusIndicator 
                        connectionStatus={player.connectionStatus} 
                        showText={false} 
                    />
                </div>

                {/* Username - takes up remaining space */}
                <div className="flex-1 min-w-0">
                    <p className={`
                        text-sm font-medium truncate
                        ${isCurrentTurn ? 'text-primary' : 'text-foreground'}
                    `}>
                        {player.username}asdasdsaasdsadsdasd
                    </p>
                </div>

                {/* Score section */}
                <div className="flex-shrink-0 flex items-baseline gap-1">
                    <span className={`
                        text-lg font-bold tabular-nums
                        ${isCurrentTurn ? 'text-primary' : 'text-foreground'}
                    `}>
                        {player.score}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                        {t.overview.points}
                    </span>
                </div>
            </div>

            {startsNextRound && (
                <div className="absolute bottom-0.5 right-3 z-20 text-xs text-primary/80 font-bold">
                    {t.tooltip.startsNextRound}
                </div>                
            )}
        </div>
    );
}