import { useEffect, useState } from "react"
import { ActiveGameTeaserModel } from "../game-models"
import GetActiveGamesForCurrentPlayerRequest from "../actions/query/get-active-games-for-current-player";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import GameTeaserCard from "./GameTeaserCard";
import Card from "@/components/ui/card/Card";
import UspCard from "@/components/ui/UspCard";
import { Gamepad } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

interface Props {
    
}

export default function ReconnectGamesOverview() {
    const {account} = useAuth();
    const [games, setGames] = useState<ActiveGameTeaserModel[] | null>(null);

    useEffect(() => {
        if (!account) return;

        async function fetchGames() {
            const response = await GetActiveGamesForCurrentPlayerRequest();
            setGames(response);
        }

        fetchGames();
    }, [account]);

    if (!account) {
        return <div></div>
    }

    return (
        <div className="w-full flex flex-col gap-2 items-center">
 
            <UspCard Icon={Gamepad} title="Current Games" fullWidth={true}>
                {games ? (
                    games.length == 0 ? (
                        <span>No active games at the moment</span>
                    ) : (
                        <div className="w-full">
                            {games.map((teaser, i) => <GameTeaserCard key={i} teaser={teaser} />)}
                        </div>                        
                    )
                ) : (
                    <><LoadingSpinner /></>
                )}
            </UspCard>
 
            {/* {games ? (
                <>
                    {games.length == 0 ? (
                        <Card className="w-fit">
                            <div className="p-2">
                                No active games at the moment
                            </div>
                        </Card>
                    ) : (
                        <>
                            {games.map((teaser, i) => <GameTeaserCard key={i} teaser={teaser} />)}
                        </>                        
                    )}
                </>
            ) : (
                <div className="flex flex-row gap-1 justify-center items-center font-medium">
                    <LoadingSpinner />
                    <span>Loading active games...</span>
                </div>
            )} */}
        </div>
    )
}