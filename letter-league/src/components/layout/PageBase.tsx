import { useAuth } from "@/features/auth/AuthContext";
import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useEffect } from "react";
import AuthenticationRequiredBlock from "./AuthenticationRequiredBlock";
import FullScreenLoading from "../ui/animation/FullScreenLoading";

interface Props extends VariantProps<typeof pageBaseVariants> {
    children: React.ReactNode;
    loadingMessage?: string;
    requiresAuh?: boolean;    
    isLoadingPage?: boolean;
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

export default function PageBase({ children, size, requiresAuh = true, isLoadingPage = false }: Props) {
  const { isLoggedIn, setShowLoginModal, isLoading } = useAuth();

  // If page requires auth and not logged in, enforce login modal
  useEffect(() => {
    const pageRequiresAuthAndUserIsNotLoggedIn: boolean = isLoggedIn || !requiresAuh;

    if (pageRequiresAuthAndUserIsNotLoggedIn) {
      setShowLoginModal(false);
    } else {
      setShowLoginModal(true);
    }    
  }, [isLoggedIn, requiresAuh]);

  return (
        <div className="px-2 my-4 w-full flex flex-col gap-3 items-center mt-[15px] h-full">
            <div className={`flex flex-col w-full gap-2 md:gap-4 ${cn(pageBaseVariants({ size }))}`}>
                {/* Page is loading */}
                {(isLoadingPage || isLoading) ? (
                    <div className="w-full flex justify-center mt-10">
                      <FullScreenLoading />
                    </div>
                ) : (
                  // Not loading anymore
                  (!requiresAuh || isLoggedIn) ? (
                    <>{children}</>
                  ) : (
                    <AuthenticationRequiredBlock />      
                  )
                )}
            </div>
        </div>        
    )
}