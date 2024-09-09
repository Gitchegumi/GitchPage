import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 font-oswald">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm flex flex-col">
        <p className="text-lg md:text-5xl text-center content-center flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to the website of GitcheGumi Media LLC
        </p>
        <p className="mt-4 text-center text-small mb-16 md:text-lg">
          The creative hub of Mathew Lindholm, aka GitcheGumi Gaming
        </p>
      </div>

      <div className="relative z-[-1] flex flex-col place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-brand-blue-dark before:dark:opacity-10 after:dark:from-brand-blue after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <span className="text-lg md:text-3xl mb-8">About Me</span>
        <span className="text-sm md:text-lg mb-16">
          I'm a versatile content creator, voice-over artist, and web developer. Explore 
          my diverse portfolio and join me on this creative journey!
        </span>
        <span className="text-lg md:text-3xl">What I Offer</span>
        <ul className="list-disc list-inside p-4 mb-16">
          <li>Web Development</li>
          <li>Ansible and Terraform Automation</li>
          <Link href='/voice-over'>
            <li>Voice-Over Services</li>
          </Link>
          <li>Content Creation</li>
          <li>Game Streaming</li>
        </ul>
        <span className="text-lg md:text-3xl mb-4">Ready to Collaborate?</span>
        Let's bring your ideas to life! 
      </div>
      <Button variant='default' className="z-40 mt-4 text-black bg-brand-blue-light hover:bg-white dark:text-white dark:bg-brand-blue-dark dark:hover:bg-brand-blue">
          <Link href='mailto: admin@gitchegumi.com'>Contact Me</Link>
      </Button>
    </main>
  );
}