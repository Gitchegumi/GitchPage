import Image from "next/image";
import { AudioPlayer } from "@/components/AudioPlayer";
import { VoInquiryForm } from "@/components/utilities/VoInquiryForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gitchegumi Media | Voice Over Demos",
};

export default async function VoiceOverPage() {
  return (
    <div className="container p-4 mx-auto">
      {/* ── Top grid: intro + demos left, form right ── */}
      <div className="grid grid-cols-1 gap-8 items-start my-8 md:grid-cols-5">
        {/* Left: intro + demos */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Bring Your Project to Life with Professional Voiceover
            </h1>
            <p className="text-lg md:text-xl" style={{ color: "rgba(240,240,240,0.75)" }}>
              Looking for a versatile voice to elevate your project? With
              experience in both commercial and e-learning voiceover, I bring
              characters and concepts to life with clarity and enthusiasm.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AudioPlayer
              key="commercial-demo"
              src="/demos/GITCHEGUMI-MEDIA_COMMERICAL-DEMO.mp3"
              title="Commercial Demo"
              showDownloadButton={true}
            />
            <AudioPlayer
              key="elearning-demo"
              src="/demos/GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3"
              title="E-Learning Demo"
              showDownloadButton={true}
            />
          </div>
        </div>

        {/* Right: inquiry form */}
        <div className="md:col-span-2">
          <VoInquiryForm />
        </div>
      </div>

      {/* ── Why Choose Me section ── */}
      <div className="flex flex-col items-center my-12">
        <div className="flex flex-row gap-8 justify-center items-start my-8">
          <Image
            src="/images/Background.png"
            alt="Voice Over"
            width={500}
            height={500}
            className="hidden rounded-lg shadow-lg md:block shadow-brand-blue/50"
          />
          <div className="w-full md:w-1/2">
            <div
              className="mb-8 p-6 rounded-2xl backdrop-blur-xl"
              style={{
                background: "rgba(44,44,44,0.45)",
                border: "1px solid rgba(175,224,206,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <h2 className="mb-6 text-3xl font-bold text-center">
                Why Choose Me?
              </h2>
              <ul className="mx-auto space-y-2 text-lg list-disc list-inside">
                <li>Versatile voice suitable for various projects.</li>
                <li>Quick turnaround times.</li>
                <li>Professional home studio for consistent quality.</li>
                <li>
                  Collaborative approach to ensure your vision is realized.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
