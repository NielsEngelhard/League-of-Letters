import React from "react"

interface Props {
    children: React.ReactNode;
}

export default function PageBase({ children }: Props) {
    return (
        <div className="px-2 my-4 w-full flex flex-col gap-3 items-center mt-30">
            <div className="max-w-5xl w-full">
                {children}
            </div>
        </div>        
    )
}