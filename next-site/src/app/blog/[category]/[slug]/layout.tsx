import ProseLayout from "@/components/ProseLayout";

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
