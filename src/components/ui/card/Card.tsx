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
        default: "border-border bg-white",
        fade: "!border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50",
        accent: "bg-accent/10 border-none"
      },
      padding: {
        none: "p-0",
        md: "p-2 lg:p-5"
      }
    },
    defaultVariants: {
        variant: "default",
        padding: "md"
    }
  }
)

export default function Card({ children, className, variant, padding }: Props) {
    return (
        <div className={cn(cardVariants({ variant, padding }), className)}>
            {children}
        </div>
    )
}