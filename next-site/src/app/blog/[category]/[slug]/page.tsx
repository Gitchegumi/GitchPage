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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const allPosts = await getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Gitchegumi Media | Not Found" };
  }

  return {
    title: `Gitchegumi Media | Blog | ${post.title}`,
  };
}

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: metadata.title,
            datePublished: metadata.date,
            author: {
              '@type': 'Person',
              name: metadata.author,
            },
            image: metadata.featureImage,
            description: metadata.description,
          }),
        }}
      />
      <ProseLayout title={metadata.title}>
        <Post />
      </ProseLayout>
    </>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}
