import { useForm } from "react-hook-form";
import { guestLoginSchema, GuestLoginSchema } from "../account-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/text/ErrorText";
import { IdCard } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import SelectDropdown from "@/components/ui/form/SelectInput";
import { supportedLanguages } from "@/features/i18n/languages";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";

export default function GuestLoginForm() {
    const authContext = useAuth();

    const form = useForm<GuestLoginSchema>({
        resolver: zodResolver(guestLoginSchema),
        defaultValues: {
            language: "nl"
        }
    })

    async function onSubmit(data: GuestLoginSchema) {
        // const error = await CreateAccountCommand(data);
        // if (!error) {
        //     await authContext.login({ username: data.email, password: data.password });
        // } 

        // form.setError("root", {
        //     type: "manual",
        //     message: error
        // });
    }

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <SelectLanguageGrid />

            <Button type="submit">
                <IdCard className="w-6 h-6" />
                Create guest session
            </Button>

            <ErrorText>
                <span>
                    {form.formState.errors.root?.message}
                </span>
            </ErrorText>
        </form>     
    )
}