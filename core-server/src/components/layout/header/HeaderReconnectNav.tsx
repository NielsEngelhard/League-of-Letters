import { LANGUAGE_ROUTE, RECONNECT_ROUTE } from "@/app/routes";
import Icon from "@/components/ui/Icon";
import { SupportedLanguage } from "@/features/i18n/languages";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";

interface Props {
    lang: SupportedLanguage;
}

export default function HeaderReconnectNav({lang}: Props) {
    return (
        <Link href={LANGUAGE_ROUTE(lang, RECONNECT_ROUTE)}>
            <div className="text-foreground-muted">
                <Icon LucideIcon={RefreshCcw} size="sm" />
            </div>
        </Link>
    )
}