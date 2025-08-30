import TextInput from "@/components/ui/form/TextInput";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../account-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/text/ErrorText";
import { IdCard, LogIn } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

interface Props {
    onNavToSignUp: () => void;
}

export default function LoginForm({ onNavToSignUp }: Props) {
    const authContext = useAuth();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    async function onSubmit(data: LoginSchema) {
        try {
            const error = await authContext.login(data);
  
            if (error) {
                form.setError("root", {
                    type: "manual",
                    message: error
                });
            }
            // If no error, the login was successful
        } catch (err) {
            form.setError("root", {
                type: "manual",
                message: "An unexpected error occurred"
            });
        }
    }

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <TextInput label="Email/Username" placeholder="Your login name" {...form.register("username")} errorMsg={form.formState.errors.username?.message} required />

            <TextInput label="Password" placeholder="Enter your password" type="password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} required />

            <div className="flex flex-col md:flex-row gap-4">
                <Button variant="primary" className="w-full" type="submit" isLoadingExternal={authContext.isLoading}>
                    <LogIn className="w-4 h-4" />
                    Login
                </Button>
                <Button variant="secondary" className="w-full" onClick={onNavToSignUp} isLoadingExternal={authContext.isLoading}>
                    <IdCard className="w-4 h-4" />
                    Sign Up
                </Button>                        
            </div>

            <ErrorText>
                <span>
                    {form.formState.errors.root?.message}
                </span>
            </ErrorText>
        </form>        
    )
}