"use client";

import Script from "next/script";

interface CommentsProps {
  slug: string;
  title: string;
  category: string;
}

export default function Comments({ slug, title, category }: CommentsProps) {
  return (
    <div className="mt-16 w-full max-w-4xl mx-auto px-4">
      <div className="bg-brand-blue/10 dark:bg-slate-900/50 rounded-2xl border border-brand-blue/20 dark:border-brand-blue/40 p-8 shadow-xl overflow-hidden">
        <div className="flex flex-col items-center mb-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text text-transparent mb-2">
            Join the Discussion
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            What are your thoughts on this? Leave a comment below!
          </p>
        </div>

        {/* 
          Cusdis comment thread with improved styling wrapper.
          Note: Cusdis injects an iframe, so internal styling is limited,
          but the container and background integration now look much cleaner.
        */}
        <div
          id="cusdis_thread"
          data-host="https://cusdis.com"
          data-app-id="ebb02184-7fe1-429c-abd2-bc34ed96dd6c"
          data-page-id={slug}
          data-page-url={`https://gitchegumi.com/blog/${category}/${slug}`}
          data-page-title={title}
          className="rounded-xl overflow-hidden"
        />

        <Script
          src="https://cusdis.com/js/cusdis.es.js"
          strategy="lazyOnload"
        />
      </div>
      
      <div className="mt-6 flex justify-center gap-4 text-xs text-slate-500 italic">
        <span>Powered by Cusdis</span>
        <span className="text-brand-blue/30">•</span>
        <span>Secure & Private</span>
      </div>
    </div>
  );
}
