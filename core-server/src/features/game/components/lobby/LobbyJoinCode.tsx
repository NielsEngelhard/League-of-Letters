"use client"

import Icon from "@/components/ui/Icon";
import { copyToClipboard } from "@/lib/clipboard-util";
import { splitStringInMiddle } from "@/lib/string-util"
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function LobbyJoinCode({ joinCode }: { joinCode: string }) {
    const [copiedGameId, setCopiedGameId] = useState(false);

    function copyJoinCodeToClipboard() {
        copyToClipboard(joinCode).then(() => {
            setCopiedGameId(true);
        });        
    }

    return (
        <button className="flex flex-row cursor-pointer" onClick={copyJoinCodeToClipboard}>
            {splitStringInMiddle(joinCode ?? "")}
            {copiedGameId ? (
                <div className="text-success"><Icon LucideIcon={Check} size="xs" /></div>
            ) : (
                <Icon LucideIcon={Copy} size="xs" />
            )}
        </button>
    )
}