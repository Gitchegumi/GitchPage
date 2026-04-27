"use client";

import Image from "next/image";

type BlogCardProps = {
  title: string;
  slug: string;
  published_at: string;
  excerpt?: string;
  feature_image?: string | null;
  showDescription?: boolean;
  showTags?: boolean;
  topPost?: boolean;
};

/**
 * BlogCard Component
 * Updated to support Ghost Content API data and link directly to 
 * the canonical blog domain.
 */
export default function BlogCard({
  title,
  slug,
  published_at,
  excerpt,
  feature_image,
  showDescription = true,
  topPost = false,
}: BlogCardProps) {
  const blogUrl = `https://blog.gitchegumi.com/${slug}`;

  return (
    <a
      href={blogUrl}
      className="block overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-lg group bg-soft-white text-card-foreground"
    >
      <article>
        {feature_image && (
          <div
            className={`relative w-full ${topPost ? "h-40 md:h-[500px] sm:h-[300px]" : "md:h-72 h-40"}`}
          >
            <Image
              src={feature_image}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 p-4 bg-soft-white">
          <h2 className="text-lg font-semibold leading-tight text-black">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(published_at).toLocaleDateString()}
          </p>
          {showDescription && excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>
      </article>
    </a>
  );
}
