"use client"

import { useToaster } from "@/components/general/toaster/ToasterContext"

export default function AdminTestPage() {
    const toaster = useToaster();
    
    function onTriggerToast() {
        const seconds = 30;
        
        toaster.pushToast({
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