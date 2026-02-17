import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/getAllPosts";
import ProseLayout from "@/components/ProseLayout";
import Remark42 from "@/components/Remark42";
import type { PostMeta } from "@/lib/types";

type Props = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug, category } = await params;
  const allPosts = await getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Gitchegumi Media | Not Found" };
  }

  const { title, description, featureImage, author, date, keywords, tags } =
    post;

  return {
    title: `${title} | Blog | Gitchegumi Media`,
    description,
    tags: tags ?? [],
    keywords: keywords ?? [],
    openGraph: {
      title,
      description,
      url: `https://www.gitchegumi.com/blog/${category}/${slug}`,
      siteName: "Gitchegumi Media",
      images: [
        {
          url: featureImage,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
      locale: "en_US",
      type: "article",
      authors: [author],
      publishedTime: date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [featureImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { category, slug } = await params;
  let Post: React.ComponentType;
  let metadata: PostMeta;

  try {
    const mod = await import(`../../${category}/${slug}.mdx`);
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
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: metadata.title,
            datePublished: metadata.date,
            author: {
              "@type": "Person",
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
        <hr className="border-muted" />

        <Remark42 slug={slug} title={metadata.title} category={category} />
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
