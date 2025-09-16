import Card from "@/components/ui/card/Card";
import { ActiveGameTeaserModel } from "../game-models";
import Button from "@/components/ui/Button";
import { ArrowUpAZ, Clock, MonitorDot, User, Users } from "lucide-react";
import { timeAgo } from "@/lib/time-util";
import { CREATE_MULTIPLAYER_GAME_ROUTE, JOIN_GAME_ROUTE, LANGUAGE_ROUTE, PLAY_ONLINE_GAME_ROUTE, PLAY_SOLO_GAME_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GetLanguageStyle } from "@/features/language/LanguageStyles";

interface Props {    
    teaser: ActiveGameTeaserModel;
    lang: SupportedLanguage;
    currentPlayerAccountId: string;
}

export default function GameTeaserCard({ teaser, lang, currentPlayerAccountId }: Props) {
    const languageStyle = GetLanguageStyle(teaser.language);

    function determineReconnectRoute(): string {
        // Lobby
        if (teaser.isLobby) {
            if (teaser.hostAccountId == currentPlayerAccountId) {
                return CREATE_MULTIPLAYER_GAME_ROUTE;
            } else {
                return JOIN_GAME_ROUTE(teaser.id);
            }
        }

        // Active game
        if (teaser.gameMode == "solo") {
            return PLAY_SOLO_GAME_ROUTE(teaser.id);
        } else {
            return PLAY_ONLINE_GAME_ROUTE(teaser.id);
        }
    }

    return (
        <Card>
            <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-2">
                {/* Left */}
                <div className="flex flex-row gap-3 items-center text-start">
                    
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-background flex-shrink-0">
                        {teaser.isLobby ? (
                            <MonitorDot className="w-4 h-4" />
                        ) : (
                            teaser.gameMode == "online" ? (
                                <Users className="w-4 h-4" />
                            ) : (
                                <User className="w-4 h-4" />
                            )                           
                        )}
                    </div>

                    {/* Name */}
                    {teaser.isLobby ? (
                        // Lobby
                        <span className="font-bold text-sm">
                            Lobby
                        </span>
                    ): (
                        // Active game
                        <div className="flex flex-col min-w-0 flex-1">                     
                            <span className="font-bold text-sm">
                                {teaser.gameMode == "online" ? (
                                    <>Online Game</>
                                ) : (
                                    <>Solo Game</>
                                )}                            
                            </span>
                            <span className="font-medium text-foreground-muted text-xs">
                                {teaser.currentRoundIndex}/{teaser.totalRounds}
                            </span>
                        </div>                        
                    )}
                </div>

                {/* Right */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 sm:items-center">
                    <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                        <span className="text-foreground-muted text-xs flex truncate items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(teaser.createdAt)}
                        </span>

                        <div className="sm:order-last">
                            {languageStyle?.flag}
                        </div>
                    </div>

                    <Button variant="secondary" size="sm" href={LANGUAGE_ROUTE(lang, determineReconnectRoute())} className="w-full sm:w-auto">
                        <ArrowUpAZ className="w-4 h-4" />
                        Reconnect
                    </Button>                    
                </div>
            </div>
        </Card>
    )
}