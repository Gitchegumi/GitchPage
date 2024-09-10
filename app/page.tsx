import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="pt-8">
      <div className="relative z-10 w-full max-w-5xl items-center justify-between text-sm flex flex-col">
        <p className="text-lg md:text-5xl text-center content-center flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-2 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-0 lg:dark:bg-zinc-800/30 bg-opacity-60">
          Welcome to the website of GitcheGumi Media LLC
        </p>
        <p className="mt-4 text-center text-small mb-16 md:text-lg">
          The creative hub of Mathew Lindholm, aka GitcheGumi Gaming
        </p>
      </div>

      <div className="relative z-10 flex flex-col place-items-center">
        <span className="text-lg md:text-3xl mb-8">About Me</span>
        <span className="text-sm md:text-lg mb-16">
          I'm a versatile content creator, voice-over artist, and web developer. Explore 
          my diverse portfolio and join me on this creative journey!
        </span>
        <span className="text-lg md:text-3xl">What I Offer</span>
        <ul className="list-disc list-inside p-4 mb-16">
          <Link href='/portfolio'>
            <li><span className="text-brand-blue hover:text-brand-orange">Web Development</span></li>
          </Link>
          <Link href='https://github.com/Gitchegumi/ansible-playbooks' target="_blank">
            <li><span className="text-brand-blue hover:text-brand-orange">Ansible and Terraform Automation</span></li>
          </Link>
          <Link href='/voice-over'>
            <li><span className="text-brand-blue hover:text-brand-orange">Voice-Over Services</span></li>
          </Link>
          <Link href='https://www.youtube.com/@GitcheGumi.'>
            <li><span className="text-brand-blue hover:text-brand-orange">Content Creation</span></li>
          </Link>
          <Link href='https://www.twitch.tv/gitchegumi' target="_blank">
            <li><span className="text-brand-blue hover:text-brand-orange">Game Streaming</span></li>
          </Link>
        </ul>
        <span className="text-lg md:text-3xl mb-4">Ready to Collaborate?</span>
        Let's bring your ideas to life! 
        <Button variant='default' className="z-40 mt-4 text-black bg-brand-blue-light hover:bg-white dark:text-white dark:bg-brand-blue-dark dark:hover:bg-brand-blue">
          <Link href='mailto: admin@gitchegumi.com'>Contact Me</Link>
        </Button>
      </div>
      
    </main>
  );
}
