import { useActiveGame } from "./active-game-context";
import GameBoard from "./GameBoard";
import GameResultOverview from "./GameResultOverview";

export default function Ingame() {
    const { ended, players } = useActiveGame();

    return (
        <>
            {ended ? (
                <GameResultOverview
                    players={players}
                />
            ) : (
                <GameBoard />
            )}
        </>
    )
}