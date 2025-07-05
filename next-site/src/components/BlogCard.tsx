"use client";

import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  title: string;
  slug: string;
  date: string;
  description?: string;
  category?: string;
  tags?: string[];
  featureImage?: string;
  showDescription?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  topPost?: boolean;
};

export default function BlogCard({
  title,
  slug,
  date,
  description,
  category,
  tags,
  featureImage,
  showDescription = true,
  showCategory = true,
  showTags = false,
  topPost = false,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${category}/${slug}`}
      className="block overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-lg group bg-soft-white text-card-foreground"
    >
      {featureImage && (
        <div
          className={`relative w-full ${topPost ? "h-40 md:h-[500px] sm:h-[300px]" : "md:h-72 h-40"}`}
        >
          <Image
            src={featureImage}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 p-4 bg-soft-white">
        <h2 className="text-lg font-semibold leading-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </p>
        {showCategory && category && (
          <span className="text-xs uppercase text-primary">{category}</span>
        )}
        {showDescription && description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        {showTags && tags && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="py-0.5 px-2 text-xs rounded bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
