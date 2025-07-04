import "@/app/globals.css"; // if not already included higher up
import ProseLayout from "@/components/ProseLayout"; // optional: your own styled container

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProseLayout>
      {children}
    </ProseLayout>
  );
}
