"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChangePasswordSchema, changePasswordSchema } from "../../account-schemas"
import TextInput from "@/components/ui/form/TextInput";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import { waitDelay } from "@/lib/debug-util";
import ChangePasswordCommand from "../../actions/command/change-password-command";

export default function ChangePasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const globalMessageProvider = useMessageBar();

    const form = useForm<ChangePasswordSchema>({
      resolver: zodResolver(changePasswordSchema)    
    });

    async function onSubmit(data: ChangePasswordSchema) {
        setIsLoading(true);

        try {
            const result = await ChangePasswordCommand(data);

            if (result.ok == false) {
                globalMessageProvider.pushErrorMsg(result.errorMsg);
                return;
            }

            const resultData = result.data;
            globalMessageProvider.pushSuccessMsg("Updated");
        } catch {
            globalMessageProvider.pushErrorMsg("Server error");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <TextInput label="Current" {...form.register("oldPassword")} errorMsg={form.formState.errors.oldPassword?.message} />

            <TextInput label="New" {...form.register("newPassword")} errorMsg={form.formState.errors.newPassword?.message} />

            <Button className="w-full" type="submit" isLoadingExternal={isLoading}>
                Change password
            </Button>
        </form>
    )
}