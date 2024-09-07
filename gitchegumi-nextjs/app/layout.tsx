import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Gitch's Page",
  description: "The home for Gitchegumi's projects",
};

export default function RootLayout({ children }: { children: ReactNode }) {
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