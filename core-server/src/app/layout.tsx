import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import "./animations.css";
import { APP_NAME } from "./global-constants";

const inter = localFont({
  src: [
    // Thin
    {
      path: '../../public/fonts/Inter/Inter_24pt-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    
    // Extra Light
    {
      path: '../../public/fonts/Inter/Inter_24pt-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    
    // Light
    {
      path: '../../public/fonts/Inter/Inter_24pt-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    
    // Regular
    {
      path: '../../public/fonts/Inter/Inter_24pt-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    
    // Medium
    {
      path: '../../public/fonts/Inter/Inter_24pt-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    
    // Semi Bold
    {
      path: '../../public/fonts/Inter/Inter_24pt-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    
    // Bold
    {
      path: '../../public/fonts/Inter/Inter_24pt-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    
    // Extra Bold
    {
      path: '../../public/fonts/Inter/Inter_24pt-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    
    // Black
    {
      path: '../../public/fonts/Inter/Inter_24pt-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter_24pt-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "League of Letters — an online multiplayer word guessing game - multilingual support.",
  keywords: [
    "wordle multiplayer",
    "multiplayer wordle",
    "word game",
    "word guessing game",
    "league of letters",
    "online game",
    "puzzle",
  ],
  applicationName: APP_NAME,
  openGraph: {
    title: APP_NAME,
    description:
      "Challenge friends or strangers in League of Letters — the ultimate online multiplayer word guessing game!",
    url: "https://league-of-letters.online",
    siteName: APP_NAME,
    images: [
      {
        url: "https://league-of-letters.online/logo.png", // 🔗 replace with your logo or custom banner
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description:
      "Challenge friends or strangers in League of Letters — the ultimate online multiplayer word guessing game!",
    images: ["https://league-of-letters.online/logo.png"], // same as above
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// Disable zooming in (especially usefull for preventing mobile double tap)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,

}: {
  children: React.ReactNode;
}) {

  return (
    <html >
      <body className={`${inter.variable} antialiased min-h-screen justify-between flex flex-col`}>
        {children}
      </body>
    </html>
  );
}