"use server";

import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";

export default async function CreateGuestSessionCommand(): Promise<ServerResponse<null>> {
    try {

        
        return ServerResponseFactory.success(null);
    } catch(err) {
        console.log("Failed to create GUEST auth session. Reason: " + err);
        return ServerResponseFactory.error("Failed to guest session");
    }
}