import type { Metadata } from "next";
import { TieredSubscribeForm } from "@/components/TieredSubscribeForm";

export const metadata: Metadata = {
  title: "Gitchegumi Media | Blog",
};

const ERP_URL = process.env.NEXT_PUBLIC_ERP_URL || "https://erp.gitchegumi.com";

export default function BlogPage() {
  return (
    <div className="relative" style={{ height: "calc(100vh - 90px)" }}>
      <iframe
        src={`${ERP_URL}/blog?embed=1`}
        title="Gitchegumi Blog"
        className="w-full h-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
      <TieredSubscribeForm />
    </div>
  );
}
