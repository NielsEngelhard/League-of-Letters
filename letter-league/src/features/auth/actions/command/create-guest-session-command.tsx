"use server";

import { cookies } from "next/headers";
import CreateAuthSession from "./create-auth-session";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";

export default async function CreateGuestSessionCommand(): Promise<ServerResponse<null>> {
    try {
        await CreateAuthSession({
            forAccountId: undefined
        }, await cookies());
        
        return ServerResponseFactory.success(null);
    } catch(err) {
        console.log("Failed to create GUEST auth session. Reason: " + err);
        return ServerResponseFactory.error("Failed to guest session");
    }
}