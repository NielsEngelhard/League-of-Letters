import Card from "@/components/ui/card/Card";
import { RealtimeConnectedPlayer } from "./realtime-models";
import StatusDot from "./StatusDot";

interface Props {
    players: RealtimeConnectedPlayer[];        
}

export default function RealtimeConnectedPlayerList({ players }: Props ) {
    return (
        <div className="flex flex-col gap-2 md:gap-4 p-2">
            {players.map((player, index) => {
                return (
                    <Card key={index}  variant="fade" className={`${player.isHost ? "border-2 border-primary/10" : "border-2 bg-background"}`}>
                        <div className="w-full flex flex-row justify-between">
                            {/* Left */}
                            <div className="flex flex-row gap-1 items-center">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex justify-center items-center">
                                    <span className="font-bold">{player.username[0]}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{player.username}</span>
                                    <span className="text-xs font-medium">
                                        {player.isHost ? (
                                            <span>Host</span>
                                        ) : (
                                            <span>&nbsp;</span>
                                        )}
                                    </span>
                                </div>                                
                            </div>

                            {/* Right */}
                            <div className="flex justify-center items-center">
                                <StatusDot status={player.connectionStatus} />
                            </div>
                        </div>
                    </Card>
                )
            })}    
        </div>  
    )
}