"use client";

import { useState } from "react";
import { CircleUser, Menu, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE, PROFILE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

interface Props {
    lang: SupportedLanguage;
    t: GeneralTranslations;
}

export default function MobileSubHeader({ lang, t }: Props) {
    const [show, setShow] = useState(true);
    const router = useRouter();

    function onNavItemClicked(href: string) {
        setShow(false);
        router.push(href);
    }

    return (
        <>
            <div className="flex md:hidden">
                <button className="flex items-center text-foreground" type="button" onClick={() => setShow(prev => !prev)}>
                    <Menu size={26} />
                </button>
            </div>

            {show && (
                <div className="fixed left-0 top-[52px] w-full flex flex-col py-4 px-6 bg-background-secondary border-t border-border shadow-lg border-b-2 transition-all duration-300 ease-in-out">
                    <div className="flex flex-col gap-4 my-10">
                        <div className="flex flex-row gap-4 w-full">
                            <Button variant="primary" corners="square" className="w-full" onClick={() => onNavItemClicked(LANGUAGE_ROUTE(lang, SOLO_GAME_ROUTE))}>
                                <Icon LucideIcon={User} size="sm" />
                                {t.nav.soloGame}
                            </Button>
                            <Button variant="secondary" corners="square" className="w-full" onClick={() => onNavItemClicked(LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE))}>
                                <Icon LucideIcon={Users} size="sm" />
                                {t.nav.onlineGame}
                            </Button>
                        </div>

                        <div>
                            <Button variant="skeleton" corners="square" className="w-full" onClick={() => onNavItemClicked(LANGUAGE_ROUTE(lang, PROFILE_ROUTE))}>
                                <Icon LucideIcon={CircleUser} size="sm" />
                                {t.nav.profile}
                            </Button>                        
                        </div>                        
                    </div>
                </div>                
            )}
        </>
    )
}