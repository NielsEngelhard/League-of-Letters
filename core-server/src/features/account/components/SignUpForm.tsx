import TextInput from "@/components/ui/form/TextInput";
import { useForm } from "react-hook-form";
import { signUpSchema, SignUpSchema } from "../account-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/text/ErrorText";
import { IdCard } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import CreateAccountCommand from "../../auth/actions/command/create-account-command";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";

export default function SignUpForm() {
    const authContext = useAuth();

    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            password: "",
            email: ""
        }
    })

    async function onSubmit(data: SignUpSchema) {
        const error = await CreateAccountCommand(data);
        if (!error) {
            await authContext.login({ username: data.email, password: data.password });
        } 

        form.setError("root", {
            type: "manual",
            message: error
        });
    }

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <TextInput label="Email" placeholder="Your Email address" {...form.register("email")} errorMsg={form.formState.errors.email?.message} required />

            <TextInput label="Password" placeholder="Enter your password" type="password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} required />

            <TextInput label="Username" placeholder="Your username" {...form.register("username")} errorMsg={form.formState.errors.username?.message} />

            <div className="flex flex-col gap-0.5">
                <SelectLanguageGrid name="language" control={form.control} />
                <p className="text-xs font-bold text-foreground-muted text-center">The language you choose is the language your words will be in!</p>
            </div>

            <Button type="submit">
                <IdCard className="w-6 h-6" />
                Create Account
            </Button>

            <ErrorText>
                <span>
                    {form.formState.errors.root?.message}
                </span>
            </ErrorText>
        </form>     
    )
}