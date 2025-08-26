import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState } from "react";
import Link from "next/link";
import LoadingSpinner from "./animation/LoadingSpinner";

export interface Props extends VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void | Promise<void>; // Allow async onClick
    onSubmit?: (e: React.FormEvent) => void | Promise<void>; // For submit buttons
    className?: string;
    disable?: boolean;
    soundOnClick?: boolean;
    isLoadingExternal?: boolean;
    type?: "button" | "reset" | "submit";
}

const buttonVariants = cva(
  "border-2 rounded-2xl font-medium text-lg !cursor-pointer hover:opacity-95 justify-center flex items-center gap-1 transform hover:scale-105 transition-all duration-300 hover:shadow-primary/25",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        primaryFade: "bg-gradient-to-r from-primary to-secondary text-background",
        secondary: "bg-secondary text-white",
        skeleton: "border-border text-foreground hover:border-primary/20",
        error: "bg-error text-white"
      },
      size: {
        sm: "px-2 py-1 md:px-5 md:py-2 text-sm font-semibold",
        md: "px-2 py-2 lg:px-4 lg:py-3",
        lg: "px-12 py-4 text-xl font-bold",
      }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
  }
)

export default function Button({ 
  children, 
  className, 
  variant, 
  size, 
  disable, 
  href, 
  onClick, 
  type = "button",
  isLoadingExternal = false 
}: Props) {
  const isNavigationButton: boolean = (href != null && href != undefined && href != "");
  const [isLoading, setIsLoading] = useState(false);
     
  const classes: string = `${cn(buttonVariants({ variant, size }), className)} ${disable && "!bg-gray-500/50 !cursor-not-allowed"}`;
       
  async function handleOnClick(): Promise<void> {
    // Don't handle loading for navigation buttons
    if (isNavigationButton) return;
    
    setIsLoading(true);
      
    try {
      if (onClick) {
        await onClick(); // Wait for onClick to complete (whether sync or async)
      }
    } finally {
      setIsLoading(false);
    }
  }
   
  // Button that is route to another page
  if (href && isNavigationButton) {
    return (
      <Link href={href} className="w-full">
        <button className={classes} disabled={disable} type="button">
          {children}
        </button>
      </Link>
    )
  }
   
  // Button with javascript action on click
  return (
    <button 
      className={classes} 
      disabled={disable || isLoading} 
      type={type} 
      onClick={handleOnClick}
    >
      <div className="flex items-center justify-center min-w-0 min-h-[1lh] gap-1">
        {(isLoading || isLoadingExternal) ? (
          <LoadingSpinner color="background" />
        ) : (
          children
        )}
      </div>
    </button>
  )
}