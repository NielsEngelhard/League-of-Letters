"use client"

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/clipboard-util";
import { cva, VariantProps } from "class-variance-authority";
import cn from "@/lib/cn";

interface Props extends VariantProps<typeof variants> {
    text: string;
    label?: string;
}

const variants = cva(
  "w-full p-3 border rounded-lg flex items-center justify-between hover:opacity-80 transition-all duration-200",
  {
    variants: {
      bg: {
        default: "bg-muted border-border",
        primary: "bg-primary/10 border-primary/50 hover:bg-primary/20"
      },
      txt: {
        default: "text-muted-foreground",
        primary: "text-primary font-bold text-lg"
      }
    },
    defaultVariants: {
        bg: "default",
        txt: "default"
    }
  }
)

export default function CopyTextCard({ text, label, bg, txt }: Props) {
    const [copied, setCopied] = useState(false);

    function copyTextToClipboard() {
        copyToClipboard(text).then(() => {
            setCopied(true);
            
            setTimeout(() => {
                setCopied(false);
            }, 3000);
        });
    }

    return (
        <div className="w-full flex flex-col justify-end">
            {label && (
                <label className="text-xs font-medium text-muted-foreground block mb-1 w-full">
                    {label}
                </label>
            )}
            <button
                onClick={copyTextToClipboard}
                className={cn(variants({ bg, txt }))}
            >
                <span className={cn(
                    "truncate pr-2 min-w-0",
                    txt === "primary" ? "font-bold text-primary text-lg" : "text-sm text-muted-foreground"
                )}>
                    {text}
                </span>
                <div className="flex justify-end flex-shrink-0 ml-1 sm:ml-2">
                    {copied ? (
                        <Check size={16} className="text-success sm:w-5 sm:h-5" />
                    ) : (
                        <Copy size={16} className={cn(
                            "sm:w-5 sm:h-5",
                            txt === "primary" ? "text-primary" : "text-muted-foreground"
                        )} />
                    )}
                </div>
            </button>
        </div>
    );
}