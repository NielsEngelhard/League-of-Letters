import { DbAccount, DbAccountSettings } from "@/drizzle/schema";
import generateRandomColorHex from "@/lib/colorhex-generator";
import { generateUUID } from "@/lib/token-generation";
import { generateSalt, hashPassword } from "../auth/password-hasher";

export default class AccountFactory {
    static async createDbAccount(email: string, username: string, unhashedPassword: string, isGuestAccount: boolean): Promise<DbAccount> {
        const salt = generateSalt();
        const hashedPassword = await hashPassword(unhashedPassword, salt);

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
            nGamesPlayed: 0,
            isGuestAccount: isGuestAccount
        }
    }

    static createDbAccountSettings(accountId: string): DbAccountSettings {
        return {
            accountId: accountId,
            enableBackgroundMusic: true,
            enableSoundEffects: true,
            theme: "light",
            wordInput: "on-screen-keyboard",
            showKeyboardHints: true,
            preFillGuess: true
        }
    }
}