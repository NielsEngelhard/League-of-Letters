"use server";

import { redirect } from "next/navigation";
import { GetCurrentUser_Server } from "../../current-user";
import { JWTService } from "../../jwt/jwt-service";
import DeleteAccountById from "./delete-account-by-id-command";
import { HOME_ROUTE } from "@/app/routes";

export async function LogoutCommand(): Promise<void> {
  const currentUser = await GetCurrentUser_Server();

  await JWTService.clearAuthCookies();

  // If it was a guest account, remove the account
  if (currentUser && currentUser.isGuest == true) {
    await DeleteAccountById(currentUser.accountId);
  }

  redirect(HOME_ROUTE);
}
