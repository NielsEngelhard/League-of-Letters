import { useEffect, useState } from "react"
import { ActiveGameTeaserModel } from "../game-models"
import GetActiveGamesForCurrentPlayerRequest from "../actions/query/get-active-games-for-current-player";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import GameTeaserCard from "./GameTeaserCard";

interface Props {
    
}

export default function ReconnectGamesOverview() {
    const [games, setGames] = useState<ActiveGameTeaserModel[] | null>(null);

    useEffect(() => {
        async function fetchGames() {
            const response = await GetActiveGamesForCurrentPlayerRequest();
            setGames(response);
        }

        fetchGames();
    }, []);

    return (
        <div className="w-full flex flex-col gap-2">
            {games ? (
                <>
                    {games.map((teaser, i) => <GameTeaserCard key={i} teaser={teaser} />)}
                </>
            ) : (
                <div className="flex flex-row gap-1 justify-center items-center font-medium">
                    <LoadingSpinner />
                    <span>Loading active games...</span>
                </div>
            )}
        </div>
    )
}