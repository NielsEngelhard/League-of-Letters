import { DbAccount, DbAccountSettings } from "@/drizzle/schema";
import generateRandomColorHex from "@/lib/colorhex-generator";
import { generateUUID } from "@/lib/token-generation";

export default class AccountFactory {
    static createDbAccount(email: string, username: string, hashedPassword: string, salt: string): DbAccount {
        return {
            id: generateUUID(),
            username: username,
            colorHex: generateRandomColorHex(),
            email: email,
            salt: salt,           
            password: hashedPassword,
            createdAt: new Date(),
            favouriteWord: "kaas",
            highestScoreAchieved: 0,
            nGamesPlayed: 0                           
        }
    }

    static createDbAccountSettings(accountId: string): DbAccountSettings {
        return {
            accountId: accountId,
            enableBackgroundMusic: true,
            enableSoundEffects: true,
            theme: "light",
            wordInput: "on-screen-keyboard"
        }
    }
}