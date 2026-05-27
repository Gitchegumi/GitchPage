import { getLatestPosts } from "@/lib/ghost";
import HomeClient from "./_components/HomeClient";

/**
 * Server Component wrapper for the homepage.
 * Fetches latest Ghost posts safely server-side (env vars never hit the client).
 * Passes them into the interactive Client Component.
 */
export default async function HomePage() {
  let posts = await getLatestPosts(4);
  if (!posts.length) {
    // Graceful fallback if Ghost API is unavailable
    console.warn("HomePage: Ghost API returned no posts; using fallback.");
    posts = [
      {
        id: "fallback-1",
        title: "The Quiet Power of Narrative Voice",
        slug: "narrative-voice",
        excerpt: "How the unsung craft shapes our imagination.",
        feature_image: null,
        published_at: new Date().toISOString(),
        url: "https://blog.gitchegumi.com",
        primary_tag: { name: "Latest", slug: "latest" },
      },
      {
        id: "fallback-2",
        title: "Believable Worlds in Five Minutes",
        slug: "believable-worlds",
        excerpt: "Improvise lore that feels ancient.",
        feature_image: null,
        published_at: new Date().toISOString(),
        url: "https://blog.gitchegumi.com",
        primary_tag: { name: "GM Tips", slug: "gm-tips" },
      },
      {
        id: "fallback-3",
        title: "From Script to Sound",
        slug: "script-to-sound",
        excerpt: "The ritual of talking to an empty room.",
        feature_image: null,
        published_at: new Date().toISOString(),
        url: "https://blog.gitchegumi.com",
        primary_tag: { name: "Process", slug: "process" },
      },
      {
        id: "fallback-4",
        title: "Self-Hosting for Creators",
        slug: "self-hosting",
        excerpt: "Why I moved everything off the cloud.",
        feature_image: null,
        published_at: new Date().toISOString(),
        url: "https://blog.gitchegumi.com",
        primary_tag: { name: "Tech", slug: "tech" },
      },
    ];
  }
  return <HomeClient blogPosts={posts} />;
}
