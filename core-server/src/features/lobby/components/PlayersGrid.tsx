"use client"

import Avatar from "@/components/ui/Avatar";
import { Crown } from "lucide-react";
import { useActiveGame } from "@/features/game/components/active-game-context";
import WebSocketStatusIndicator from "@/features/realtime/WebSocketStatusIndicator";
import Card from "@/components/ui/card/Card";
import KickPlayerFromLobbyCommand from "../actions/command/kick-player-from-lobby-command";
import Button from "@/components/ui/Button";

interface Props {
    hostAccountId?: string;
    lobbyId?: string;
    includeKickOption?: boolean;
    gridCols?: string;
}

export default function PlayerGrid({ hostAccountId, lobbyId, includeKickOption = false, gridCols }: Props) {
    const { players } = useActiveGame();
    
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
                    className={`relative p-2 border-t-2 ${player.connectionStatus == "connected" ? "border-t-success" : "border-t-error bg-error/10"}`}
                >
                    <div className="flex flex-col items-center text-center space-y-1.5">
                        <Avatar>
                            <div className="text-sm font-medium">
                                {player.username.charAt(0)}
                            </div>
                        </Avatar>
                        
                        <div className="flex items-center gap-1 mx-2 w-full truncate">
                            <span className="text-xs md:text-sm font-medium text-center w-full">
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

                    {/* Host indicator */}
                    {player.accountId == hostAccountId && (
                        <div className="absolute top-2 left-2">
                            <Crown className="w-3 h-3 text-warning flex-shrink-0" />
                        </div>
                    )}                    
                </Card>
            ))}
        </div>
    );
}