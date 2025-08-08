import type { Metadata } from "next";
import Script from "next/script";
import { Oswald, Roboto_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gitchegumi Media",
  description: "The web presence for Gitchegumi!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Gitchegumi Media",
    description: "The web presence for Gitchegumi!",
    url: "https://gitchegumi.com",
    siteName: "Gitchegumi Media",
    images: [
      {
        url: "https://www.gitchegumi.com/images/Mascot.png",
        width: 1200,
        height: 630,
        alt: "Gitchegumi Mascot"
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gitchegumi Media",
    description: "The web presence for Gitchegumi!",
    images: ["https://www.gitchegumi.com/images/Mascot.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${robotoSerif.variable} antialiased bg-brand-dark`}
      >
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TH478GZSDH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TH478GZSDH');
          `}
        </Script>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
