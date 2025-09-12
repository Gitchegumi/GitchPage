import { BentoCard } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { PostMeta } from "@/lib/types";
import Image from "next/image";

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
          className="h-[170px] w-full overflow-hidden rounded-xl"
        >
          {post.featureImage ? (
            <Image
              src={post.featureImage}
              alt={post.title}
              width={400}
              height={200}
              className="transition-transform opacity-60 w-full h-auto rounded-lg duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-800" />
          )}
        </MagicCard>
      }
      Icon={EmptyIcon}
      description={post.description || ""}
      href={`/blog/${post.category || "general"}/${post.slug}`}
      cta="Read more"
    />
  );
};

export default BentoBlogCard;
