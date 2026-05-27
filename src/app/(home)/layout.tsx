import type { Metadata } from "next";
import { Oswald, Roboto_Serif } from "next/font/google";
import Script from "next/script";
import "../globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gitchegumi.com"),
  title: "Gitchegumi Media — Army Vet · Technologist · Creator",
  description:
    "Mathew Lindholm — Army veteran, Blackhawk pilot, technologist, voice actor, content creator, and unapologetic nerd. Building tools, telling stories, and rolling dice.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Gitchegumi Media",
    description: "Army Vet · Technologist · Creator",
    url: "https://www.gitchegumi.com",
    siteName: "Gitchegumi Media",
    images: [
      {
        url: "/images/Mascot.png",
        width: 1200,
        height: 630,
        alt: "Gitchegumi Mascot",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gitchegumi Media",
    description: "Army Vet · Technologist · Creator",
    images: ["https://www.gitchegumi.com/images/Mascot.png"],
  },
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${robotoSerif.variable} antialiased`}
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
        {children}
      </body>
    </html>
  );
}
