import Card from "@/components/ui/card/Card";
import { ActiveGamePlayerModel } from "../game-models";

interface Props {
    player: ActiveGamePlayerModel;
}

export default function GameResultOverviewPlayerCard({ player }: Props) {
    return (
        <Card>
            <div className="flex flex-row justify-between w-full">
                <div className="font-medium">
                    {player.username}
                </div>

                <div className="font-bold">
                    {player.score} pts
                </div>
            </div>
        </Card>
    )
}