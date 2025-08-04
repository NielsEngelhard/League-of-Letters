import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

interface Props extends VariantProps<typeof pageBaseVariants> {
    children: React.ReactNode;
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

export default function PageBase({ children, size }: Props) {
    return (
        <div className="px-2 my-4 w-full flex flex-col gap-3 items-center mt-[85px] h-full">
            <div className={`flex flex-col w-full gap-2 md:gap-4 ${cn(pageBaseVariants({ size }))}`}>
                {children}
            </div>
        </div>        
    )
}