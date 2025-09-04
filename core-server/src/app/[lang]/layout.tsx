import "../globals.css";
import "../animations.css";
import Header from "@/components/layout/header/Header";
import { Providers } from "@/components/layout/GlobalProviders";
import Footer from "@/components/layout/Footer";
import HeaderMessageBar from "@/components/layout/HeaderMessageBar";
import GlobalLoadingIndicator from "@/components/layout/GlobalLoadingIndicator";
import { use } from "react";
import { DefaultLanguage, SupportedLanguage, supportedLanguages } from "@/features/i18n/languages";
import { redirect } from "next/navigation";
import { HOME_ROUTE, LANGUAGE_ROUTE } from "../routes";
import LayoutClient from "@/components/layout/LayoutClient";

export default function LangRootLayout({
  children,
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>,
  children: React.ReactNode;
}) {
  const { lang } = use(params);

  if (!supportedLanguages.includes(lang)) {
    redirect(LANGUAGE_ROUTE(DefaultLanguage, HOME_ROUTE));
  }

  return (
    <Providers lang={lang} actionsServerUrl={process.env.NEXT_PUBLIC_ACTIONS_SERVER_BASE_ADDRESS ?? "ERROR"}>
      
      <GlobalLoadingIndicator />
      <LayoutClient />
      <HeaderMessageBar />

      <Header lang={lang} />
      <div className="mt-[60px]">        
        <div className="flex justify-center bg-background h-full">
          {children}
        </div>
      </div>
      <Footer lang={lang} />
    </Providers>
  );
}