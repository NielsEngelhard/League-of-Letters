import Card from "@/components/ui/card/Card";
import { ActiveGameTeaserModel } from "../game-models";
import { CardHeader } from "@/components/ui/card/card-children";
import Button from "@/components/ui/Button";
import { Clock, Play, User, Users } from "lucide-react";
import { timeAgo } from "@/lib/time-util";
import Link from "next/link";
import { PLAY_GAME_ROUTE } from "@/app/routes";

interface Props {
    teaser: ActiveGameTeaserModel;
}

export default function GameTeaserCard({ teaser }: Props) {
    return (
        <Card>
            <div className="p-2 flex flex-row justify-between">
                {/* Left */}
                <div className="flex flex-row gap-2 items-center justify-center text-start">
                    
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-background">
                        {teaser.gameMode == "online" ? (
                            <Users className="w-4 h-4" />
                        ) : (
                            <User className="w-4 h-4" />
                        )}
                    </div>

                    {/* Name */}
                    <div className="flex flex-col">
                        <span className="font-bold clear-start text-sm">
                            {teaser.gameMode == "online" ? (
                                <>Online Game</>
                            ) : (
                                <>Solo Game</>
                            )}                            
                        </span>
                        <span className="font-medium text-foreground-muted text-xs">Round {teaser.currentRoundIndex}/{teaser.totalRounds}</span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex gap-1 items-center">
                    <span className="text-foreground-muted text-xs flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {timeAgo(teaser.createdAt)} ago
                    </span>

                    <Link href={PLAY_GAME_ROUTE(teaser.id)}>
                        <Button variant="secondary" size="sm">
                            <Play className="w-4 h-4" />
                            Reconnect
                        </Button>                    
                    </Link>
                </div>
            </div>
        </Card>
    )
}