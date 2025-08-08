import { db } from "@/drizzle/db";

interface Props {
    userId: string;
    gameId: string;
}

export default async function PlayerDisconnectedCommand() {
    // TODO: kan in lobby zijn maar kan ook in actieve game zijn... even kijken hoe ik dat oplos. Moet de server.js bijhouden of het een lobby speler is of niet?? idk idk.

    await db.update(Auth)
        .set({
            currentRoundIndex: game.currentRoundIndex + 1
        })
        .where(eq(ActiveGameTable.id, game.id));        
}