import { getAllPosts } from "@/lib/getAllPosts";
import BentoBlogCard from "@/components/BentoBlogCard";
import { BentoGrid } from "@/components/magicui/bento-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gitchegumi Media | Blog",
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();

  return (
    <div className="py-8 px-20">
      <BentoGrid className="grid-cols-1 md:grid-cols-3 auto-rows-[22rem]">
        {allPosts.map((post, i) => (
          <BentoBlogCard
            key={post.slug}
            post={post}
            className={
              i % 4 === 0 || i % 4 === 3 ? "md:col-span-2" : "md:col-span-1"
            }
          />
        ))}
      </BentoGrid>
    </div>
  );
}
