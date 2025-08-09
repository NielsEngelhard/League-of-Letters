import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

interface Props extends VariantProps<typeof loadingDotsVariants> {
}

const loadingDotsVariants = cva(
  "rounded-full animate-bounce",
  {
    variants: {
      size: {
        sm: "w-1 h-1",
        md: "w-2 h-2",
        lg: "w-3 h-3",
        xl: "w-4 h-4"
      },
      color: {
        text: "bg-foreground",
        success: "bg-success"
      }
    },
    defaultVariants: {
        size: "md",
        color: "text"
    }
  }
)

export default function LoadingDots({ size, color }: Props) {
    return (
        <div className="flex items-center gap-1">
            <div className={`[animation-delay:-0.3s] ${cn(loadingDotsVariants({ size, color }))}`}></div>
            <div className={`[animation-delay:-0.15s] ${cn(loadingDotsVariants({ size, color }))}`}></div>
            <div className={`${cn(loadingDotsVariants({ size, color }))}`}></div>
        </div>
    )
}