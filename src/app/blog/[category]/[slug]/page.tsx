import { getERPNextPosts } from "@/lib/getERPNextPosts";
import { TieredSubscribeForm } from "@/components/TieredSubscribeForm";

const ERP_URL = process.env.NEXT_PUBLIC_ERP_URL || "https://erp.gitchegumi.com";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

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

  return (
    <div className="relative" style={{ height: "calc(100vh - 90px)" }}>
      <iframe
        src={embedUrl}
        title={slug}
        className="w-full h-full border-0"
        loading="lazy"
      />
      <TieredSubscribeForm />
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getERPNextPosts();
  return posts.map((post) => ({
    category: post.category ?? "general",
    slug: post.slug,
  }));
}
