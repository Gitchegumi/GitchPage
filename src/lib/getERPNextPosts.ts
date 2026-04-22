import type { PostMeta } from "./types";

const ERP_URL = process.env.NEXT_PUBLIC_ERP_URL || "https://erp.gitchegumi.com";

interface ERPNextBlogPost {
  name: string;
  title: string;
  published_on: string;
  blog_intro: string;
  blog_category: string;
  route: string;
  meta_image?: string;
}

export async function getERPNextPosts(): Promise<PostMeta[]> {
  try {
    const res = await fetch(
      `${ERP_URL}/api/resource/Blog Post?filters=[["published","=",1]]&fields=["name","title","published_on","blog_intro","blog_category","route","meta_image"]&order_by=published_on desc&limit=20`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("Failed to fetch ERPNext posts:", res.status);
      return [];
    }

    const data = await res.json();
    const posts: ERPNextBlogPost[] = data.data ?? [];

    return posts.map((post) => {
      // route is like "blog/life/still-figuring-it-out"
      const parts = post.route.split("/");
      const slug = parts[parts.length - 1];
      const category = parts.length >= 3 ? parts[parts.length - 2] : "general";

      return {
        title: post.title,
        slug,
        category,
        date: post.published_on,
        description: post.blog_intro,
        featureImage: post.meta_image
          ? `${ERP_URL}${post.meta_image}`
          : undefined,
        // Store full ERPNext URL for linking
        erpUrl: `${ERP_URL}/${post.route}`,
      } as PostMeta & { erpUrl: string };
    });
  } catch (error) {
    console.error("Error fetching ERPNext posts:", error);
    return [];
  }
}
