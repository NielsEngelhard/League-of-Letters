"use server";

import { JWTService } from "./jwt-service";
import { AccountTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { SupportedLanguage } from "../i18n/languages";

export interface CurrentUserData {
  accountId: string;
  email: string;
  username: string;
  isGuest: boolean;
  language: SupportedLanguage;
}

// Helper function for database lookup (only called during refresh)
async function getUserFromDatabase(accountId: string): Promise<CurrentUserData | null> {
  const account = await db.select().from(AccountTable).where(eq(AccountTable.id, accountId)).then(rows => rows[0]);
  if (!account) return null;
  
  return {
    accountId: account.id,
    email: account.email,
    username: account.username,
    isGuest: account.isGuestAccount,
    language: account.language
  };
}

export async function isLoggedInServerCheck(): Promise<boolean> {
  // First try with current access token (no DB call)
  const user = await JWTService.getCurrentUser();
  if (user) return true;

  // If access token invalid, try refresh (1 DB call only if needed)
  const refreshedUser = await JWTService.getCurrentUserWithRefresh(getUserFromDatabase);
  return refreshedUser !== null;
}

export async function getCurrentUserOrCrash(): Promise<CurrentUserData> {
  // First try with current access token (no DB call)
  let user = await JWTService.getCurrentUser();
  
  if (!user) {
    // If access token invalid, try refresh (1 DB call only if needed)
    user = await JWTService.getCurrentUserWithRefresh(getUserFromDatabase);
  }

  if (!user) throw Error("AUTH ERROR: not logged in");
  
  return user;
}

export async function getCurrentUserOrCrashNoRefresh(): Promise<CurrentUserData> {
  const user = await JWTService.getCurrentUser();
  if (!user) throw Error("AUTH ERROR: not logged in");
  return user;
}