"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChangePasswordSchema, changePasswordSchema } from "../../account-schemas"
import TextInput from "@/components/ui/form/TextInput";
import ChangePasswordCommand from "../../actions/command/change-password-command";
import FormBase from "@/components/general/form/FormBase";

export default function ChangePasswordForm() {

    const form = useForm<ChangePasswordSchema>({
      resolver: zodResolver(changePasswordSchema)    
    });

    return (
        <FormBase  form={form}  onSubmit={ChangePasswordCommand}>
            <TextInput label="Current" {...form.register("oldPassword")} errorMsg={form.formState.errors.oldPassword?.message} type="password" />

            <TextInput label="New" {...form.register("newPassword")} errorMsg={form.formState.errors.newPassword?.message} type="password" />
        </FormBase>        
    )
}