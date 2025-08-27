import type { Metadata } from "next";
import localFont from 'next/font/local'
import "../globals.css";
import "../animations.css";
import Header from "@/components/layout/Header";
import { Providers } from "@/components/layout/GlobalProviders";
import Footer from "@/components/layout/Footer";
import HeaderMessageBar from "@/components/layout/HeaderMessageBar";
import GlobalLoadingIndicator from "@/components/layout/GlobalLoadingIndicator";
import { APP_NAME } from "../global-constants";
import { SupportedLanguage, supportedLanguages } from "@/features/i18n/languages";
import { use } from "react";

const inter = localFont({
  src: [
    // Thin
    {
      path: '../../../public/fonts/Inter/Inter_24pt-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    
    // Extra Light
    {
      path: '../../../public/fonts/Inter/Inter_24pt-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    
    // Light
    {
      path: '../../../public/fonts/Inter/Inter_24pt-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    
    // Regular
    {
      path: '../../../public/fonts/Inter/Inter_24pt-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    
    // Medium
    {
      path: '../../../public/fonts/Inter/Inter_24pt-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    
    // Semi Bold
    {
      path: '../../../public/fonts/Inter/Inter_24pt-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    
    // Bold
    {
      path: '../../../public/fonts/Inter/Inter_24pt-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    
    // Extra Bold
    {
      path: '../../../public/fonts/Inter/Inter_24pt-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    
    // Black
    {
      path: '../../../public/fonts/Inter/Inter_24pt-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Inter/Inter_24pt-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Have some fun!",
};

export async function generateStaticParams() {
  return supportedLanguages.map((locale) => ({ lang: locale }))
}

export default function LangRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = use(params);

  if (supportedLanguages.includes(lang)) {
    // notFound()
  }

  return (
    <html lang={lang}>
      <body className={`${inter.variable} antialiased min-h-screen justify-between flex flex-col`}>
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
      </body>
    </html>
  );
}