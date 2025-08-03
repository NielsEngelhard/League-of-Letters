import { useForm } from "react-hook-form"
import { createGameSchema, CreateGameSchema } from "../../game-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { GameMode } from "@/drizzle/schema"
import TextInput from "@/components/ui/form/TextInput"
import Seperator from "@/components/ui/Seperator"

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
            <TextInput
                label="Word Length"
                subText="Choose the length of words you want to guess"
                {...form.register("wordLength")}
            />

            <Seperator />

            <div className="text text-foreground-muted font-medium">
                More settings coming soon...
            </div>            
        </form>
    )
}