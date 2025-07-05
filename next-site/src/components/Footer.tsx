import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-8 px-8 mt-auto text-white bg-gray-800 sm:px-20 footer">
      <div className="container px-16 mx-auto md:px-4">
        <div className="mb-8 border-t border-gray-700 footer-line"></div>
        <div className="footer-content">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h5 className="mb-4 text-lg font-bold">Site Map</h5>
              <ul className="space-y-2 list-none">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/portfolio.html"
                    className="hover:underline"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/voice_over.html"
                    className="hover:underline"
                  >
                    Voice Over
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://store.gitchegumi.com"
                    className="hover:underline"
                  >
                    Merch
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 text-lg font-bold">Social Media</h5>
              <ul className="space-y-2 list-none">
                <li>
                  <Link
                    href="https://www.facebook.com/GitchegumiGaming"
                    target="_blank"
                    className="hover:underline"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/gitchegumi"
                    target="_blank"
                    className="hover:underline"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://twitter.com/GitchegumiGames"
                    target="_blank"
                    className="hover:underline"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.twitch.tv/gitchegumi"
                    target="_blank"
                    className="hover:underline"
                  >
                    Twitch
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p>&copy; 2024 GitcheGumi Media LLC. All rights reserved.</p>
              <p>Designed and developed by Mathew Lindholm</p>
              <Image
                src="/images/Media Text.png"
                alt="GitcheGumi Media LLC"
                width={450}
                height={250}
                className="object-cover -translate-x-4 w-[80%] md:w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
