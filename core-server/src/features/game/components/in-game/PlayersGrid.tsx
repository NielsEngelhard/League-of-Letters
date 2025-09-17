"use client"

import Avatar from "@/components/ui/Avatar";
import { Clover, Crown, ListStart } from "lucide-react";
import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/Button";
import { GamePlayerModel } from "@/features/game/game-models";
import KickPlayerFromLobbyCommand from "@/features/lobby/actions/command/kick-player-from-lobby-command";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import Tooltip from "@/components/ui/Tooltip";

interface Props {
    players: GamePlayerModel[];
    hostAccountId?: string;
    lobbyId?: string;
    includeKickOption?: boolean;
    gridCols?: string;
    accountIdPlayerThatStartsNextRound?: string;
    accountIdPlayerThatHasNextTurn?: string;
    accountIdCurrentPlayer?: string;
    t?: InGameTranslations;
}

export default function PlayerGrid({ players, hostAccountId, lobbyId, includeKickOption = false, gridCols, accountIdPlayerThatHasNextTurn, accountIdPlayerThatStartsNextRound, accountIdCurrentPlayer, t }: Props) {    
    const handleKickPlayer = async (accountIdToKick: string) => {
        if (!lobbyId) return;
        await KickPlayerFromLobbyCommand({
            accountIdToKick: accountIdToKick,
            lobbyId: lobbyId
        });
    };

    return (
        <div className={`grid gap-3 ${gridCols ? gridCols : "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"}`}>
            {players.map((player, index) => (
                <Card 
                    key={index} 
                    className={`
                        relative p-2 border-t-2
                        ${player.connectionStatus == "disconnected" ? `border-t-error bg-error/10` : "border-t-success"}
                        ${player.accountId == accountIdCurrentPlayer ? "bg-primary/10" : ""}
                        `}                    
                >
                    <div className="flex flex-col items-center text-center space-y-1.5">
                        <Avatar colorHex={player.colorHex}>
                            <div className="text-sm font-extrabold">
                                {player.username.charAt(0)}
                            </div>
                        </Avatar>
                        
                        <div className="flex items-center gap-1 mx-2 w-full truncate">
                            <span className="text-xs md:text-sm font-medium text-center w-full flex flex-row items-center gap-0.5 justify-center">

                                {/* Host indicator */}
                                {player.accountId == hostAccountId && <Crown className="w-3 h-3 text-warning flex-shrink-0 hidden md:flex" />}

                                {/* Username */}
                                <span>{player.username}</span>
                            </span>
                        </div>
                        
                        {includeKickOption && (
                            <div className="flex items-center justify-center gap-1.5">                                    
                                {player.accountId != hostAccountId ? (
                                    <Button 
                                        variant="errorLight" 
                                        size="sm" 
                                        className="px-1.5 py-0.5 text-xs h-5 flex-shrink-0" 
                                        corners="square" 
                                        onClick={() => handleKickPlayer(player.accountId)}
                                    >
                                        Kick
                                    </Button>
                                ) : 
                                <span className="text-primary font-bold">You</span>
                            }
                            </div>
                        )}
                    </div>
                    
                    {/* Online status indicator */}
                    <div className="absolute top-2 right-2">
                        <WebSocketStatusIndicator
                            showText={false}
                            connectionStatus={player.connectionStatus}
                        />
                    </div>

                    {/* Position */}
                    <div className="absolute bottom-1 right-2">
                        <span className="text-xs font-medium">{index + 1}</span>
                    </div>                    

                    {/* Indicators */}
                    <div className="absolute top-2 left-2 z-50 flex flex-row gap-2">
                        {(t && player.accountId == accountIdPlayerThatHasNextTurn) && (
                            <Tooltip content={t.tooltip.hasNextGuess} className="text-secondary" position="bottom">
                                <Clover size={18} />
                            </Tooltip>
                        )}

                        {(t && player.accountId == accountIdPlayerThatStartsNextRound) && (
                            <Tooltip content={t.tooltip.startsNextRound} className="text-primary" position="bottom">
                                <ListStart size={18} />
                            </Tooltip>
                        )}
                    </div>                                 
                </Card>
            ))}
        </div>
    );
}