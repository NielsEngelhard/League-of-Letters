import { useForm } from "react-hook-form"
import { createGameSchema, CreateGameSchema } from "../../game-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { GameMode } from "@/drizzle/schema"
import Seperator from "@/components/ui/Seperator"
import SelectDropdown from "@/components/ui/form/SelectInput"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { Play } from "lucide-react"

interface Props {
    onSubmit: (data: CreateGameSchema) => void;
}

export default function CreateGameForm({ onSubmit }: Props) {

    const form = useForm<CreateGameSchema>({
      resolver: zodResolver(createGameSchema),
      defaultValues: {
        wordLength: 6,
        guessesPerRound: 6,
        totalRounds: 4,
        gameMode: GameMode.Solo
      }
    })    

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

            <Seperator />

            <div className="text text-foreground-muted font-medium">
                More settings coming soon...
            </div>

            <Button variant="primary" type="submit">
                <div className="flex items-center gap-1">
                    <Icon LucideIcon={Play} size="sm" /> Start Game
                </div>
            </Button>            
        </form>
    )
}