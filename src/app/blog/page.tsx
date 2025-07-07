import { getAllPosts } from "@/lib/getAllPosts";
import BlogCard from "@/components/BlogCard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gitchegumi Media | Blog",
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const newestPost = allPosts.slice(0, 1);
  const secondPost = allPosts.slice(1, 2);
  const oldPosts = allPosts.slice(2);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 py-8 px-20 md:grid-cols-3">
        <div className="md:col-span-2 md:row-span-4">
          {newestPost.map((post) => (
            <BlogCard key={post.slug} {...post} topPost />
          ))}
        </div>
        <div className="md:col-span-1">
          {secondPost.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 py-8 px-20 md:grid-cols-3">
        {oldPosts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </>
  );
}
