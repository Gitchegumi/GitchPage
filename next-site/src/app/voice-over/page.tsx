import Image from "next/image";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ContactForm } from "@/components/utilities/ContactForm";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gitchegumi Media | Voice Over Demos',
};

export default async function VoiceOverPage() {
  return (
    <div className="container p-4 mx-auto">
      <div className="my-12 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Bring Your Project to Life with Professional Voiceover.
        </h1>
        <p className="mx-auto mb-6 max-w-3xl text-lg md:text-xl">
          Are you looking for a versatile voice to elevate your project? Look no
          further! With experience in both commercial and e-learning voiceover,
          I bring characters and concepts to life with clarity and enthusiasm.
        </p>
        <p className="mx-auto max-w-3xl text-lg md:text-xl">
          Whether you need a friendly voice for your next ad campaign or an
          engaging narrator for your educational content, I&apos;m here to
          deliver high-quality audio that meets your specific needs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 justify-center my-8 md:flex md:flex-cols-2">
        <div className="w-full md:w-1/3">
          <AudioPlayer
            key="commercial-demo"
            src="/demos/GITCHEGUMI-MEDIA_COMMERICAL-DEMO.mp3"
            title="Commercial Demo"
            showDownloadButton={true}
          />
        </div>
        <div className="w-full md:w-1/3">
          <AudioPlayer
            key="elearning-demo"
            src="/demos/GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3"
            title="E-Learning Demo"
            showDownloadButton={true}
          />
        </div>
      </div>
      <div className="flex flex-row gap-8 justify-center items-center my-8">
        <Image
          src="/images/Background.png"
          alt="Voice Over"
          width={500}
          height={500}
          className="hidden rounded-lg shadow-lg md:block shadow-brand-blue/50"
        />
        <div className="w-full md:w-1/2">
          <div className="mb-8">
            <h2 className="mb-6 text-3xl font-bold text-center">
              Why Choose Me?
            </h2>
            <ul className="mx-auto space-y-2 text-lg list-disc list-inside">
              <li>Versatile voice suitable for various projects.</li>
              <li>Quick turnaround times.</li>
              <li>Professional home studio for consistent quality.</li>
              <li>Collaborative approach to ensure your vision is realized.</li>
            </ul>
          </div>
          <h2 className="mb-8 text-3xl font-bold text-center">Get in Touch</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
