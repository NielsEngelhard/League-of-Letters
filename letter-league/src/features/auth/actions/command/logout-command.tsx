"use server";

import { getCurrentUserOrCrash } from "../../current-user";
import { JWTService } from "../../jwt-service";

export async function LogoutCommand(): Promise<void> {
  const currentUser = await getCurrentUserOrCrash();

  if (currentUser.isGuest) {
    console.log("REMOVE GUEST USER");
  }

  await JWTService.clearAuthCookies();
}
