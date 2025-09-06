"use server";

import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import AuthenticationRequiredBlock from "./AuthenticationRequiredBlock";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GetCurrentUser_Server } from "@/features/auth/current-user";

interface Props extends VariantProps<typeof pageBaseVariants> {
  lang: SupportedLanguage;
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

export default async function PageBase({ children, size, lang, requiresAuh = true }: Props) {
  
  // Check authentication if requires auth
  if (requiresAuh) {
    if (await GetCurrentUser_Server() == null) {
      return <AuthenticationRequiredBlock lang={lang} />
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