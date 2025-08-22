import { BentoCard } from "@/components/magicui/bento-grid";
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
      className={className}
      background={
        post.featureImage ? (
          <Image
            src={post.featureImage}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="pointer-events-none absolute left-0 top-0 h-2/3 w-full object-cover"
          />
        ) : (
          <div className="pointer-events-none absolute left-0 top-0 h-2/3 w-full bg-gray-200" />
        )
      }
      Icon={EmptyIcon}
      description={post.description || ""}
      href={`/blog/${post.category || "general"}/${post.slug}`}
      cta="Read more"
    />
  );
};

export default BentoBlogCard;
