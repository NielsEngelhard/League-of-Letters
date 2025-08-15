import { NextRequest } from "next/server";

export const WEBHOOK_API_KEY_HEADER_NAME = "API-KEY";

export function hasValidApikey(req: NextRequest): boolean {
    return process.env.WEBHOOK_API_KEY == req.headers.get(WEBHOOK_API_KEY_HEADER_NAME);
}