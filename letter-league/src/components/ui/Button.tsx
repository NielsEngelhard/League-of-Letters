import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

export interface Props extends VariantProps<typeof buttonVariants>, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    children: React.ReactNode;
    className?: string;
    disable?: boolean;
}

const buttonVariants = cva(
  "border-2 rounded-md font-medium text-lg !cursor-pointer hover:opacity-95 justify-center flex",
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

export default function Button({ children, className, variant, size, disable, ...props }: Props) {
    return (
        <button className={`${cn(buttonVariants({ variant, size }), className)} ${disable && "!bg-gray-500/50 !cursor-not-allowed"}`} {...props} disabled={disable}>
            {children}
        </button>
    )
}