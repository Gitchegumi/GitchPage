import type { PostMeta } from "./types";

const postsList = [
  ["life", "still-figuring-it-out"],
  ["faith", "building-hope-one-nugget-at-a-time"],
  ["opinion", "overreliance-on-ai"],
  ["tech", "why-i-switched-to-neovim"],
  ["life", "from-lake-superior-to-azeroth"],
] as const;

export async function getAllPosts(): Promise<PostMeta[]> {
  const posts: PostMeta[] = [];

  for (const [category, slug] of postsList) {
    const mod = await import(`../app/blog/${category}/${slug}.mdx`);
    const metadata = mod.metadata as PostMeta;

    posts.push({
      ...metadata,
      slug,
      category,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
