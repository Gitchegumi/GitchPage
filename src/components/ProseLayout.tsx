import { ReactNode } from "react";

type ProseLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function ProseLayout({ title, children }: ProseLayoutProps) {
  return (
    <article className="py-8 px-4 mx-auto max-w-6xl md:px-10 prose prose-slate prose-lg text-soft-white prose-headings:text-soft-white dark:prose-invert">
      <header className="mb-8 text-center">
        <h1 className="font-bold">{title}</h1>
      </header>
      <main>{children}</main>
    </article>
  );
}
