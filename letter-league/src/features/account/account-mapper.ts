import { DbAccount } from "@/drizzle/schema";
import { PrivateAccountModel, PublicAccountModel } from "./account-models";

export class AccountMapper {
    static DbAccountToPublicModel(account: DbAccount): PublicAccountModel {
        return {
            id: account.id,
            colorHex: account.colorHex,
            createdAt: account.createdAt,
            favouriteWord: account.favouriteWord ?? "-",
            highestScoreAchieved: account.highestScoreAchieved,
            nGamesPlayed: account.highestScoreAchieved,
            username: account.username
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

            email: account.email
        }
    }     
}