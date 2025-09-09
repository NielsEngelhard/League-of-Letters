"use client"

import { Check, Copy } from "lucide-react";
import Card from "./Card";
import { useState } from "react";
import { copyToClipboard } from "@/lib/clipboard-util";
import { cva, VariantProps } from "class-variance-authority";
import cn from "@/lib/cn";

interface Props extends VariantProps<typeof variants> {
    text: string;
    label?: string;    
    classes?: string;
}

const variants = cva(
  "",
  {
    variants: {
      bg: {
        default: "",
        primary: "bg-primary/10 border-primary/50"
      },
      txt: {
        default: "",
        primary: "text-primary font-bold! text-lg"
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

    function copyJoinCodeToClipboard() {
        copyToClipboard(text).then(() => {
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 3000);
        });
    }

    return (
        <button className="text-start w-full" onClick={copyJoinCodeToClipboard}>
            <Card className={`py-2 px-4 hover:bg-primary/10 cursor-pointer transition-colors duration-300 ${cn(variants({ bg }))}`}>
                <div className="flex flex-col">
                    <span className="text-xs font-medium italic text-foreground-muted">{label}</span>
                    <span className={`font-medium text-foreground-muted flex items-center gap-0.5 truncate ${cn(variants({ txt }))}`}>                    
                        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                        {text}
                    </span>
                </div>
            </Card>            
        </button>
    )
}