import Link from "next/link";
// import { Button } from "@/components/ui/button";
import { Card, CardFooter, Image, Button } from "@heroui/react";

export default function Home() {
  return (
    <main className="p-20 mx-4 md:mx-0 relative z-0">
      <div className="flex flex-col md:flex-row justify-between w-full max-w-7xl mx-auto gap-8">
        {/* Left Column */}
        <div className="flex flex-col w-full md:w-1/2">
          <div className="relative w-full max-w-5xl items-center justify-between text-sm flex flex-col">
            <p
              className="
                text-lg
                md:text-5xl
                text-center
                content-center
                flex
                w-full
                justify-center
                border-b
                border-gray-300
                bg-linear-to-b
                from-zinc-200
                pb-6
                pt-2
                backdrop-blur-2xl
                dark:border-neutral-800
                dark:bg-zinc-800/30
                dark:from-inherit 
                lg:rounded-xl lg:border
                lg:bg-gray-200
                lg:p-0
                lg:dark:bg-zinc-800/30
                bg-opacity-60
              "
            >
              Welcome to the website of GitcheGumi Media
            </p>
            <p className="mt-4 text-center text-small mb-16 md:text-lg">
              The creative hub of Mathew Lindholm, aka GitcheGumi Gaming
            </p>
          </div>

          <div className="relative flex flex-col place-items-center">
            <span className="text-lg md:text-3xl mb-8">About Me</span>
            <span className="text-sm text-center md:text-lg mb-16">
              I'm a versatile content creator, voice-over artist, and web
              developer. Explore my diverse portfolio and join me on this
              creative journey!
            </span>
            <span className="text-lg md:text-3xl mb-4">
              Ready to Collaborate?
            </span>
            Let's bring your ideas to life!
            <Button
              className="
                z-40 
                mt-4 
                text-black 
                bg-brand-blue-light 
                hover:bg-white 
                dark:text-white 
                dark:bg-brand-blue-dark/80 
                dark:hover:bg-brand-blue/80
                rounded-full
                "
              size="sm"
              variant="solid"
            >
              <Link href="mailto: admin@gitchegumi.com">Contact Me</Link>
            </Button>
          </div>
        </div>
        {/* Right Column */}
        <div className="relative flex flex-col w-full md:w-1/2 place-items-center">
          {/* "What I Offer" text overlaid in center */}
          <div className="mb-8">
            <span className="text-lg md:text-3xl before:bg-white/10 px-4 py-2 rounded-lg text-white">
              What I Offer
            </span>
          </div>
          {/* First row - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8 place-items-center">
            <Link href="/voice-over">
              <Card isFooterBlurred className="border-none rounded-lg">
                <Image
                  alt="VO Image"
                  className="object-cover"
                  height={200}
                  src="/assets/images/Background.png"
                  width={200}
                />
                <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-lg bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <span className="text-white/80 text-sm">
                    Voice-Over Services
                  </span>
                </CardFooter>
              </Card>
            </Link>
            <Link href="https://www.youtube.com/@Gitche_Gumi" target="_blank">
              <Card
                isFooterBlurred
                className="border-none rounded-lg overflow-hidden relative"
              >
                <Image
                  alt="YouTube Thumbnail"
                  className="object-cover scale-110 object-[center_left]"
                  height={200}
                  src="/assets/images/LiveThumbnail.png"
                  width={200}
                />
                <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-lg bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <span className="text-white/80 text-sm text-center">
                    YouTube Content Creation
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </div>

          {/* Middle row - 1 card */}
          <div className="flex justify-center mb-8 place-items-center">
            <Link href="https://www.twitch.tv/gitchegumi" target="_blank">
              <Card isFooterBlurred className="border-none rounded-lg">
                <Image
                  alt="Twitch Logo"
                  className="object-cover"
                  height={200}
                  src="/assets/images/gitch-twitch-logo.png"
                  width={200}
                />
                <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-lg bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <span className="text-white/80 text-sm">Live Streaming</span>
                </CardFooter>
              </Card>
            </Link>
          </div>

          {/* Bottom row - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full place-items-center">
            <Link href="/portfolio">
              <Card isFooterBlurred className="border-none rounded-lg">
                <Image
                  alt="Web Dev Stack"
                  className="object-cover"
                  height={200}
                  src="/assets/images/web development v3.png"
                  width={200}
                />
                <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-lg bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <span className="text-white/80 text-sm">Web Development</span>
                </CardFooter>
              </Card>
            </Link>
            <Link
              href="https://github.com/Gitchegumi/ansible-playbooks"
              target="_blank"
            >
              <Card isFooterBlurred className="border-none rounded-lg">
                <Image
                  alt="Terraform and Ansible"
                  className="object-cover"
                  height={200}
                  src="/assets/images/terraform ansible card.png"
                  width={200}
                />
                <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-lg bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <span className="text-white text-sm text-center">
                    Ansible and Terraform Automation
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
