import { getERPNextPosts } from "@/lib/getERPNextPosts";
import { BlogEmbed } from "@/app/blog/BlogEmbed";

const ERP_URL = process.env.NEXT_PUBLIC_ERP_URL || "https://erp.gitchegumi.com";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

// Generate static params for all ERPNext blog posts at build time.
// If ERPNext is unreachable, returns a minimal fallback so the build
// can still complete with output: 'export'.
export async function generateStaticParams() {
  try {
    const posts = await getERPNextPosts();
    if (!posts.length) {
      // Minimal fallback: one dummy param so Next.js doesn't complain
      return [{ category: "general", slug: "placeholder" }];
    }
    return posts.map((post) => ({
      category: post.category ?? "general",
      slug: post.slug,
    }));
  } catch {
    // Fallback for build-time ERPNext failures
    return [{ category: "general", slug: "placeholder" }];
  }
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const posts = await getERPNextPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return { title: "Gitchegumi Media | Blog" };

  return {
    title: `${post.title} | Blog | Gitchegumi Media`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.gitchegumi.com/blog/${category}/${slug}`,
      siteName: "Gitchegumi Media",
      images: post.featureImage ? [{ url: post.featureImage, width: 1200, height: 630 }] : [],
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.featureImage ? [post.featureImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { category, slug } = await params;
  const embedUrl = `${ERP_URL}/blog/${category}/${slug}?embed=1`;

  return <BlogEmbed src={embedUrl} title={slug} />;
}
