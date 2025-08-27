import { useForm } from "react-hook-form";
import { guestLoginSchema, GuestLoginSchema } from "../account-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/text/ErrorText";
import { IdCard } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import SelectLanguageGrid from "@/features/language/component/SelectLanguageGrid";
import { useRouter } from "next/navigation";
import { PICK_GAME_MODE_ROUTE } from "@/app/routes";
import { useRouteToPage } from "@/app/useRouteToPage";

export default function GuestLoginForm() {
    const authContext = useAuth();
    const router = useRouter();
    const route = useRouteToPage();

    const form = useForm<GuestLoginSchema>({
        resolver: zodResolver(guestLoginSchema),
        defaultValues: {
            language: "nl"
        }
    })

    async function onSubmit(data: GuestLoginSchema) {
        try {
            const account = await authContext.loginWithGuestAccount(data);
            if (!account) throw Error("Something went wrong");

            router.push(route(PICK_GAME_MODE_ROUTE));
        } catch (err) {
            form.setError("root", {
                type: "manual",
                message: "Something went wrong, try again later"
            });
        }
    }

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <SelectLanguageGrid name="language" control={form.control} />

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