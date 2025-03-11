import Header from "../components/Header";
import Footer from "../components/Footer";
import { Metadata } from "next";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Gitchegumi Media",
  description: "Gitchegumi Media LLC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="
            overflow-x-hidden
            bg-gradient-to-b
            from-slate-900
            to-slate-700
            dark:from-slate-900
            dark:to-slate-700
            "
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="theme"
        >
          <Header />
          <main
            className="
                flex
                flex-col
                items-center
                justify-between
                font-oswald
                relative
                z-10"
          >
            <div
              className="
              relative
              flex
              flex-col
              place-items-center
              w-full
              before:absolute
              before:h-[300px]
              before:w-[180%]
              before:top-[100%]
              before:left-[-40%]
              before:rounded-full
              before:bg-gradient-radial
              before:from-white
              before:to-transparent
              before:blur-2xl
              before:content-['']
              after:absolute
              after:h-[180px]
              after:w-[180%]
              after:top-[100%]
              after:left-[-40%]
              after:bg-gradient-conic
              after:from-sky-200
              after:via-blue-200
              after:blur-2xl
              after:content-['']
              dark:before:bg-linear-to-br
              dark:before:from-transparent
              dark:before:to-brand-blue-dark
              dark:before:opacity-10
              dark:after:from-brand-blue
              dark:after:via-[#0141ff]
              dark:after:opacity-40
              lg:before:h-[360px]
              overflow-hidden"
            >
              <Providers>{children}</Providers>
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
