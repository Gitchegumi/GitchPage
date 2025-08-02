import type { PostMeta } from "./types";
import fs from "fs/promises";
import path from "path";

export async function getAllPosts(): Promise<PostMeta[]> {
  const posts: PostMeta[] = [];
  // Correctly resolve the path to the blog directory
  const blogDir = path.join(process.cwd(), "src", "app", "blog");

  try {
    // Get category directories, filtering out files like .DS_Store or other templates
    const categories = (await fs.readdir(blogDir, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const category of categories) {
      const categoryDir = path.join(blogDir, category);
      const files = (await fs.readdir(categoryDir)).filter((file) =>
        file.endsWith(".mdx"),
      );

      for (const file of files) {
        const slug = file.replace(/\.mdx$/, "");
        try {
          // The dynamic import path must be relative to the current file
          const mod = await import(`../app/blog/${category}/${slug}.mdx`);
          if (mod.metadata) {
            const metadata = mod.metadata as PostMeta;

            posts.push({
              ...metadata,
              slug,
              category,
            });
          }
        } catch (error) {
          console.error(`Error importing metadata for post: ${category}/${slug}`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error reading blog directory:", error);
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
