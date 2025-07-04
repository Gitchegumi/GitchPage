import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/getAllPosts";
import ProseLayout from "@/components/ProseLayout";
import type { PostMeta } from "@/lib/types";

export default async function BlogPostPage({ params }: { params: { category: string; slug: string } }) {
  let Post: React.ComponentType;
  let metadata: PostMeta;

  try {
    const mod = await import(`@/app/blog/${params.category}/${params.slug}.mdx`);
    Post = mod.default;
    metadata = mod.metadata;
  } catch (error) {
    console.error(`MDX import failed for ${params.category}/${params.slug}`, error);
    notFound();
  }

  return (
    <ProseLayout title={metadata.title}>
      <Post />
    </ProseLayout>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map(post => ({
    category: post.category,
    slug: post.slug,
  }));
}
