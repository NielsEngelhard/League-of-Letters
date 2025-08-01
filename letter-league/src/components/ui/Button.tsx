import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

export interface Props extends VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    className?: string;
}

const buttonVariants = cva(
  "border-2",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white",
        skeleton: "border-border text-foreground"
      },
      size: {
        sm: "p-0",
        md: "p-2 lg:p-4",
        lg: ""
      }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
  }
)

export default function Button({ children, className, variant, size }: Props) {
    return (
        <button className={cn(buttonVariants({ variant, size }), className)}>
            {children}
        </button>
    )
}