import { useActiveGame } from "./active-game-context";
import GameBoard from "./GameBoard";
import GameResultOverview from "./GameResultOverview";

export default function Ingame() {
    const { game, players } = useActiveGame();

    return (
        <>
            {game?.gameIsOver ? (
                <GameResultOverview
                    players={players}
                />
            ) : (
                <GameBoard />
            )}
        </>
    )
}