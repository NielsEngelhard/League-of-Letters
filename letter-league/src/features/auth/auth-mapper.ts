import { DbAuthSession } from "@/drizzle/schema";
import { AuthSessionModel } from "./auth-models";

export class AuthMapper {
    static MapSessionToModel(authSession: DbAuthSession): AuthSessionModel {
        return {
            id: authSession.id,
            secretKey: authSession.secretKey,
            username: authSession.username,
            createdAt: authSession.createdAt
        }
    };
}