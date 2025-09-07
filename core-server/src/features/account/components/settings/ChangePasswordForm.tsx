"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChangePasswordSchema, changePasswordSchema } from "../../account-schemas"
import TextInput from "@/components/ui/form/TextInput";
import Button from "@/components/ui/Button";
import ChangePasswordCommand from "../../actions/command/change-password-command";
import { useMessageBar } from "@/components/layout/MessageBarContext";

export default function ChangePasswordForm() {
    const msgBar = useMessageBar();

    const form = useForm<ChangePasswordSchema>({
      resolver: zodResolver(changePasswordSchema)    
    });

    async function onSubmit(data: ChangePasswordSchema) {
        ChangePasswordCommand(data)
        .then((resp) => {
            if (resp.ok && resp.data) {
                msgBar.pushSuccessMsg("Updated");
            } else {
                throw Error();
            }
        })
        .catch(() => {
            msgBar.pushServerError();
        });
    }    

    return (
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <TextInput label="Current" {...form.register("oldPassword")} errorMsg={form.formState.errors.oldPassword?.message} type="password" />

            <TextInput label="New" {...form.register("newPassword")} errorMsg={form.formState.errors.newPassword?.message} type="password" />

            <Button className="w-full" type="submit" isLoadingExternal={form.formState.isSubmitting}>
                Change password
            </Button>
        </form>
    )
}