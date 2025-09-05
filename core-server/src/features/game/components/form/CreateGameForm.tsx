"use client"

import { useForm } from "react-hook-form"
import { CreateGamePlayerSchema, createGameSchema, CreateGameSchema } from "../../game-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { GameMode } from "@/drizzle/schema"
import Seperator from "@/components/ui/Seperator"
import SelectDropdown from "@/components/ui/form/SelectInput"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { LetterText, Play } from "lucide-react"
import ErrorText from "@/components/ui/text/ErrorText"
import { useEffect, useState } from "react"
import SwitchInput from "@/components/ui/form/SwitchInput"
import CreateGameCommand from "../../actions/command/create-game-command"
import { useRouter, useSearchParams } from "next/navigation"
import { LANGUAGE_ROUTE, PLAY_SOLO_GAME_ROUTE } from "@/app/routes"
import { SupportedLanguage } from "@/features/i18n/languages"
import BeforeGameTranslations from "@/features/i18n/translation-file-interfaces/BeforeGameTranslations"
import CreateOnlineGameBasedOnLobbyCommand from "@/features/lobby/actions/command/create-online-game-based-on-lobby-command"
import { GetLanguageStyle } from "@/features/language/LanguageStyles"
import Label from "@/components/ui/form/Label"

interface Props {
    submitDisabled?: boolean;
    onLeaveGame?: () => void;
    players?: CreateGamePlayerSchema[];
    gameMode?: GameMode;
    gameId?: string;
    lang: SupportedLanguage;
    t: BeforeGameTranslations;
}

export default function CreateGameForm({ onLeaveGame, submitDisabled = false, players, gameMode = "solo", gameId, lang, t }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter(); 
    
    const searchParams = useSearchParams();
    const instaStart = searchParams.get("playDemoGame") == "true";


    const languageStyle = GetLanguageStyle(lang);

    function onSubmit(data: CreateGameSchema) {
        if (gameMode == "online") {
            CreateOnlineGameBasedOnLobbyCommand(data);        
        } else {
            // Solo game
            CreateGameCommand(data)
            .then((gameId) => {
                router.push(LANGUAGE_ROUTE(lang, PLAY_SOLO_GAME_ROUTE(gameId)));
            })
            .catch((error) => {
                form.setError("root", {
                type: "manual",
                message: "Something went wrong while creating the game",
                });                   
            });
        }
    }

    const form = useForm<CreateGameSchema>({
      resolver: zodResolver(createGameSchema),
      defaultValues: {
        wordLength: 6,
        guessesPerRound: 6,
        totalRounds: 4,
        gameMode: gameMode,
        gameId: gameId,
        withStartingLetter: true,
        nSecondsPerGuess: gameMode == "online" ? 60 : undefined,
        language: lang
      }
    })    

    // Insta play (demo game) if applicable
    useEffect(() => {
        if (instaStart) {
        const values = form.getValues();
        handleFormSubmit(values);
        }
        
    }, [instaStart]);    

    useEffect(() => {
        if (!players || players.length == 0 || !form) return;        
        
        form.setValue("players", players);
    }, [players, form]);

    const handleFormSubmit = async (data: CreateGameSchema) => {
        setIsSubmitting(true);

        try {
            onSubmit(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(handleFormSubmit)}>            
            <SelectDropdown
                name="wordLength"
                control={form.control}
                label={t.createGameForm.wordLengthLabel}
                placeholder="Length of each word"
                required
                options={[
                    { value: 4, label: "4 (four)" },
                    { value: 5, label: "5 (five)" },
                    { value: 6, label: "6 (six)" },
                    { value: 7, label: "7 (seven)" },
                    { value: 8, label: "8 (eight)" },
                    { value: 9, label: "9 (nine)" },
                    { value: 10, label: "10 (ten)" },
                    { value: 11, label: "11 (eleven)" },
                    { value: 12, label: "12 (twelve)" },
                ]}
            />

            <SelectDropdown
                name="totalRounds"
                control={form.control}
                label={t.createGameForm.totalRoundsLabel}
                placeholder="Number of rounds"
                required
                options={[
                    { value: 1, label: "1 (one)" },
                    { value: 2, label: "2 (two)" },
                    { value: 3, label: "3 (three)" },
                    { value: 4, label: "4 (four)" },
                ]}
            />

            {gameMode == "online" && (
                <SelectDropdown
                    name="nSecondsPerGuess"
                    control={form.control}
                    label={t.createGameForm.secondsPerGuessLabel}
                    placeholder="Seconds per guess"
                    required
                    options={[
                        { value: 0, label: "no time" },
                        // { value: 5, label: "5s (DEV ONLY)" },
                        { value: 20, label: "20s" },
                        { value: 40, label: "40s" },
                        { value: 60, label: "60s" },
                        { value: 80, label: "80s" },
                        { value: 100, label: "100s" },
                    ]}
                />                      
            )}         

            <SwitchInput
                control={form.control}
                name="withStartingLetter"
                label={t.createGameForm.withStartingLetterLabel}
                Icon={LetterText}
            />         

            <div className="flex flex-row justify-between">
                <Label text={t.createGameForm.languageLabel} />
                {languageStyle?.flag}
            </div>

            <Seperator />

            <div className="text text-foreground-muted font-medium">
                {t.createGameForm.moreSettingsSoon}
            </div>

            <div>
                <Button 
                    variant="primary" 
                    type="submit" 
                    disable={submitDisabled} 
                    isLoadingExternal={isSubmitting}
                    className="w-full"
                >
                    <div className="flex items-center gap-1">
                        <Icon LucideIcon={Play} size="sm" /> {t.createGameForm.startButton}
                    </div>
                </Button>   
                <ErrorText>
                    <>{Object.values(form.formState.errors)[0]?.message}</>
                </ErrorText>
            </div>

            {onLeaveGame && (
                <Button variant="error" type="button" onClick={onLeaveGame} className="w-full" isLoadingExternal={isSubmitting}>
                    <div className="flex items-center gap-1">
                        Leave Game
                    </div>
                </Button>                              
            )}            
        </form>
    )
}