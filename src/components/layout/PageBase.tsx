import cn from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import Button from "../ui/Button";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";

interface Props extends VariantProps<typeof pageBaseVariants> {
    children: React.ReactNode;
    backHref?: string;
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

export default function PageBase({ children, size, backHref }: Props) {
    return (
        <div className="px-2 my-4 w-full flex flex-col gap-3 items-center mt-30">
            <div className={`flex flex-col w-full gap-2 md:gap-4 ${cn(pageBaseVariants({ size }))}`}>
                {backHref && (
                    <div>
                    <Button
                      size="sm"
                      variant="skeleton">
                        <div className="flex gap-1 items-center">
                          <ArrowBigLeft size={16} />
                          Back
                        </div>
                    </Button>                    
                  </div>
                )}

                {children}
            </div>
        </div>        
    )
}