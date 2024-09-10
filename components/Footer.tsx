import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer mt-auto bg-gray-800 text-white py-8">
      <div className="container mx-auto px-16 md:px-4">
        <div className="footer-line border-t border-gray-700 mb-8"></div>
        <div className="footer-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-lg font-bold mb-4">Site Map</h5>
              <ul className="list-none space-y-2">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li><Link href="/pages/portfolio.html" className="hover:underline">Portfolio</Link></li>
                <li><Link href="/pages/voice_over.html" className="hover:underline">Voice Over</Link></li>
                <li><Link href="https://store.gitchegumi.com" className="hover:underline">Merch</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Social Media</h5>
              <ul className="list-none space-y-2">
                <li><Link href="https://www.facebook.com/GitchegumiGaming" target="_blank" className="hover:underline">Facebook</Link></li>
                <li><Link href="https://www.instagram.com/gitchegumi" target="_blank" className="hover:underline">Instagram</Link></li>
                <li><Link href="https://twitter.com/GitchegumiGames" target="_blank" className="hover:underline">Twitter</Link></li>
                <li><Link href="https://www.twitch.tv/gitchegumi" target="_blank" className="hover:underline">Twitch</Link></li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p>&copy; 2024 GitcheGumi Media LLC. All rights reserved.</p>
              <p>Designed and developed by Mathew Lindholm</p>
              <div className="relative w-[350px] h-[150px] overflow-hidden">
                <Image
                  src="/assets/images/Media Text.png"
                  alt="GitcheGumi Media LLC"
                  fill
                  className='object-cover -translate-x-4'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}