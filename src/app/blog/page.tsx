'use client';

import { useEffect } from 'react';

/**
 * Main Blog Redirect Page
 * Since the site is a static export on GitHub Pages, we use a client-side 
 * redirect to move visitors from /blog to the new canonical blog domain.
 */
export default function BlogRedirectPage() {
  useEffect(() => {
    // Permanent-style redirect for visitors
    window.location.replace('https://blog.gitchegumi.com');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-soft-white font-oswald">
      <h1 className="text-2xl animate-pulse">Redirecting to the blog...</h1>
      <p className="mt-4 opacity-70">
        If you are not redirected automatically, <a href="https://blog.gitchegumi.com" className="underline hover:text-brand-orange transition-colors">click here</a>.
      </p>
    </div>
  );
}
