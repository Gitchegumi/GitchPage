import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] bg-gradient-to-b from-brand-dark to-brand-blue items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center text-soft-white sm:items-start">
        <div className="flex flex-row-reverse gap-20">
          <Image
            className="dark:invert rounded-lg"
            src="/images/beach-selfie.jpg"
            alt="Beach selfie"
            width={180}
            height={38}
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold mb-4">
              Welcome to Gitchegumi Media
            </span>
            <span className="max-w-3xl">
              I’m Mat—Army vet, tech builder, content creator, voice actor, and unapologetic nerd. Gitchegumi Media is my digital playground, where I blend code with creativity, share my latest projects, write about everything from dev tools to streaming, and run a small shop of original designs and gear. Whether you’re here to check out my work, geek out over a blog post, or snag a sticker, you’re in the right place.
            </span>
            <span className="mt-8">
              Stick around. Explore. Let’s build something cool.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
