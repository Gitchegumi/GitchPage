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
}: BlogCardProps) {
  return (
    <Link href={`/blog/${category}/${slug}`} className="group block rounded-lg overflow-hidden border hover:shadow-lg transition-shadow bg-card text-card-foreground">
      {featureImage && (
        <div className="relative h-48 w-full">
          <Image
            src={featureImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold leading-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</p>
        {showCategory && category && (
          <span className="text-xs uppercase text-primary">{category}</span>
        )}
        {showDescription && description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        {showTags && tags && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map(tag => (
              <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
