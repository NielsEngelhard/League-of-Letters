import Card from "@/components/ui/card/Card";
import { ActiveGameTeaserModel } from "../game-models";
import Button from "@/components/ui/Button";
import { Clock, Play, User, Users } from "lucide-react";
import { timeAgo } from "@/lib/time-util";
import { LANGUAGE_ROUTE, PLAY_ONLINE_GAME_ROUTE, PLAY_SOLO_GAME_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GetLanguageStyle } from "@/features/language/LanguageStyles";

interface Props {
    teaser: ActiveGameTeaserModel;
    lang: SupportedLanguage;
}

export default function GameTeaserCard({ teaser, lang }: Props) {
    const languageStyle = GetLanguageStyle(teaser.language);

    const playGameRoute = teaser.gameMode == "solo" ? PLAY_SOLO_GAME_ROUTE(teaser.id) : PLAY_ONLINE_GAME_ROUTE(teaser.id);

    return (
        <Card>
            <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-2">
                {/* Left */}
                <div className="flex flex-row gap-3 items-center text-start">
                    
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-background flex-shrink-0">
                        {teaser.gameMode == "online" ? (
                            <Users className="w-4 h-4" />
                        ) : (
                            <User className="w-4 h-4" />
                        )}
                    </div>

                    {/* Name */}
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-sm">
                            {teaser.gameMode == "online" ? (
                                <>Online Game</>
                            ) : (
                                <>Solo Game</>
                            )}                            
                        </span>
                        <span className="font-medium text-foreground-muted text-xs">
                            Round {teaser.currentRoundIndex}/{teaser.totalRounds}
                        </span>
                        <span className="font-medium text-foreground-muted text-xs">
                            Language: {languageStyle?.fullName}
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 sm:items-center">
                    <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                        <span className="text-foreground-muted text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(teaser.createdAt)} ago
                        </span>

                        <div className="sm:order-last">
                            {languageStyle?.flag}
                        </div>
                    </div>

                    <Button variant="secondary" size="sm" href={LANGUAGE_ROUTE(lang, playGameRoute)} className="w-full sm:w-auto">
                        <Play className="w-4 h-4" />
                        Reconnect
                    </Button>                    
                </div>
            </div>
        </Card>
    )
}