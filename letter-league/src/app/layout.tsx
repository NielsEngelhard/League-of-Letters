import type { Metadata } from "next";
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
  description: "Have some fun!",
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