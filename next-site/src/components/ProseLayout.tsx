import { ReactNode } from "react";

type ProseLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function ProseLayout({ title, children }: ProseLayoutProps) {
  return (
    <article className="prose prose-slate max-w-6xl md:px-10 px-4 mx-auto dark:prose-invert prose-lg text-soft-white py-8 prose-headings:text-soft-white">
      <header className="text-center mb-8">
        <h1 className="font-bold">{title}</h1>
      </header>
      <main>{children}</main>
    </article>
  );
}
