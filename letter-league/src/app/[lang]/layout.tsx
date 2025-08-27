import "../globals.css";
import "../animations.css";
import Header from "@/components/layout/Header";
import { Providers } from "@/components/layout/GlobalProviders";
import Footer from "@/components/layout/Footer";
import HeaderMessageBar from "@/components/layout/HeaderMessageBar";
import GlobalLoadingIndicator from "@/components/layout/GlobalLoadingIndicator";
import { use } from "react";
import { SupportedLanguage, supportedLanguages } from "@/features/i18n/languages";
import { redirect } from "next/navigation";

export default function LangRootLayout({
  children,
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>,
  children: React.ReactNode;
}) {
  const { lang } = use(params);

  if (!supportedLanguages.includes(lang)) {
    redirect("/en");
  }

  return (
    <Providers>
      <GlobalLoadingIndicator />
      <Header />
      <div className="mt-[60px]">
        <HeaderMessageBar />
        <div className="flex justify-center bg-background h-full">
          {children}
        </div>
      </div>
      <Footer />
    </Providers>
  );
}