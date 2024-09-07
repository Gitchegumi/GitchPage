import Image from "next/image";
import Link from "next/link";

interface ComingSoonPageProps {
  readonly title: string;
}

export default function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-brand-dark-bg to-zinc-600 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full text-black dark:text-white justify-center border-b border-gray-300 bg-gradient-to-b from-brand-dark-bg pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {title} - Coming Soon
        </p>
        <div className="fixed text-black dark:text-white bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Link
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 text-black dark:text-white"
            href="/"
            rel="noopener noreferrer"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="siteLogo">
        <Link href="/">
          <Image src="/assets/images/Mascot.png" alt="AI2C Logo" className="ai2cLogo" width={300} height={300} />
        </Link>
      </div>

      <h1 className="text-4xl font-bold mt-8 mb-4 text-black dark:text-white">Coming Soon</h1>
      <p className="text-xl mb-8">We&apos;re working hard to bring you amazing content!</p>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="/"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-black dark:text-white text-2xl font-semibold">
            Home{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Return to the main page.
          </p>
        </Link>

        <Link
          href="/about"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl text-black dark:text-white font-semibold">
            About{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-black dark:text-white text-sm opacity-50">
            Learn more about AI2C.
          </p>
        </Link>

        <Link
          href="/what-we-do"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg:neutral-800/30"
        >
          <h2 className="mb-3 text-2xl text-black dark:text-white font-semibold">
            What We Do{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-black dark:text-white text-sm opacity-50">
            Explore our services and projects.
          </p>
        </Link>

        <Link
          href="/contact"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg:neutral-800/30"
        >
          <h2 className="mb-3 text-2xl text-black dark:text-white font-semibold">
            Contact{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-black dark:text-white text-sm opacity-50">
            Get in touch with us.
          </p>
        </Link>
      </div>
    </main>
  );
}