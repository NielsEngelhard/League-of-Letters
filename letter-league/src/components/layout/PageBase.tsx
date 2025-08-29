"use server";

import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import AuthenticationRequiredBlock from "./AuthenticationRequiredBlock";
import { JWTService } from "@/features/auth/jwt-service";
import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME } from "@/features/auth/auth-constants";

interface Props extends VariantProps<typeof pageBaseVariants> {
    children: React.ReactNode;
    requiresAuh?: boolean;    
}

const pageBaseVariants = cva(
  "",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-2xl",
        lg: "max-w-4xl"
      }
    },
    defaultVariants: {
        size: "md",
    }
  }
)

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
  if (!authTokenCookie) return false;

  const verifiedToken = JWTService.verifyToken(authTokenCookie.value);
  return verifiedToken != null;
}

export default async function PageBase({ children, size, requiresAuh = true }: Props) {
  
  // Check authentication if requires auth
  if (requiresAuh) {
    if (await isAuthenticated() == false) {
      return <AuthenticationRequiredBlock />
    }
  }

  // Return content
  return (
        <div className="px-2 my-4 w-full flex flex-col gap-3 items-center mt-[15px] h-full">
            <div className={`flex flex-col w-full gap-2 md:gap-4 ${cn(pageBaseVariants({ size }))}`}>
                {children}
            </div>
        </div>        
    )
}