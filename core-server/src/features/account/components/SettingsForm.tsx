"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CaseUpper, CheckCheck, KeyboardMusic, Music, Volume2 } from "lucide-react";
import { useForm } from "react-hook-form"
import { settingsSchema, SettingsSchema } from "../account-schemas";
import SwitchInput from "@/components/ui/form/SwitchInput";
import Label from "@/components/ui/form/Label";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { useToaster } from "@/components/general/toaster/ToasterContext";
import UpdateCurrentUserSettingsCommand from "../actions/command/update-current-user-settings";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";

interface Props {
    t: SettingsTranslations;
}

export default function SettingsForm({ t }: Props) {
    const { settings, setSettingsOnClient } = useAuth();
    const [atLeastOneSettingChanged, setAtLeastOneSettingChanged] = useState(false);
    const { pushToast } = useToaster();

    const form = useForm<SettingsSchema>({
      resolver: zodResolver(settingsSchema),
      defaultValues: settings
    });

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
                pushToast({ msg: "Settings saved", type: "success" }, 3);
            })
            .catch(() => {
                pushToast({ msg: "Try again later", type: "error" }, 3);
            });
    }

    return (
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>    

            {/* Keyboard Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <KeyboardMusic className="w-4 h-4 text-muted-foreground" />
                    <Label text={t.settings.featureGroups.keyboardInputLabel} />
                </div>
                <div className="pl-6 space-y-6">
                    <SwitchInput
                        label={t.settings.features.showKeyboardHints.title}
                        description={t.settings.features.showKeyboardHints.description}
                        Icon={KeyboardMusic}
                        control={form.control}
                        name="showKeyboardHints"                                     
                    />

                    <SwitchInput
                        label={t.settings.features.highlightCompleteLetters.title}
                        description={t.settings.features.highlightCompleteLetters.description}
                        Icon={CheckCheck}
                        control={form.control}
                        name="showCompleteCorrect"
                    />                         

                    <SwitchInput
                        label={t.settings.features.preFill.title}
                        description={t.settings.features.preFill.description}
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
                    <Label text={t.settings.featureGroups.audioLabel} />
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        Coming Soon
                    </span>
                </div>
                <div className="pl-6 space-y-6">
                    <SwitchInput
                        label={t.settings.features.enableSoundEffects.title}
                        description={t.settings.features.enableSoundEffects.description}
                        Icon={Volume2}
                        control={form.control}
                        name="playSoundEffects"                                     
                    />

                    <SwitchInput
                        label={t.settings.features.enableBackgroundMusic.title}
                        description={t.settings.features.enableBackgroundMusic.description}
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
                    {t.settings.saveButton}
                </Button>
            </div>
        </form>                
    )
}