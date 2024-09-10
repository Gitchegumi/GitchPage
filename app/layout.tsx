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
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}