import { BentoCard } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { PostMeta } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

// Define a dummy icon component that renders nothing
const EmptyIcon = () => null;

type BentoBlogCardProps = {
  post: PostMeta;
  className?: string;
};

const BentoBlogCard = ({ post, className }: BentoBlogCardProps) => {
  return (
    <BentoCard
      name={post.title}
      className={className || ""}
      background={
        <MagicCard
          gradientColor="#262626"
          className="h-[170px] w-full overflow-hidden rounded-xl relative"
        >
          {post.featureImage ? (
            <Image
              src={post.featureImage}
              alt={post.title}
              fill // Use fill prop
              className="transition-transform opacity-60 object-cover object-center rounded-lg duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-800" />
          )}
        </MagicCard>
      }
      Icon={EmptyIcon}
      description={post.description || ""}
      href={`/blog/${post.category || "general"}/${post.slug}`}
      cta="Read More"
    />
  );
};

export default BentoBlogCard;
