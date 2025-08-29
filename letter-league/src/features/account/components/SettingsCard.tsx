"use client"

import Card from "@/components/ui/card/Card";
import SelectDropdown from "@/components/ui/form/SelectInput";
import { zodResolver } from "@hookform/resolvers/zod"
import { CaseUpper, CheckCheck, Dock, KeyboardMusic, LetterText, Music, Palette, Settings, Volume2 } from "lucide-react";
import { useForm } from "react-hook-form"
import { settingsSchema, SettingsSchema } from "../account-schemas";
import SwitchInput from "@/components/ui/form/SwitchInput";
import Label from "@/components/ui/form/Label";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import UpdateCurrentUserSettingsCommand from "../actions/command/update-current-user-settings";
import ExpandableCardContent from "@/components/ui/card/ExpandableCardContent";

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
            <ExpandableCardContent Icon={Settings} title="Settings"
                description="Click to customize the settings to your liking">
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>    
                    {/* Appearance Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                            <Palette className="w-4 h-4 text-muted-foreground" />
                            <Label text="Appearance" />
                        </div>
                        <div className="pl-6 space-y-3">
                            <SelectDropdown
                                name="theme"
                                control={form.control}
                                label="Theme"
                                placeholder="Choose your theme"
                                required
                                options={[
                                    { value: "light", label: "Light" },
                                    { value: "dark", label: "Dark" },
                                    { value: "candy", label: "Candy" },
                                    { value: "hackerman", label: "Hacker" }
                                ]}
                            />
                            <p className="text-xs text-muted-foreground">
                                Select your preferred visual theme for the application
                            </p>
                        </div>
                    </div>

                    {/* Keyboard Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                            <KeyboardMusic className="w-4 h-4 text-muted-foreground" />
                            <Label text="Keyboard & Input" />
                        </div>
                        <div className="pl-6 space-y-6">
                            <div className="space-y-3">
                                <SelectDropdown
                                    name="keyboardInput"
                                    control={form.control}
                                    label="Input Method"
                                    placeholder="Select input type"
                                    required
                                    options={[
                                        { value: "on-screen-keyboard", label: "On-screen Keyboard" },
                                        { value: "html-input", label: "Input Box" },
                                        { value: "keystroke", label: "External Keyboard" }
                                    ]}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Choose how you want to input letters during the game
                                </p>
                            </div>

                            <SwitchInput
                                label="Show keyboard hints"
                                description="Display helpful hints and shortcuts on the keyboard"
                                Icon={KeyboardMusic}
                                control={form.control}
                                name="showKeyboardHints"                                     
                            />

                            <SwitchInput
                                label="Highlight 'Complete Correct' letters"
                                description="Highlight letters that are correct and do not occur anymore with special styling"
                                Icon={CheckCheck}
                                control={form.control}
                                name="showCompleteCorrect"
                            />                         

                            <SwitchInput
                                label="Pre-fill guess"
                                description="Automatically populate your guess as you type"
                                Icon={CaseUpper}
                                control={form.control}
                                name="preFillGuess"
                            />
                        </div>                        
                    </div>                                       
                    
                    {/* Audio Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                            <Label text="Audio Settings" />
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                Coming Soon
                            </span>
                        </div>
                        <div className="pl-6 space-y-6">
                            <SwitchInput
                                label="Enable sound effects"
                                description="Play audio feedback for game actions and events"
                                Icon={Volume2}
                                control={form.control}
                                name="playSoundEffects"                                     
                            />

                            <SwitchInput
                                label="Enable background music"
                                description="Play ambient music while playing the game"
                                Icon={Music}
                                control={form.control}
                                name="playBackgroundMusic"                                     
                            />
                        </div>                        
                    </div>

                    <div className="pt-4 border-t border-border/50">
                        <Button 
                            type="submit" 
                            className="w-full sm:w-auto px-8" 
                            disable={!atLeastOneSettingChanged}
                        >
                            Save Settings
                        </Button>
                    </div>
                </form>                
            </ExpandableCardContent>
        </Card>
    )
}