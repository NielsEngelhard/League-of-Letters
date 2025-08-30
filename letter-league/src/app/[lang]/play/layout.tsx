"use client"

import { ReactNode } from "react";

// Game layout for managing websocket connection lifecycle
export default function GameLayout({children}: {children: ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}