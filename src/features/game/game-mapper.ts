import { DbActiveGameWithRoundsAndPlayers } from "@/drizzle/schema";
import { ActiveGameModel } from "./game-models";

export class GameMapper {
    static ActiveGameToModel(game: DbActiveGameWithRoundsAndPlayers): ActiveGameModel {
        return {
            id: game.id,
            currentRound: game.currentRoundIndex,
            wordLength: game.wordLength
        }
    }
}