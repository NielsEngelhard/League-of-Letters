import { DbAccount } from "@/drizzle/schema";
import { JwtAccountPayload } from "./jwt-models";

export class JwtMapper {
    static MapAccountToJwtPayload(account: DbAccount): JwtAccountPayload {
        return {
            accountId: account.id,
            email: account.email,
            isGuest: account.isGuestAccount,
            language: account.language,
            username: account.username
        }
    }
}