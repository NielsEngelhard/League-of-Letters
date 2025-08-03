import Card from "@/components/ui/card/Card";
import { ActiveGamePlayerModel } from "../game-models";
import Title from "@/components/ui/text/Title";
import SubText from "@/components/ui/text/SubText";
import GameResultOverviewPlayerCard from "./GameResultOverviewPlayerCard";
import Button from "@/components/ui/Button";

interface Props {
    players: ActiveGamePlayerModel[];
}

export default function GameResultOverview({ players }: Props) {
    return (
        <Card className="flex flex-col gap-4 items-center">
            {/* Head */}
            <div className="text-center">
                <Title title="Game Overview" size="sm" color="text" />
                <SubText text="Leaderboard" />
            </div>

            {/* Scores */}
            <div className="flex flex-col gap-2 w-full">
                {players.sort((a, b) => b.score - a.score).map((player, index) => {
                    return <GameResultOverviewPlayerCard player={player} key={index} />
                })}
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
                <Button className="flex-1" variant='skeleton'>
                    Leave
                </Button>
                <Button className="flex-1" variant='primary'>
                    Play Again
                </Button>
            </div>
        </Card>
    )
} 