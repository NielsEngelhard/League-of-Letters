import { useActiveGame } from "@/features/game/components/active-game-context";
import { useParams } from "next/navigation";


export default function GamePage() {
    const {} = useActiveGame();

    const params = useParams();
    const gameId = params.gameId;

    return (
        <div>
            playing a
        </div>
    )
}