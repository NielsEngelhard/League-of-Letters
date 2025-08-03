import { useForm } from "react-hook-form"
import { createGameSchema, CreateGameSchema } from "../../game-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { GameMode } from "@/drizzle/schema"
import Seperator from "@/components/ui/Seperator"
import SelectDropdown from "@/components/ui/form/SelectInput"

interface Props {

}

export default function CreateGameForm() {

    const form = useForm<CreateGameSchema>({
      resolver: zodResolver(createGameSchema),
      defaultValues: {
        wordLength: 6,
        guessesPerRound: 6,
        totalRounds: 4,
        gameMode: GameMode.Solo
      }
    })    

    function onSubmit() {
        console.log("submit");
    }

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
        </form>
    )
}