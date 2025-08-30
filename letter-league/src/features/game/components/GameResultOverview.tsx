import Card from "@/components/ui/card/Card";
import { GamePlayerModel } from "../game-models";
import GameResultOverviewPlayerCard from "./GameResultOverviewPlayerCard";
import Button from "@/components/ui/Button";
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import { useRouter } from "next/navigation";
import { SupportedLanguage } from "@/features/i18n/languages";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";
import { Info, Repeat, Trophy, Users } from "lucide-react";
import InfoBanner from "@/components/ui/InfoBanner";

interface Props {
    players: GamePlayerModel[];
    lang: SupportedLanguage;
    t: InGameTranslations;
}

export default function GameResultOverview({ players, lang, t }: Props) {
    const router = useRouter();
        
    const sortedPlayersByScore = players.sort((a, b) => b.score - a.score);
    const isSoloGame = players.length === 1;
    const isDuel = players.length === 2;

    const getSubtitle = () => {
        if (isSoloGame) return t.overview.scenarios.solo.subTxt;
        if (isDuel) return t.overview.scenarios.duo.subTxt;
        return t.overview.scenarios.online.subTxt;
    };

    function onPlayAgain() {
        if (isSoloGame) {
            router.push(LANGUAGE_ROUTE(lang, SOLO_GAME_ROUTE));
        }
    }

    return (
        <Card className="p-6 flex flex-col gap-4">
            <DefaultCardHeader Icon={Trophy} title="Game Results" description={getSubtitle()} />
            
            {/* Prominent message for multiplayer games so participants can stay and play another game easily */}
            {!isSoloGame && (
                <InfoBanner
                    icon={Repeat}
                    text={t.overview.infoBanner.participantStayMsg}
                />
            )}

            {/* Prominent host message for multiplayer games so host knows he can bring all other players to a new lobby */}
            {!isSoloGame && (
                <InfoBanner
                    icon={Repeat}
                    text={t.overview.infoBanner.hostPlayAgainMsg}
                />
            )}            

            <div className="flex flex-col gap-4">
                {sortedPlayersByScore.map((player, index) => (
                    <GameResultOverviewPlayerCard player={player} position={index+1} t={t} key={player.accountId} />
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse md:flex-row gap-2 w-full">
                <Button variant='skeleton' className="w-full" href={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)}>
                    {t.overview.leaveBtn}
                </Button>
                
                <Button className="w-full" variant='primary' onClick={onPlayAgain}>
                    {t.overview.playAgainBtn}
                </Button>
            </div>
        </Card>
    );
}