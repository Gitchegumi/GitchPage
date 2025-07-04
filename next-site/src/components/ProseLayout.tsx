import { ReactNode } from "react";

type ProseLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function ProseLayout({ title, children }: ProseLayoutProps) {
  return (
    <article className="prose dark:prose-invert prose-lg text-soft-white mx-auto px-8 md:px-20 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </header>
      <main>{children}</main>
    </article>
  );
}
