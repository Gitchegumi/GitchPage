import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Gitchegumi Media",
  description:
    "Mathew Lindholm — Army veteran, Blackhawk pilot, technologist, voice actor, and creator. From infantry to AI, this is the journey.",
};

const TIMELINE = [
  { year: "2004", color: "#CCDBDC", text: "Classical guitar performance — Boston Conservatory" },
  { year: "2006", color: "#fca311", text: "Enlisted — U.S. Army infantryman" },
  { year: "2014", color: "#fca311", text: "UH-60 Blackhawk pilot" },
  { year: "2022", color: "#afe0ce", text: "B.S. Accounting — University of Minnesota–Crookston" },
  { year: "2023", color: "#4166f5", text: "AI Technician — Army AI2C · Carnegie Mellon University" },
  { year: "Now", color: "#4166f5", text: "M.S. Applied Business Analytics (in progress) · AI cloud technician" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#f0f0f0", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-11 px-5 md:px-10 py-14" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div>
          <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f0f0f0", opacity: 0.45, marginBottom: "22px" }}>
            About · The person behind it
          </div>
          <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.07, color: "#f0f0f0", margin: "0 0 22px", letterSpacing: "-0.01em" }}>
            Army vet. Builder.<br />Voice. Nerd.
          </h1>
          <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.96rem", lineHeight: 1.66, color: "#cdd2d3", marginBottom: "18px", maxWidth: "34rem" }}>
            I'm Mat — Army vet, tech builder, content creator, voice actor, and unapologetic nerd. Gitchegumi Media is my digital playground, where I blend code with creativity, share my latest projects, and run a small shop of original designs and gear.
          </p>
          <p style={{ fontFamily: "'Roboto Serif', serif", fontStyle: "italic", fontSize: "1.05rem", lineHeight: 1.5, color: "#afe0ce", marginBottom: "30px" }}>
            Stick around. Explore. Let's build something cool.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="/portfolio"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0f0f0", color: "#161616", borderRadius: "9999px", padding: "13px 26px", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}
            >
              View my technical CV →
            </Link>
            <Link
              href="/voice-over"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "#f0f0f0", borderRadius: "9999px", padding: "13px 26px", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}
            >
              Hire my voice
            </Link>
          </div>
        </div>

        {/* Portrait with corner decorations */}
        <div style={{ position: "relative", paddingTop: "14px", paddingRight: "14px" }} className="hidden md:block">
          <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", borderTop: "2px solid rgba(252,163,17,0.6)", borderRight: "2px solid rgba(252,163,17,0.6)", borderTopRightRadius: "20px" }} />
          <div style={{ position: "absolute", bottom: "-14px", left: "-14px", width: "120px", height: "120px", borderBottom: "2px solid rgba(65,102,245,0.6)", borderLeft: "2px solid rgba(65,102,245,0.6)", borderBottomLeftRadius: "20px" }} />
          <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 50px -10px rgba(0,0,0,0.7)" }}>
            <Image
              src="/images/beach-selfie.jpg"
              alt="Mat Lindholm"
              width={500}
              height={600}
              style={{ display: "block", width: "100%", height: "440px", objectFit: "cover", objectPosition: "center 28%" }}
            />
          </div>
        </div>
      </section>

      {/* ── Journey header ── */}
      <section className="px-5 md:px-10" style={{ maxWidth: "1200px", margin: "0 auto 0" }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f0f0f0", opacity: 0.45, marginBottom: "18px" }}>
          My journey
        </div>
        <p style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", lineHeight: 1.34, color: "#f0f0f0", margin: 0, maxWidth: "48rem" }}>
          From the infantry to Blackhawk helicopter pilot to AI cloud technician — my journey has been anything but ordinary.
        </p>
      </section>

      {/* ── Journey content + timeline ── */}
      <section className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-10 px-5 md:px-10 py-8" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.94rem", lineHeight: 1.68, color: "#cdd2d3", margin: 0 }}>
            I began my military career in 2006 as an infantryman, eventually becoming a UH-60 Blackhawk pilot in 2014. In 2023, I moved into the tech world through the Army's Artificial Intelligence Integration Center (AI2C) — part of the fourth cohort of AI Technicians trained at Carnegie Mellon University.
          </p>
          <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.94rem", lineHeight: 1.68, color: "#cdd2d3", margin: 0 }}>
            Before the military, I studied classical guitar performance at the Boston Conservatory — a creative foundation that still shapes how I approach problem-solving. While on active duty I earned a B.S. in Accounting from the University of Minnesota–Crookston, and I'm now working toward a Master's in Applied Business Analytics.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", background: "linear-gradient(120deg, rgba(252,163,17,0.13), rgba(65,102,245,0.08))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "18px 22px" }}>
            <div style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "3rem", color: "#fca311", lineHeight: 0.9, flexShrink: 0 }}>56</div>
            <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.9rem", lineHeight: 1.55, color: "#dfe3e4", margin: 0 }}>
              jobs and counting, by a buddy's running tally. Not a record I set out to break — but it reflects one truth: I'm always learning, always exploring, and never afraid to try something new.
            </p>
          </div>
          <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.94rem", lineHeight: 1.68, color: "#cdd2d3", margin: 0 }}>
            Since moving into tech, I've immersed myself in DevOps, cloud infrastructure, automation, web development, and data analytics — approaching each challenge with curiosity, adaptability, and a desire to build tools that empower others.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "28px 30px", boxShadow: "0 20px 50px -10px rgba(0,0,0,0.6)" }}>
          <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.64rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#CCDBDC", opacity: 0.7, marginBottom: "24px" }}>
            The path
          </div>
          <div style={{ position: "relative", borderLeft: "1px solid rgba(255,255,255,0.14)", paddingLeft: "26px", display: "flex", flexDirection: "column", gap: "22px" }}>
            {TIMELINE.map((item) => (
              <div key={item.year} style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "-31px", top: "3px", width: "11px", height: "11px", borderRadius: "50%", background: item.color, border: "2px solid #0a0a0a" }} />
                <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.64rem", letterSpacing: "0.18em", textTransform: "uppercase", color: item.color, marginBottom: "3px" }}>
                  {item.year}
                </div>
                <div style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.92rem", lineHeight: 1.4, color: "#f0f0f0" }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA section ── */}
      <section
        className="mx-5 md:mx-10 mb-10 px-8 md:px-10 py-10"
        style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "linear-gradient(120deg, rgba(65,102,245,0.14), rgba(252,163,17,0.08))", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px", flexWrap: "wrap", maxWidth: "1120px", marginLeft: "auto", marginRight: "auto" }}
      >
        <div style={{ maxWidth: "40rem" }}>
          <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "1.9rem", color: "#f0f0f0", margin: "0 0 8px" }}>
            This site is where I bring it all together.
          </h2>
          <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.92rem", lineHeight: 1.6, color: "#dfe3e4", margin: 0 }}>
            A digital workshop and journal — what I'm learning, building, and thinking about. Thanks for stopping by; I hope you find something that informs, inspires, or sparks an interesting thought.
          </p>
        </div>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <a
            href="https://blog.gitchegumi.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0f0f0", color: "#161616", borderRadius: "9999px", padding: "13px 26px", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}
          >
            Read the blog →
          </a>
          <Link
            href="/portfolio"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.25)", color: "#f0f0f0", borderRadius: "9999px", padding: "13px 26px", fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}
          >
            See my work
          </Link>
        </div>
      </section>
    </div>
  );
}
