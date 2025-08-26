import { useForm } from "react-hook-form";
import { guestLoginSchema, GuestLoginSchema } from "../account-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/text/ErrorText";
import { IdCard } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import CreateGuestSessionCommand from "@/features/auth/actions/command/create-guest-session-command";

export default function GuestLoginForm() {
    const authContext = useAuth();

    const form = useForm<GuestLoginSchema>({
        resolver: zodResolver(guestLoginSchema),
        defaultValues: {
            language: "nl"
        }
    })

    async function onSubmit(data: GuestLoginSchema) {
        try {
            const account = await authContext.loginWithGuestAccount(data);
        } catch (err) {
            form.setError("root", {
                type: "manual",
                message: "Something went wrong, try again later"
            });
        }
    }

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            
            <div className="space-y-4">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Select Language
                </h3>
                <p className="text-foreground-muted text-sm">
                    Choose your preferred language
                </p>
            </div>

                <SelectLanguageGrid name="language" control={form.control} />
            </div>

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