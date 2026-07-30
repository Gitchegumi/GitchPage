import type { Metadata } from "next";
import "../globals.css";
import "./home.css";

export const metadata: Metadata = {
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
  return <>{children}</>;
}
