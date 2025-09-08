import React from "react"

interface Props {
    children: React.ReactElement;
    classes?: string;
}

export default function PopupCard({ children, classes }: Props) {
    return (
        <div className={`w-full bg-background-secondary md:rounded-2xl p-4 border-1 border-border shadow-sm ${classes}`}>
            {children}
        </div>        
    )
}