import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

export interface Props extends VariantProps<typeof cardVariants> {
    children: React.ReactNode;
    className?: string;
}

const cardVariants = cva(
  "border border-border overflow-hidden flex flex-col duration-300 transition-all rounded-lg",
  {
    variants: {
      variant: {
        default: "border-border bg-background-secondary",
        success: "border-success/50 bg-success/5",
        fade: "bg-gradient-to-r from-primary/10 to-secondary/10",
        accent: "bg-accent/10 border-none"
      },
    },
    defaultVariants: {
        variant: "default",
    }
  }
)

export default function Card({ children, className, variant }: Props) {
    return (
        <div className={cn(cardVariants({ variant }), className)}>
            {children}
        </div>
    )
}