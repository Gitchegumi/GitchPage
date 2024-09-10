"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";
import { ReactNode } from "react";
import { usePathname } from 'next/navigation';

export default function RootLayout({ 
  children
}: { 
  children: ReactNode,
}) {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);

  const isVoiceOverPage = pathname === '/voice-over';
  const headerBackgroundImage = isVoiceOverPage ? '/assets/images/Background.png' : undefined;

  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="theme"
        >
          <Header />
          <main className="flex min-h-screen flex-col items-center justify-between font-oswald">
            <div className="
              relative
              flex
              flex-col
              place-items-center
              before:absolute
              before:h-[300px]
              before:w-full
              before:translate-y-full
              before:-translate-x-1/2
              before:rounded-full
              before:bg-gradient-radial
              before:from-white
              before:to-transparent
              before:blur-2xl
              before:content-['']
              after:absolute
              after:h-[180px]
              after:w-full
              after:translate-x-1/3
              after:translate-y-full
              after:bg-gradient-conic
              after:from-sky-200
              after:via-blue-200
              after:blur-2xl
              after:content-['']
              before:dark:bg-gradient-to-br
              before:dark:from-transparent
              before:dark:to-brand-blue-dark
              before:dark:opacity-10
              after:dark:from-brand-blue
              after:dark:via-[#0141ff]
              after:dark:opacity-40
              sm:before:w-[480px]
              sm:after:w-[240px]
              before:lg:h-[360px]"
            >
              {children}
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}