import { useForm } from "react-hook-form"
import { CreateGamePlayerSchema, createGameSchema, CreateGameSchema } from "../../game-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { GameMode } from "@/drizzle/schema"
import Seperator from "@/components/ui/Seperator"
import SelectDropdown from "@/components/ui/form/SelectInput"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { Play } from "lucide-react"
import ErrorText from "@/components/ui/text/ErrorText"
import { useEffect } from "react"

interface Props {
    onSubmit: (data: CreateGameSchema) => void;
    submitDisabled?: boolean;
    onLeaveGame?: () => void;
    players?: CreateGamePlayerSchema[];
    gameMode?: GameMode;
    gameId?: string;
}

export default function CreateGameForm({ onSubmit, onLeaveGame, submitDisabled = false, players, gameMode = "solo", gameId }: Props) {

    const form = useForm<CreateGameSchema>({
      resolver: zodResolver(createGameSchema),
      defaultValues: {
        wordLength: 6,
        guessesPerRound: 6,
        totalRounds: 4,
        gameMode: gameMode,
        gameId: gameId,
        nSecondsPerGuess: gameMode == "online" ? 40 : undefined
      }
    })    

    useEffect(() => {
        if (!players || players.length == 0 || !form) return;        
        
        form.setValue("players", players);
    }, [players, form]);

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <SelectDropdown
                name="wordLength"
                control={form.control}
                label="Word length"
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
                label="Total Rounds"
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
                    label="Seconds per guess"
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

            <Seperator />

            <div className="text text-foreground-muted font-medium">
                More settings coming soon...
            </div>

            <div>
                <Button variant="primary" type="submit" disable={submitDisabled} className="w-full">
                    <div className="flex items-center gap-1">
                        <Icon LucideIcon={Play} size="sm" /> Start Game
                    </div>
                </Button>   
                <ErrorText>
                    <>{Object.values(form.formState.errors)[0]?.message}</>
                </ErrorText>  
            </div>

            {onLeaveGame && (
                <Button variant="error" type="button" onClick={onLeaveGame} className="w-full">
                    <div className="flex items-center gap-1">
                        Leave Game
                    </div>
                </Button>                  
            )}            
        </form>
    )
}