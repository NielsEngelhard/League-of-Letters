import TextInput from "@/components/ui/form/TextInput";
import Seperator from "@/components/ui/Seperator";

export default function GameSettingsPicker() {
    return (
        <form className="w-full">
            <TextInput
                label="Word Length"
                subText="Choose the length of words you want to guess"
            />

            <Seperator />

            <div className="text text-foreground-muted font-medium">
                More settings coming soon...
            </div>
        </form>
    )
}