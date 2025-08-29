"use client"

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface Props {
    label: string;
    value: string;
}

export default function CopyTextBlock({ label, value }: Props) {
    const [copied, setCopied] = useState(false);
    
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

    return (
        <div 
          onClick={copyToClipboard}
          className="bg-background-secondary border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-foreground-muted/10 hover:border-foreground-muted/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground-muted mb-1">{label}</p>
              <p className="text-sm font-monos text-foreground truncate">
                {value}
              </p>
            </div>
            <div className="ml-3 flex-shrink-0">
              {copied ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Copy className="w-5 h-5 text-foreground-muted group-hover:text-foreground" />
              )}
            </div>
          </div>
        </div>
    )
}