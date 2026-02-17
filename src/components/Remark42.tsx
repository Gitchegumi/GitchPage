"use client";

import { useEffect } from "react";

interface Remark42Props {
  slug: string;
  title: string;
  category: string;
}

export default function Remark42({ slug, title, category }: Remark42Props) {
  const pageUrl = `https://gitchegumi.com/blog/${category}/${slug}`;

  useEffect(() => {
    (window as any).remark_config = {
      host: "https://comments.gitchegumi.com",
      site_id: "remark",
      url: pageUrl,
      page_title: title,
      theme: "dark",
    };

    // Avoid re-injecting the script on client-side navigation
    if (document.getElementById("remark42-script")) return;

    const s = document.createElement("script");
    s.id = "remark42-script";
    s.src = "https://comments.gitchegumi.com/web/embed.js";
    s.defer = true;
    document.body.appendChild(s);
  }, [pageUrl, title]);

  return (
    <div className="flex flex-col items-center mb-8 text-center">
      <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text text-transparent mb-2">
        Join the Discussion
      </h3>
      <p className="text-slate-600 dark:text-slate-400 max-w-md">
        What are your thoughts on this? Leave a comment below!
      </p>
      <div id="remark42" className="w-full mx-auto px-4" />
    </div>
  );
}
