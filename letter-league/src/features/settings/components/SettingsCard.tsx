import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SelectDropdown from "@/components/ui/form/SelectInput";
import { zodResolver } from "@hookform/resolvers/zod"
import { Settings } from "lucide-react";
import { useForm } from "react-hook-form"
import { settingsSchema, SettingsSchema } from "../settings-schemas";

export default function SettingsCard() {

    const form = useForm<SettingsSchema>({
      resolver: zodResolver(settingsSchema)
    })

    function onSubmit() {
        console.log("UPDATE SETTINGS");
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
                    <SelectDropdown
                        name="keyboardInput"
                        control={form.control}
                        label="Input preference"
                        placeholder="Input type"
                        required
                        options={[
                            { value: "on-screen-keyboard", label: "On screen Keyboard" },
                            { value: "html-input", label: "Input Box" },
                            { value: "keystroke", label: "External keyboard" }
                        ]}
                    />                    
                </form>
            </CardContent>
        </Card>
    )
}