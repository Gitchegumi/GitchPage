import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/getAllPosts";
import ProseLayout from "@/components/ProseLayout";
import type { PostMeta } from "@/lib/types";

type Props = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { category, slug } = await params;
  let Post: React.ComponentType;
  let metadata: PostMeta;

  try {
    const mod = await import(`@/app/blog/${category}/${slug}.mdx`);
    Post = mod.default;
    metadata = mod.metadata;
  } catch (error) {
    console.error(`MDX import failed for ${category}/${slug}`, error);
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
