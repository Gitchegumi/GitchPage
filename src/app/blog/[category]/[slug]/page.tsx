import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/getAllPosts";
import ProseLayout from "@/components/ProseLayout";
import type { PostMeta } from "@/lib/types";
import Script from "next/script";

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
    title: `${post.title} | Blog | Gitchegumi Media`,
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
      {/* JSON-LD structured data for SEO */}
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
        <article>
          
          {/* Post content */}
          <Post />
        </article>
        <hr className="border-muted"/>
        <div className="max-w-5xl mx-auto text-center px-4">
          <p className="text-xl md:text-2xl font-bold">Feel like joining the conversation?<br/>Leave your comments below!</p>
          {/* Cusdis comment thread */}
          <div
            id="cusdis_thread"
            data-host="https://cusdis.com"
            data-app-id="ebb02184-7fe1-429c-abd2-bc34ed96dd6c"
            data-page-id={slug}
            data-page-url={`https://yourdomain.com/blog/${category}/${slug}`}
            data-page-title={metadata.title}
            className="mt-16 bg-brand-blue/50 rounded-lg ring-brand-orange ring"
          />

          <Script src="https://cusdis.com/js/cusdis.es.js" strategy="lazyOnload" />
        </div>
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
