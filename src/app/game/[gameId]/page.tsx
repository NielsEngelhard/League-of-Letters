import { useParams } from "next/navigation";


export default function GamePage() {

    const params = useParams();
    const gameId = params.gameId;

    return (
        <div>
            playing a
        </div>
    )
}