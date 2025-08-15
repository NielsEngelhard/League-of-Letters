import TextInput from "@/components/ui/form/TextInput";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../account-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/text/ErrorText";

export default function LoginForm() {

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    async function onSubmit(data: LoginSchema) {
        // var error = await login(data);

        // form.setError("root", {
        //     type: "manual",
        //     message: error
        // });        
    }    

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <TextInput label="Email/Username" placeholder="Your login name" {...form.register("username")} errorMsg={form.formState.errors.username?.message} required />

            <TextInput label="Password" placeholder="Enter your password" type="password" {...form.register("password")} errorMsg={form.formState.errors.password?.message} required />

            <div className="flex flex-col md:flex-row gap-4">
                <Button variant="primary" className="w-full">
                    Login
                </Button>
                <Button variant="skeleton" className="w-full">
                    Continue as Guest
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