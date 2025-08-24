"use server";

import { getCurrentUserOrCrash } from "../../current-user";
import { JWTService } from "../../jwt-service";
import DeleteAccountById from "./delete-account-by-id-command";

export async function LogoutCommand(): Promise<void> {
  const currentUser = await getCurrentUserOrCrash();

  if (currentUser.isGuest) {
    console.log("REMOVE GUEST USER");
  }

  await JWTService.clearAuthCookies();

  // If it was a guest account, remove the account
  if (currentUser.isGuest == true) {
    await DeleteAccountById(currentUser.accountId);
  }
}
