import type { Metadata } from "next";
import { BlogEmbed } from "./BlogEmbed";

export const metadata: Metadata = {
  title: "Gitchegumi Media | Blog",
};

export default function BlogPage() {
  return <BlogEmbed />;
}
