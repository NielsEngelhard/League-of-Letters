import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SelectDropdown from "@/components/ui/form/SelectInput";
import { zodResolver } from "@hookform/resolvers/zod"
import { Dock, KeyboardMusic, LetterText, Music, Settings, Volume2 } from "lucide-react";
import { useForm } from "react-hook-form"
import { settingsSchema, SettingsSchema } from "../account-schemas";
import SwitchInput from "@/components/ui/form/SwitchInput";
import Label from "@/components/ui/form/Label";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import UpdateCurrentUserSettingsCommand from "../actions/command/update-current-user-settings";
import { useMessageBar } from "@/components/layout/MessageBarContext";

export default function SettingsCard() {
    const { settings, setSettingsOnClient } = useAuth();
    const [atLeastOneSettingChanged, setAtLeastOneSettingChanged] = useState(false);
    const { pushMessage } = useMessageBar();

    const form = useForm<SettingsSchema>({
      resolver: zodResolver(settingsSchema),
      defaultValues: settings
    })

    const watchedValues = form.watch();

    useEffect(() => {
        const subscription = form.watch((value) => {
            setSettingsOnClient(value as SettingsSchema);
            setAtLeastOneSettingChanged(true);
        });

        return () => subscription.unsubscribe();
    }, [form]);

    async function onSubmit() {
        await saveSettingsOnServer(watchedValues);
        setAtLeastOneSettingChanged(false);
    }

    async function saveSettingsOnServer(updatedSettings: SettingsSchema) {
        UpdateCurrentUserSettingsCommand(updatedSettings)
            .then(() => {
                pushMessage({ msg: "Settings saved", type: "success" }, 3);
            })
            .catch(() => {
                pushMessage({ msg: "Try again later", type: "error" }, 3);
            });
    }

    useEffect(() => {
        if (!settings.theme) return;

        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

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
                            name="theme"
                            control={form.control}
                            label="Theme"
                            placeholder="Choose your theme"
                            required
                            options={[
                                { value: "light", label: "light" },
                                { value: "dark", label: "dark" },
                                { value: "candy", label: "candy" },
                                { value: "hackerman", label: "h_a_c_k_e_r" }
                            ]}
                        />      

                    <div>
                        <Label text="Keyboard Settings" />
                        <div className="flex flex-col gap-2">
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
                            <SwitchInput
                                label="Show keyboard hints"
                                Icon={KeyboardMusic}
                                control={form.control}
                                name="showKeyboardHints"                                     
                            />
                            <SwitchInput
                                label="Show guessed letters bar"
                                Icon={Dock}
                                control={form.control}
                                name="showGuessedLettersBar"                                     
                            />                            
                            <SwitchInput
                                label="Letters on top of screen"
                                Icon={LetterText}
                                control={form.control}
                                name="showLettersOnTopOfScreen"
                                disabled={settings.showGuessedLettersBar == false}             
                            />
                            <SwitchInput
                                label="Pre fill guess"
                                Icon={LetterText}
                                control={form.control}
                                name="preFillGuess"
                            />                                                                                               
                        </div>                        
                    </div>                                       
                    
                    <div>
                        <Label text="Audio Settings (coming soon)" />
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

                    <Button type="submit" className="mt-2" disable={!atLeastOneSettingChanged}>
                        Save
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}