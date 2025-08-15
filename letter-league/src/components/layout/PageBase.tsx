import { useAuth, useIsLoggedIn } from "@/features/auth/AuthContext";
import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useEffect } from "react";
import Button from "../ui/Button";
import AuthenticationRequiredBlock from "./AuthenticationRequiredBlock";

interface Props extends VariantProps<typeof pageBaseVariants> {
    children: React.ReactNode;
    loadingMessage?: string;
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

export default function PageBase({ children, size, loadingMessage, requiresAuh = true }: Props) {
  const { isLoggedIn, toggleLoginModal } = useAuth();

  // If page requires auth and not logged in, enforce login modal
  useEffect(() => {
    if (isLoggedIn || !requiresAuh) return;
    
    toggleLoginModal();
  }, [isLoggedIn, requiresAuh]);

  return (
        <div className="px-2 my-4 w-full flex flex-col gap-3 items-center mt-[15px] h-full">
            <div className={`flex flex-col w-full gap-2 md:gap-4 ${cn(pageBaseVariants({ size }))}`}>
                {(!requiresAuh || isLoggedIn) ? (
                  <>
                    {children}
                  </>
                ) : (
                  <AuthenticationRequiredBlock />
                )}
            </div>
        </div>        
    )
}