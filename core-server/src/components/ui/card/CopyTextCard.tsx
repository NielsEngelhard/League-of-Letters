"use client"

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/lib/clipboard-util";
import { cva, VariantProps } from "class-variance-authority";
import cn from "@/lib/cn";

interface Props extends VariantProps<typeof variants> {
    text: string;
    label?: string;
    description?: string;
}

const variants = cva(
  "",
  {
    variants: {
      bg: {
        default: "bg-muted border-border",
        primary: "bg-primary/10 border-primary/50 hover:bg-primary/20"
      },
      txt: {
        default: "text-muted-foreground text-md",
        primary: "text-primary font-bold text-xl"
      }
    },
    defaultVariants: {
        bg: "default",
        txt: "default"
    }
  }
)

export default function CopyTextCard({ text, description, label, bg, txt }: Props) {
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
            <div className="w-full flex flex-col">
              <label className="text-sm font-medium text-foreground block">{label}</label>
              <div 
                className="flex items-center bg-background-secondary rounded-lg p-3 cursor-pointer hover:bg-background transition-colors w-full"
                onClick={() => copyTextToClipboard()}
              >
                <code className={`font-monos w-full ${variants({ txt })} truncate`}>{text}</code>
                 <div className="flex justify-end flex-shrink-0 ml-1 sm:ml-2">
                     {copied ? (
                         <Check size={16} className="text-success sm:w-5 sm:h-5" />
                     ) : (
                         <Copy size={16} className={cn(
                             `sm:w-5 sm:h-5 ${variants({ txt })}`,                             
                         )} />
                     )}
                 </div>
              </div>
              <p className="text-xs text-foreground-muted font-mo ">{description}</p>
            </div>
    );
}