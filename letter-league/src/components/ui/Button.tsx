import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useState } from "react";
import Link from "next/link";
import LoadingSpinner from "./animation/LoadingSpinner";

export interface Props extends VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    disable?: boolean;
    soundOnClick?: boolean;
    type?: "button" | "reset" | "submit";
}

const buttonVariants = cva(
  "border-2 rounded-md font-medium text-lg !cursor-pointer hover:opacity-95 justify-center flex items-center gap-1",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white",
        skeleton: "border-border text-foreground hover:border-primary/20",
        error: "bg-error text-white"
      },
      size: {
        sm: "px-2 py-1 md:px-5 md:py-2 text-sm font-semibold",
        md: "px-2 py-2 lg:px-4 lg:py-3",
        lg: "px-4 py-4 lg:px-10 lg:py-4"
      }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
  }
)

export default function Button({ children, className, variant, size, disable, href, onClick, type = "button" }: Props) {
  const isNavigationButton: boolean = (href != null && href != undefined && href != "");
  const [isLoading, setIsLoading] = useState(false);
  
  const classes: string = `${cn(buttonVariants({ variant, size }), className)} ${disable && "!bg-gray-500/50 !cursor-not-allowed"}`;  
  
  function handleOnClick(): void {
    setIsLoading(true);

    // Wait for navigation to other page
    if (isNavigationButton) return; 

    try {
      if (onClick) onClick();
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <button className={classes} disabled={true}>
        <LoadingSpinner color="background" />
      </button>
    )
  }

  // Button that is route to another page
  if (href && isNavigationButton) {
    return (
      <Link href={href} type="button" className="w-full">
          <button className={classes} disabled={disable}>
            {isLoading ? (
              <><LoadingSpinner color="background" /></>
            ) : (
              <>{children}</>
            )}
          </button>
      </Link>      
    )
  }

  // Button with javascript action on click
  return (
        <button className={classes} disabled={disable || isLoading} type={type} onClick={handleOnClick}>
            {isLoading ? (
              <><LoadingSpinner color="background" /></>
            ) : (
              <>{children}</>
            )}
        </button>
    )
}