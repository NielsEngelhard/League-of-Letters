import React from "react"

interface Props {
    children: React.ReactElement;
}

export default function PopupCard({ children }: Props) {
    return (
        <div className="w-full bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
            {children}
        </div>        
    )
}