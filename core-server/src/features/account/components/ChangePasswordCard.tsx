"use client"

import Card from "@/components/ui/card/Card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children"
import { Lock } from "lucide-react"

export default function ChangePasswordCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Change password
                </CardTitle>
            </CardHeader>
            <CardContent>

            </CardContent>
        </Card>
    )
}