import { DbAccount } from "@/drizzle/schema";
import { PrivateAccountModel, PublicAccountModel } from "./account-models";

export class AccountMapper {
    static DbAccountToPublicModel(account: DbAccount, tokenExpireUtcDate?: Date): PublicAccountModel {
        console.log(account);
        return {
            id: account.id,
            colorHex: account.colorHex,
            createdAt: account.createdAt,
            favouriteWord: account.favouriteWord ?? "-",
            highestScoreAchieved: account.highestScoreAchieved,
            nGamesPlayed: account.highestScoreAchieved,
            username: account.username,
            isGuest: account.isGuestAccount,
            tokenExpireUtcDate: tokenExpireUtcDate,
            language: account.language,
        }
    } 

    static DbAccountToPrivateModel(account: DbAccount): PrivateAccountModel {
        return {
            id: account.id,
            colorHex: account.colorHex,
            createdAt: account.createdAt,
            favouriteWord: account.favouriteWord ?? "-",
            highestScoreAchieved: account.highestScoreAchieved,
            nGamesPlayed: account.highestScoreAchieved,
            username: account.username,
            language: account.language,
            isGuest: account.isGuestAccount,
            email: account.email
        }
    }     
}