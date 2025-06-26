import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  description?: string;
  category?: string;
  tags?: string[];
  featureImage?: string;
};

export function getAllPosts(): PostMeta[] {
  const basePath = path.join(process.cwd(), "src/content/blog");
  const categories = fs.readdirSync(basePath);
  const posts: PostMeta[] = [];

  for (const category of categories) {
    const categoryPath = path.join(basePath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith(".mdx"));

    for (const file of files) {
      const fullPath = path.join(categoryPath, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      posts.push({
        ...(data as PostMeta),
        category,
        slug: file.replace(/\.mdx$/, ""),
      });
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
