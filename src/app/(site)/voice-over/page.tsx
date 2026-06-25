import Image from "next/image";
import { AudioPlayer } from "@/components/AudioPlayer";
import { VoInquiryForm } from "@/components/utilities/VoInquiryForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voice Over | Gitchegumi Media",
  description:
    "Professional voiceover demos and inquiry form. Commercial, e-learning, narration, and character work by Mathew Lindholm.",
};

const STATS = [
  { value: "48h", color: "#fca311", label: "typical turnaround" },
  { value: "Profesional", color: "#4166f5", label: "home studio" },
  { value: "2", color: "#afe0ce", label: "free revisions on every project" },
];

export default function VoiceOverPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#f0f0f0", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="px-5 md:px-10 pt-12 pb-6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f0f0f0", opacity: 0.45, marginBottom: "18px" }}>
          Professional recordings
        </div>
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 4vw, 3.4rem)", lineHeight: 1.02, color: "#f0f0f0", margin: "0 0 14px", letterSpacing: "-0.01em" }}>
          The Voice
        </h1>
        <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "1rem", lineHeight: 1.6, color: "#cdd2d3", margin: 0, maxWidth: "38rem", opacity: 0.82 }}>
          Warm, broadcast-ready reads for brands, e-learning, characters, and narration. Check out my demos, then send me a brief. I turn most projects around in 48 hours.
        </p>
      </section>

      {/* ── Main grid: demos left, form right ── */}
      <section className="grid grid-cols-1 md:grid-cols-[1.25fr_0.9fr] gap-6 px-5 md:px-10 pb-8" style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Left: players + studio photo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Audio players */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AudioPlayer
              src="/demos/GITCHEGUMI-MEDIA_COMMERICAL-DEMO.mp3"
              title="Commercial Demo"
              showDownloadButton
            />
            <AudioPlayer
              src="/demos/GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3"
              title="E-Learning Demo"
              showDownloadButton
            />
          </div>

          {/* Studio photo */}
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", position: "relative" }}>
            <Image
              src="/images/Background.png"
              alt="In the recording studio"
              width={800}
              height={400}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {/* Why choose me */}
          <div
            style={{
              borderRadius: "16px",
              padding: "28px 30px",
              border: "1px solid rgba(175,224,206,0.15)",
              background: "rgba(44,44,44,0.45)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h2 style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#f0f0f0", marginBottom: "16px" }}>
              Why choose me?
            </h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "1.25rem", listStyle: "disc" }}>
              {[
                "Versatile voice suitable for various projects.",
                "Quick turnaround times — typically 48 hours.",
                "Professional home studio for consistent quality.",
                "Collaborative approach to ensure your vision is realized.",
                "Two free revisions included on every project.",
              ].map((item) => (
                <li key={item} style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.95rem", lineHeight: 1.6, color: "#cdd2d3" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: inquiry form */}
        <div
          style={{
            background: "#151515",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 20px 50px -10px rgba(0,0,0,0.7)",
            alignSelf: "start",
            position: "sticky",
            top: "6rem",
          }}
        >
          <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.66rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#fca311", marginBottom: "8px" }}>
            Start a project
          </div>
          <h3 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "1.5rem", color: "#f0f0f0", marginBottom: "20px" }}>
            Tell me about the read.
          </h3>
          <VoInquiryForm />
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        className="mx-5 md:mx-10 mb-10 px-8 py-8"
        style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.025)", maxWidth: "1120px", marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((s) => (
            <div key={s.value} style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "1.7rem", color: s.color }}>{s.value}</span>
              <span style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.88rem", color: "#cdd2d3", opacity: 0.8 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
