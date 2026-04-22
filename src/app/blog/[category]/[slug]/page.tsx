import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/getAllPosts";
import { getERPNextPosts } from "@/lib/getERPNextPosts";
import ProseLayout from "@/components/ProseLayout";
import Remark42 from "@/components/Remark42";
import { SubscribeForm } from "@/components/SubscribeForm";
import type { PostMeta } from "@/lib/types";

const ERP_URL = process.env.NEXT_PUBLIC_ERP_URL || "https://erp.gitchegumi.com";

type Props = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug, category } = await params;

  // Check MDX first
  const mdxPosts = await getAllPosts();
  const mdxPost = mdxPosts.find((p) => p.slug === slug);
  if (mdxPost) {
    const { title, description, featureImage, author, date, keywords, tags } = mdxPost;
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
        images: [{ url: featureImage, width: 1200, height: 630, type: "image/png" }],
        locale: "en_US",
        type: "article",
        authors: [author],
        publishedTime: date,
      },
      twitter: { card: "summary_large_image", title, description, images: [featureImage] },
    };
  }

  // Fall back to ERPNext post metadata
  const erpPosts = await getERPNextPosts();
  const erpPost = erpPosts.find((p) => p.slug === slug);
  if (erpPost) {
    const { title, description, featureImage, date } = erpPost;
    return {
      title: `${title} | Blog | Gitchegumi Media`,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.gitchegumi.com/blog/${category}/${slug}`,
        siteName: "Gitchegumi Media",
        images: featureImage ? [{ url: featureImage, width: 1200, height: 630 }] : [],
        locale: "en_US",
        type: "article",
        publishedTime: date,
      },
      twitter: { card: "summary_large_image", title, description, images: featureImage ? [featureImage] : [] },
    };
  }

  return { title: "Gitchegumi Media | Not Found" };
}

export default async function BlogPostPage({ params }: Props) {
  const { category, slug } = await params;

  // Try MDX first
  try {
    const mod = await import(`../../${category}/${slug}.mdx`);
    const Post: React.ComponentType = mod.default;
    const metadata: PostMeta = mod.metadata;

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: metadata.title,
              datePublished: metadata.date,
              author: { "@type": "Person", name: metadata.author },
              image: metadata.featureImage,
              description: metadata.description,
            }),
          }}
        />
        <ProseLayout title={metadata.title}>
          <div className="grid gap-8 md:grid-cols-[1fr_300px]">
            <article>
              <Post />
            </article>
            <aside className="space-y-6">
              <SubscribeForm />
            </aside>
          </div>
          <hr className="border-muted" />
          <Remark42 slug={slug} title={metadata.title} category={category} />
        </ProseLayout>
      </>
    );
  } catch {
    // Not an MDX post — check ERPNext
  }

  const erpPosts = await getERPNextPosts();
  const erpPost = erpPosts.find((p) => p.slug === slug);
  if (!erpPost) notFound();

  const embedUrl = `${ERP_URL}/blog/${category}/${slug}?embed=1`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: erpPost.title,
            datePublished: erpPost.date,
            description: erpPost.description,
            image: erpPost.featureImage,
          }),
        }}
      />
      <iframe
        src={embedUrl}
        title={erpPost.title}
        className="w-full border-0"
        style={{ minHeight: "100vh" }}
        loading="lazy"
      />
    </>
  );
}

export async function generateStaticParams() {
  const [mdxPosts, erpPosts] = await Promise.all([getAllPosts(), getERPNextPosts()]);
  const all = [...mdxPosts, ...erpPosts];

  // Deduplicate by slug
  const seen = new Set<string>();
  return all
    .filter((post) => {
      if (seen.has(post.slug)) return false;
      seen.add(post.slug);
      return true;
    })
    .map((post) => ({ category: post.category, slug: post.slug }));
}
