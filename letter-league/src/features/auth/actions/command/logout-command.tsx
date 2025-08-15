"use server";

import { JWTService } from "../../jwt-service";

export async function LogoutCommand(): Promise<void> {
  await JWTService.clearAuthCookie();
}
