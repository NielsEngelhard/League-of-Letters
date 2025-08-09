import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

interface Props extends VariantProps<typeof loadingSpinnerVariants> {
}

const loadingSpinnerVariants = cva(
  "",
  {
    variants: {
      size: {
        sm: "w-3 h-3",
        md: "w-5 h-5",
        lg: "w-7 h-7"
      },
      color: {
        text: "border-foreground",
        success: "border-success"
      }
    },
    defaultVariants: {
        size: "md",
        color: "text"
    }
  }
)

export default function LoadingSpinner({ size, color }: Props) {
    return (
        <div className={`border-2 border-t-transparent rounded-full animate-spin ${cn(loadingSpinnerVariants({ size, color }))}`}></div>
    )
}