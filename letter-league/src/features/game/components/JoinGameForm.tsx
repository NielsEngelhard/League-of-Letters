"use client"

import Button from "@/components/ui/Button"
import TextInput from "@/components/ui/form/TextInput"
import { GAME_ID_LENGTH, isValidGameId } from "../util/game-id-generator"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JOIN_GAME_ROUTE, LANGUAGE_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";

interface Props {
    lang: SupportedLanguage;
    label: string;
    btnTxt: string;
}

export default function JoinGameForm({ lang, label, btnTxt }: Props) {
    const [isValidJoinCode, setIsValidJoinCode] = useState<boolean>(false);
    const [joinCode, setJoinCode] = useState<string>("");    
    const router = useRouter();

    async function onJoinGame() {
        if (!isValidJoinCode) return;
        router.push(LANGUAGE_ROUTE(lang, JOIN_GAME_ROUTE(joinCode)));
    }

    useEffect(() => {
        const isValid = isValidGameId(joinCode);
        setIsValidJoinCode(isValid);
    }, [joinCode]);

    return (
        <>
            <TextInput
                value={joinCode}
                label={label}
                className="w-full"
                placeholder="Enter game ID..."
                maxLength={GAME_ID_LENGTH}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            />
            <Button className="w-full" variant="secondary" disable={!isValidJoinCode} onClick={onJoinGame}>{btnTxt}</Button>        
        </>        
    )
}