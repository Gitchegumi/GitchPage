import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-brand-dark to-brand-blue items-center justify-items-center pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center text-soft-white">
        <div className="flex md:flex-row-reverse md:m-0 mx-16 mt-8 flex-col md:gap-20 gap-8 items-center">
          <Image
            className="dark:invert rounded-lg shadow-md shadow-soft-white/30"
            src="/images/beach-selfie.jpg"
            alt="Beach selfie"
            width={180}
            height={38}
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold mb-4 font-oswald">
              Welcome to Gitchegumi Media
            </span>
            <span className="w-full">
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
