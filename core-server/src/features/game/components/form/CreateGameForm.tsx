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
import LanguagePicker from "@/components/ui/form/LanguagePicker"

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

    // Each rounds must be dividable by n_players so that every player has the same order structure once (regarding starting position and order after that)
    const numberOfRoundsMultiplier = (players && players.length > 0) ? players?.length : 1;

    function onSubmit(data: CreateGameSchema) {
        if (gameMode == "online") {
            CreateOnlineGameBasedOnLobbyCommand(data)
            .catch(() => {
                form.setError("root", {
                    type: "manual",
                    message: "Server error",
                });
            });
        } else {
            // Solo game
            CreateGameCommand(data)
            .then((gameId) => {
                router.push(LANGUAGE_ROUTE(lang, PLAY_SOLO_GAME_ROUTE(gameId)));
            })
            .catch(() => {
                form.setError("root", {
                    type: "manual",
                    message: "Server error",
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
        nSecondsPerGuess: gameMode == "online" ? 40 : 0,
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
            <div className="flex flex-col md:flex-row gap-2">
                <SelectDropdown
                    className="w-full"
                    name="wordLength"
                    control={form.control}
                    label={t.createGameForm.wordLengthLabel}
                    placeholder="Length of each word"
                    required
                    options={[
                        // { value: 4, label: t.createGameForm.wordLengthOptions.four },
                        { value: 5, label: t.createGameForm.wordLengthOptions.five },
                        { value: 6, label: t.createGameForm.wordLengthOptions.six },
                        { value: 7, label: t.createGameForm.wordLengthOptions.seven },
                        // { value: 8, label: t.createGameForm.wordLengthOptions.eight },
                        // { value: 9, label: t.createGameForm.wordLengthOptions.nine },
                        // { value: 10, label: t.createGameForm.wordLengthOptions.ten },
                        // { value: 11, label: t.createGameForm.wordLengthOptions.eleven },
                        // { value: 12, label: t.createGameForm.wordLengthOptions.twelve },
                    ]}
                />

                <SelectDropdown
                    className="w-full"
                    name="totalRounds"
                    control={form.control}
                    label={t.createGameForm.totalRoundsLabel}
                    placeholder="Number of rounds"
                    required
                    options={[
                        { value: numberOfRoundsMultiplier * 1, label: `${(numberOfRoundsMultiplier * 1).toString()} (1pp)` },
                        { value: numberOfRoundsMultiplier * 2, label: `${(numberOfRoundsMultiplier * 2).toString()} (2pp)` },
                        { value: numberOfRoundsMultiplier * 3, label: `${(numberOfRoundsMultiplier * 3).toString()} (3pp)` },
                        { value: numberOfRoundsMultiplier * 4, label: `${(numberOfRoundsMultiplier * 4).toString()} (4pp)` },
                    ]}
                />                
            </div>

            <div className="flex flex-col md:flex-row gap-2">
                {gameMode == "online" && (
                    <SelectDropdown
                        className="w-full"
                        key={form.watch("language")}
                        name="nSecondsPerGuess"
                        control={form.control}
                        label={t.createGameForm.secondsPerGuessLabel}
                        placeholder=""
                        required
                        options={[
                            { value: 0, label: "∞" },
                            { value: 40, label: "40s" },
                            { value: 60, label: "60s" },
                            { value: 80, label: "80s" },
                            { value: 100, label: "100s" },
                        ]}
                    />
                )}

                <SelectDropdown
                    key={form.watch("guessesPerRound")}
                    className="w-full"
                    name="guessesPerRound"
                    control={form.control}
                    label={t.createGameForm.guessesPerRoundLabel}
                    required
                    options={[
                        { value: 1, label: "1" },
                        { value: 4, label: "4" },
                        { value: 5, label: "5" },
                        { value: 6, label: "6" },
                        { value: 7, label: "7" },
                        { value: 8, label: "8" },
                    ]}
                /> 
            </div>

            <div className="flex flex-col md:flex-row gap-2">
                <div className="items-end flex">
                    <LanguagePicker
                        currentLanguage={form.getValues("language")}
                        onLanguageChange={(newLang: SupportedLanguage) => form.setValue("language", newLang)}
                    />                          
                </div>
            </div>

            <SwitchInput
                control={form.control}
                name="withStartingLetter"
                label={t.createGameForm.withStartingLetterLabel}
                Icon={LetterText}
            />         

            <Seperator />

            <div className="text text-foreground-muted font-medium">
                {t.createGameForm.moreSettingsSoon}
            </div>

            <div>
                <Button 
                    variant="primaryFade" 
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