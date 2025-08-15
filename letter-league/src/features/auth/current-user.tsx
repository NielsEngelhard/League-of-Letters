"use server";

import { JWTPayload, JWTService } from "./jwt-service";

export interface CurrentUserData {
  accountId: string;
  email: string;
  username: string;
  isGuest: boolean;
}

export async function isLoggedInServerCheck(): Promise<boolean> {
  const user = await JWTService.getCurrentUser();
  return user !== null;
}

export async function getCurrentUserOrCrash(): Promise<CurrentUserData> {
  const user = await JWTService.getCurrentUser();
  
  if (!user) throw Error("Un_AUTH");
  
  return user;
}
