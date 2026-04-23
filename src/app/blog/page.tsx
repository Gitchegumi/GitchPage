import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gitchegumi Media | Blog",
};

const ERP_URL = process.env.NEXT_PUBLIC_ERP_URL || "https://erp.gitchegumi.com";

export default function BlogPage() {
  return (
    <iframe
      src={`${ERP_URL}/blog?embed=1`}
      title="Gitchegumi Blog"
      className="w-full border-0"
      style={{ height: "calc(100vh - 90px)" }}
    />
  );
}
