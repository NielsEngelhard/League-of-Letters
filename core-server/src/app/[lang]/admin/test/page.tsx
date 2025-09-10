"use client"

import { useMessageBar } from "@/components/layout/MessageBarContext"

export default function AdminTestPage() {
    const msgBar = useMessageBar();
    
    function onTriggerToast() {
        const seconds = 30;
        
        msgBar.pushMessage({
            msg: "Een test message",
            title: "title",
            type: "information"
        }, seconds);
    }

    return (
        <div lang="en">
            <div className="mt-10">
                <button onClick={onTriggerToast} className="p-4 border">
                    trigger toast
                </button>
            </div>
        </div>
    )
}