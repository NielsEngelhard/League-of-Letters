import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

interface Props extends VariantProps<typeof loadingSpinnerVariants> {
  center?: boolean;
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

export default function LoadingSpinner({ size, color, center = false }: Props) {
    return (
        <div className={center ? 'w-full flex items-center justify-center' : ''}>
          <div className={`border-2 border-t-transparent rounded-full animate-spin ${cn(loadingSpinnerVariants({ size, color }))}`}></div>
        </div>
    )
}