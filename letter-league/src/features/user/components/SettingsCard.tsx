import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SelectDropdown from "@/components/ui/form/SelectInput";
import { zodResolver } from "@hookform/resolvers/zod"
import { Moon, Music, Settings, Volume2 } from "lucide-react";
import { useForm } from "react-hook-form"
import { settingsSchema, SettingsSchema } from "../profile-schemas";
import SwitchInput from "@/components/ui/form/SwitchInput";
import Label from "@/components/ui/form/Label";

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

                        <SelectDropdown
                            name="theme"
                            control={form.control}
                            label="Theme"
                            placeholder="Choose your theme"
                            required
                            options={[
                                { value: "light", label: "light" },
                                { value: "dark", label: "dark" },
                                { value: "candy", label: "candy" }
                            ]}
                        />                     
                    
                    <div>
                        <Label text="Audio Settings" />
                        <div className="flex flex-col gap-2">
                            <SwitchInput
                                label="Enable Sound Effects"
                                Icon={Volume2}
                                control={form.control}
                                name="playSoundEffects"                                     
                            />
                            <SwitchInput
                                label="Enable Background Music"
                                Icon={Music}
                                control={form.control}
                                name="playBackgroundMusic"                                     
                            />                                       
                        </div>                        
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}