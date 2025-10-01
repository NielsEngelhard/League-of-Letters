"use client"

import Avatar from "@/components/ui/Avatar";
import { Clover, ListStart } from "lucide-react";
import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator";
import Button from "@/components/ui/Button";
import { GamePlayerModel } from "@/features/game/game-models";
import KickPlayerFromLobbyCommand from "@/features/lobby/actions/command/kick-player-from-lobby-command";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import Tooltip from "@/components/ui/Tooltip";

interface Props {
    players: GamePlayerModel[];
    hostAccountId?: string;
    gameId?: string;
    gridCols?: string;
    accountIdPlayerThatStartsNextRound?: string;
    accountIdPlayerThatHasNextTurn?: string;
    accountIdCurrentPlayer?: string;
    isInGame?: boolean;
    t?: InGameTranslations;
    includeKickOption?: boolean;
}

export default function PlayerGrid({ 
    players, 
    hostAccountId, 
    gameId, 
    gridCols = "grid-cols-1",
    accountIdPlayerThatHasNextTurn,
    accountIdPlayerThatStartsNextRound,
    accountIdCurrentPlayer,
    isInGame = true,
    includeKickOption = false,
    t
}: Props) {    
    const handleKickPlayer = async (accountIdToKick: string) => {
        if (!gameId) return;
        await KickPlayerFromLobbyCommand({
            accountIdToKick: accountIdToKick,
            lobbyId: gameId
        });
    };

    return (
        <div className={`space-y-3 grid ${gridCols} gap-2`}>
            {players.map((player, index) => {
                const isCurrentPlayer = player.accountId === accountIdCurrentPlayer;
                const isHost = player.accountId === hostAccountId;
                const hasNextTurn = player.accountId === accountIdPlayerThatHasNextTurn;
                const startsNextRound = player.accountId === accountIdPlayerThatStartsNextRound;

                return (
                    <Tooltip content={player.username} key={player.accountId}>
                        <div 
                            key={index} 
                            className={`
                                group relative flex items-center gap-4 p-2 md:px-4 rounded-xl border transition-all duration-200
                                ${isCurrentPlayer 
                                    ? 'bg-primary/10 border-primary/30 shadow-md' 
                                    : 'bg-backbround-secondary border-border hover:shadow-sm'
                                }
                            `}
                        >
                            {/* Left side - Avatar and main info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Avatar with indicators */}
                                <div className="relative">
                                    <Avatar 
                                        colorHex={player.colorHex} 
                                    >
                                        <div className="text-md font-bold">
                                            {player.username.charAt(0).toUpperCase()}
                                        </div>
                                    </Avatar>
                                </div>

                                {/* Username and role */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-foreground text-xs md:text-md truncate">
                                            {player.username}
                                        </span>
                                        
                                        {/* Special indicators */}
                                        <div className="flex gap-1">
                                            {hasNextTurn && t && (
                                                <Tooltip content={t.tooltip.hasNextGuess} position="bottom">
                                                    <Clover className="w-4 h-4 text-secondary" />
                                                </Tooltip>
                                            )}
                                            
                                            {startsNextRound && t && (
                                                <Tooltip content={t.tooltip.startsNextRound} position="bottom">
                                                    <ListStart className="w-4 h-4 text-primary" />
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Position and connection status */}
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1">
                                            <WebSocketStatusIndicator
                                                showText={false}
                                                connectionStatus={player.connectionStatus}
                                            />
                                            {(!isHost && includeKickOption) && (
                                                <Button 
                                                    variant="errorLight" 
                                                    size="sm" 
                                                    className="group-hover:opacity-100 transition-opacity px-1.5 py-0.5 text-xs h-5 flex-shrink-0"
                                                    corners="square"
                                                    onClick={() => handleKickPlayer(player.accountId)}
                                                >
                                                    Kick
                                                </Button>  
                                            )}           

                                            {isCurrentPlayer && (
                                                <span className="text-xs font-bold text-primary">{t?.isCurrentTurn}</span>  
                                            )}                         
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Score and actions */}
                            <div className="flex items-center gap-4">
                                {/* Score */}
                                {isInGame && (
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-primary">
                                            {player.score}
                                        </div>
                                        <div className="text-xs text-foreground">
                                            {t?.overview.points || 'pts'}
                                        </div>
                                    </div>                                
                                )}
                            </div>
                        </div>                        
                    </Tooltip>
                );
            })}
        </div>
    );
}