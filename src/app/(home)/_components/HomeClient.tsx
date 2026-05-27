"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GhostPost } from "@/lib/ghost";

/* =============================================================
   DESKTOP + MOBILE ROLLODEX HOMEPAGE CLIENT COMPONENT
   Receives blogPosts from the Server Component wrapper.
   ============================================================= */

const TOTAL_CARDS = 5;

/* Card data — tabs link internally, content links out */
const cards = [
  {
    id: 0,
    label: "Professional Recordings",
    title: "The Voice",
    tab: "Voice Over",
    tabColor: "linear-gradient(to bottom, #fca311, #e07c00)",
    href: "/voice-over",
  },
  {
    id: 1,
    label: "The Gitchegumi Blog",
    title: "The Writer",
    tab: "Blog",
    tabColor: "linear-gradient(to bottom, #4166f5, #1e3a8a)",
    href: "/blog",
  },
  {
    id: 2,
    label: "Creative Lab",
    title: "The Creator",
    tab: "Content",
    tabColor: "linear-gradient(to bottom, #8b5cf6, #312e81)",
    href: "https://www.youtube.com/@Gitchegumi",
    external: true,
  },
  {
    id: 3,
    label: "About Me",
    title: "The Person",
    tab: "About",
    tabColor: "linear-gradient(to bottom, #10b981, #0f172a)",
    href: "/about",
  },
  {
    id: 4,
    label: "Build Log",
    title: "I Made This",
    tab: "Made",
    tabColor: "linear-gradient(to bottom, #f97316, #7c2d12)",
    href: "/tools",
  },
];

/* Demo files for Voice Over card */
const DEMOS = [
  {
    id: 0,
    title: "Commercial Demo",
    src: "/demos/GITCHEGUMI-MEDIA_COMMERICAL-DEMO.mp3",
    desc: "Warm, persuasive reads for brands, ads, and promos.",
  },
  {
    id: 1,
    title: "E-Learning Demo",
    src: "/demos/GITCHEGUMI-MEDIA_ELEARNING-DEMO.mp3",
    desc: "Clear, engaging narration for courses and training.",
  },
];

/* seeded rng for stable SSR + hydration */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
function makeBars(count: number, seed: number) {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => rng() * 60 + 20);
}

/* Waveform bar component */
function Waveform({ count = 28 }: { count?: number }) {
  const [seed, setSeed] = useState(42);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1e9));
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setSeed((s) => s + 1);
    }, 200);
    return () => clearInterval(id);
  }, []);
  const bars = useMemo(() => makeBars(count, seed), [count, seed]);
  return (
    <div className="waveform">
      {bars.map((h, i) => (
        <span key={i} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

/* Mobile waveform */
function MobileWaveform({ count = 20 }: { count?: number }) {
  const [seed, setSeed] = useState(99);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1e9));
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setSeed((s) => s + 1);
    }, 220);
    return () => clearInterval(id);
  }, []);
  const bars = useMemo(() => makeBars(count, seed), [count, seed]);
  return (
    <div className="mobileWaveform">
      {bars.map((h, i) => (
        <span key={i} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

/* CTA link wrapper */
function CtaLink({
  href,
  external,
  children,
  secondary,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  const cls = secondary ? "ctaBtn ctaBtnSecondary" : "ctaBtn";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* =============================================================
   DESKTOP CARD CONTENT
   ============================================================= */

function VoiceContent() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const selected = DEMOS[selectedIdx];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    if (audio.readyState >= 1) onMeta();
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const selectDemo = (idx: number) => {
    setSelectedIdx(idx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} src={selected.src} preload="metadata" />
      <div className="cardHeader">
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div>
            <p className="cardEyebrow">{cards[0].label}</p>
            <h2 className="cardTitle">{cards[0].title}</h2>
          </div>
          <Image
            src="/images/Background.png"
            alt="Voice over"
            width={44}
            height={44}
            className="rounded-full object-cover"
            style={{ border: "2px solid rgba(252,163,17,0.3)", flexShrink: 0 }}
          />
        </div>
        <CtaLink href={cards[0].href}>Start a Voiceover Project →</CtaLink>
      </div>
      <div className="voiceLayout">
        <div className="voicePlayer">
          <div className="playerTop">
            <button
              className="playBtnLg"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <rect x="6" y="4" width="4" height="16" fill="#161616" />
                  <rect x="14" y="4" width="4" height="16" fill="#161616" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M8 5v14l11-7z" fill="#161616" />
                </svg>
              )}
            </button>
            <div className="playerMeta">
              <h4>{selected.title}</h4>
            </div>
            <button
              className="muteBtn"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                    fill="#f0f0f0"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    d="M3 9v6h4l5 5V4L7 9H3zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                    fill="#f0f0f0"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="voiceDesc">{selected.desc}</p>
          <Waveform />
          <div className="progressTrack">
            <div className="progressFill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="demoCards">
          {DEMOS.map((demo, idx) => (
            <div
              key={demo.id}
              className={`demoCard ${idx === selectedIdx ? "active" : ""}`}
              onClick={() => selectDemo(idx)}
            >
              <div className="demoCardHeader">
                <h4>{demo.title}</h4>
                <div className="demoCardActions">
                  <a
                    href={demo.src}
                    download
                    className="downloadBtn"
                    title="Download demo"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path
                        d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <p>{demo.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function BlogContent({ posts }: { posts?: GhostPost[] }) {
  const displayPosts = (posts || []).slice(0, 4);
  const tagColors: Record<string, { bg: string; text: string }> = {
    latest: { bg: "rgba(65,102,245,0.18)", text: "#4166f5" },
    "gm-tips": { bg: "rgba(175,224,206,0.18)", text: "#afe0ce" },
    process: { bg: "rgba(252,163,17,0.18)", text: "#fca311" },
    tech: { bg: "rgba(204,219,220,0.18)", text: "#CCDBDC" },
  };

  return (
    <>
      <div className="cardHeader">
        <div>
          <p className="cardEyebrow">{cards[1].label}</p>
          <h2 className="cardTitle">{cards[1].title}</h2>
        </div>
        <CtaLink href={cards[1].href}>Read more →</CtaLink>
      </div>
      <div className="blogBody">
        {displayPosts[0] && (
          <a
            href={displayPosts[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="blogHero"
          >
            {displayPosts[0].feature_image && (
              <div className="blogThumb">
                <img
                  src={displayPosts[0].feature_image}
                  alt={displayPosts[0].title}
                />
              </div>
            )}
            <div className="blogHeroMeta">
              <span
                className="blogTag"
                style={{
                  background:
                    tagColors[displayPosts[0].primary_tag?.slug || "latest"]
                      ?.bg || tagColors.latest.bg,
                  color:
                    tagColors[displayPosts[0].primary_tag?.slug || "latest"]
                      ?.text || tagColors.latest.text,
                }}
              >
                {displayPosts[0].primary_tag?.name || "Latest"}
              </span>
              <h3>{displayPosts[0].title}</h3>
              <p>{displayPosts[0].excerpt || "Read more on the blog..."}</p>
            </div>
          </a>
        )}
        <div className="blogMiniList">
          {displayPosts.slice(1, 4).map((post) => {
            const tag = post.primary_tag;
            const colors = tagColors[tag?.slug || "latest"] || tagColors.latest;
            return (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="blogMini"
              >
                <span
                  className="blogTag"
                  style={{ background: colors.bg, color: colors.text }}
                >
                  {tag?.name || "Latest"}
                </span>
                <h4>{post.title}</h4>
                <p>{post.excerpt || "Read more on the blog..."}</p>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

function CreationContent() {
  return (
    <>
      <div className="cardHeader">
        <div>
          <p className="cardEyebrow">{cards[2].label}</p>
          <h2 className="cardTitle">{cards[2].title}</h2>
        </div>
      </div>
      <div className="contentGrid">
        <a
          href="https://www.youtube.com/@Gitchegumi"
          target="_blank"
          rel="noopener noreferrer"
          className="platformCard"
        >
          <div className="platformHeader">
            <div className="platformIcon youtube">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z" />
              </svg>
            </div>
            <h3>YouTube</h3>
          </div>
          <p>
            Deep dives, lets plays, and live streams — mostly MMO, survival, and
            sim gaming with a variety focus. Building toward edited series and
            long-form content.
          </p>
        </a>

        <a
          href="https://www.twitch.tv/gitchegumi"
          target="_blank"
          rel="noopener noreferrer"
          className="platformCard"
        >
          <div className="platformHeader">
            <div className="platformIcon twitch">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
            </div>
            <h3>Twitch</h3>
          </div>
          <p>
            Live streaming in real time. Unfiltered, unscripted — just gameplay,
            commentary, and whatever chaos the chat brings.
          </p>
        </a>

        <a
          href="https://www.tiktok.com/@gitchegumi"
          target="_blank"
          rel="noopener noreferrer"
          className="platformCard"
        >
          <div className="platformHeader">
            <div className="platformIcon tiktok">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </div>
            <h3>TikTok</h3>
          </div>
          <p>
            Live streams and short-form video experiments. Quick clips, random
            ideas, and whatever content format seems fun that week.
          </p>
        </a>
      </div>
    </>
  );
}

function PersonContent() {
  return (
    <>
      <div className="cardHeader">
        <div>
          <p className="cardEyebrow">{cards[3].label}</p>
          <h2 className="cardTitle">{cards[3].title}</h2>
        </div>
        <CtaLink href={cards[3].href}>Full story →</CtaLink>
      </div>
      <div className="aboutLayout">
        <div className="aboutAvatar">
          <Image
            src="/images/beach-selfie.jpg"
            alt="Mat at the beach"
            width={130}
            height={130}
            className="rounded-full object-cover"
          />
        </div>
        <div className="aboutText">
          <p className="lead">
            I speak the lines, build the tools, and roll the dice.
          </p>
          <p>
            I'm a serving Army warrant officer, aviator, technologist, voiceover
            artist, writer, and lifelong tinkerer. I've spent my career solving
            problems under pressure, from aviation operations to cloud
            infrastructure, DevOps, web development, and AI.
          </p>
          <p>
            This site is an example of my build process: I guide the agents,
            shape the work, and make the final calls.
          </p>
          <div
            style={{ display: "flex", gap: "0.625rem", marginTop: "0.5rem" }}
          >
            <CtaLink href="https://discord.gg/0ivCrUa3GMaqtjkH" external>
              Come say hi →
            </CtaLink>
            <CtaLink href="/portfolio" secondary>
              View Resume →
            </CtaLink>
          </div>
        </div>
      </div>
    </>
  );
}

function MadeContent() {
  return (
    <>
      <div className="cardHeader">
        <div>
          <p className="cardEyebrow">{cards[4].label}</p>
          <h2 className="cardTitle">{cards[4].title}</h2>
        </div>
        <CtaLink href={cards[4].href}>All tools →</CtaLink>
      </div>
      <div className="builtGrid">
        <Link href="/debtpipe" className="builtItem">
          <div className="builtIcon">💰</div>
          <h4>DebtPipe</h4>
          <p>Snowball calculator with PDF exports.</p>
        </Link>
        <Link href="/budget" className="builtItem">
          <div className="builtIcon">📊</div>
          <h4>SpendPipe</h4>
          <p>Monthly budgeting &amp; cash flow.</p>
        </Link>
        <Link href="/accountpipe" className="builtItem">
          <div className="builtIcon">🏦</div>
          <h4>AccountPipe</h4>
          <p>All your accounts in one place.</p>
        </Link>
        <Link href="/trakpipe" className="builtItem">
          <div className="builtIcon">🧾</div>
          <h4>TrakPipe</h4>
          <p>Transaction ledger &amp; import.</p>
        </Link>
      </div>
      <CtaLink href={cards[4].href} secondary>
        Browse all projects
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </CtaLink>
    </>
  );
}

const CardContents = [
  VoiceContent,
  BlogContent,
  CreationContent,
  PersonContent,
  MadeContent,
];

/* =============================================================
   MOBILE BLADE CONTENT
   ============================================================= */

function MobileVoice() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const selected = DEMOS[selectedIdx];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    if (audio.readyState >= 1) onMeta();
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const selectDemo = (idx: number) => {
    setSelectedIdx(idx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} src={selected.src} preload="metadata" />
      <span className="bladeLabel">{cards[0].label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <h2 className="bladeTitle">{cards[0].title}</h2>
        <Image
          src="/images/Background.png"
          alt="Voice over"
          width={38}
          height={38}
          className="rounded-full object-cover"
          style={{ border: "2px solid rgba(252,163,17,0.3)", flexShrink: 0 }}
        />
      </div>
      <div className="mobileVoicePlayer">
        <div className="playerTop">
          <button
            className="playBtnLg"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <rect x="6" y="4" width="4" height="16" fill="#161616" />
                <rect x="14" y="4" width="4" height="16" fill="#161616" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M8 5v14l11-7z" fill="#161616" />
              </svg>
            )}
          </button>
          <div className="playerMeta">
            <h4>{selected.title}</h4>
          </div>
          <button
            className="muteBtn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                  fill="#f0f0f0"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M3 9v6h4l5 5V4L7 9H3zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                  fill="#f0f0f0"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="voiceDesc">{selected.desc}</p>
        <MobileWaveform />
        <div className="progressTrack">
          <div className="progressFill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mobileDemoList">
        {DEMOS.map((demo, idx) => (
          <div
            key={demo.id}
            className={`mobileDemoItem ${idx === selectedIdx ? "active" : ""}`}
            onClick={() => selectDemo(idx)}
          >
            <div className="mobileDemoHeader">
              <h4>{demo.title}</h4>
              <div className="mobileDemoActions">
                <a
                  href={demo.src}
                  download
                  className="downloadBtn"
                  title="Download demo"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <p>{demo.desc}</p>
          </div>
        ))}
      </div>
      <Link href={cards[0].href} className="mobileCta">
        Start a Voiceover Project →
      </Link>
    </>
  );
}

function MobileBlog({ posts }: { posts?: GhostPost[] }) {
  const displayPosts = (posts || []).slice(0, 4);
  const tagColors: Record<string, { bg: string; text: string }> = {
    latest: { bg: "rgba(65,102,245,0.18)", text: "#4166f5" },
    "gm-tips": { bg: "rgba(175,224,206,0.18)", text: "#afe0ce" },
    process: { bg: "rgba(252,163,17,0.18)", text: "#fca311" },
    tech: { bg: "rgba(204,219,220,0.18)", text: "#CCDBDC" },
  };

  return (
    <>
      <span className="bladeLabel">{cards[1].label}</span>
      <h2 className="bladeTitle">{cards[1].title}</h2>
      <div className="mobileBlogGrid">
        {displayPosts.map((post) => {
          const tag = post.primary_tag;
          const colors = tagColors[tag?.slug || "latest"] || tagColors.latest;
          return (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mobileBlogCard"
            >
              <span
                className="mobileBlogTag"
                style={{ background: colors.bg, color: colors.text }}
              >
                {tag?.name || "Latest"}
              </span>
              <h4>{post.title}</h4>
              <p>{post.excerpt || "Read more on the blog..."}</p>
            </a>
          );
        })}
      </div>
    </>
  );
}

function MobileCreation() {
  return (
    <>
      <span className="bladeLabel">{cards[2].label}</span>
      <h2 className="bladeTitle">{cards[2].title}</h2>
      <div className="mobilePlatformGrid">
        <a
          href="https://www.youtube.com/@Gitchegumi"
          target="_blank"
          rel="noopener noreferrer"
          className="mobilePlatformCard"
        >
          <div className="mobilePlatformHeader">
            <div className="mobilePlatformIcon youtube">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z" />
              </svg>
            </div>
            <h4>YouTube</h4>
          </div>
          <p>
            Deep dives, lets plays, and live streams — mostly MMO, survival, and
            sim gaming with a variety focus. Building toward edited series and
            long-form content.
          </p>
        </a>

        <a
          href="https://www.twitch.tv/gitchegumi"
          target="_blank"
          rel="noopener noreferrer"
          className="mobilePlatformCard"
        >
          <div className="mobilePlatformHeader">
            <div className="mobilePlatformIcon twitch">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
            </div>
            <h4>Twitch</h4>
          </div>
          <p>
            Live streaming in real time. Unfiltered, unscripted — just gameplay,
            commentary, and whatever chaos the chat brings.
          </p>
        </a>

        <a
          href="https://www.tiktok.com/@gitchegumi"
          target="_blank"
          rel="noopener noreferrer"
          className="mobilePlatformCard"
        >
          <div className="mobilePlatformHeader">
            <div className="mobilePlatformIcon tiktok">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </div>
            <h4>TikTok</h4>
          </div>
          <p>
            Live streams and short-form video experiments. Quick clips, random
            ideas, and whatever content format seems fun that week.
          </p>
        </a>
      </div>
    </>
  );
}

function MobilePerson() {
  return (
    <>
      <span className="bladeLabel">{cards[3].label}</span>
      <h2 className="bladeTitle">{cards[3].title}</h2>
      <div className="mobileAboutAvatar">
        <Image
          src="/images/beach-selfie.jpg"
          alt="Mat"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </div>
      <div className="mobileAboutText">
        <p className="lead">
          I speak the lines, build the tools, and roll the dice.
        </p>
        <p>
          I'm a serving Army warrant officer, aviator, technologist, voiceover
          artist, writer, and lifelong tinkerer. I've spent my career solving
          problems under pressure, from aviation operations to cloud
          infrastructure, DevOps, web development, and AI.
        </p>
        <p>
          This site is an example of my build process: I guide the agents, shape
          the work, and make the final calls.
        </p>
        <div className="mobileContactBtns">
          <a
            href="https://discord.gg/0ivCrUa3GMaqtjkH"
            target="_blank"
            rel="noopener noreferrer"
            className="mobileCta"
          >
            Come say hi
          </a>
          <Link href="/about" className="mobileCta mobileCtaSecondary">
            View Resume
          </Link>
        </div>
      </div>
    </>
  );
}

function MobileMade() {
  return (
    <>
      <span className="bladeLabel">{cards[4].label}</span>
      <h2 className="bladeTitle">{cards[4].title}</h2>
      <div className="mobileBuiltGrid">
        <Link href="/debtpipe" className="mobileBuiltItem">
          <div className="mobileBuiltIcon">💰</div>
          <h4>DebtPipe</h4>
          <p>Snowball calculator.</p>
        </Link>
        <Link href="/budget" className="mobileBuiltItem">
          <div className="mobileBuiltIcon">📊</div>
          <h4>SpendPipe</h4>
          <p>Budget tracker.</p>
        </Link>
        <Link href="/accountpipe" className="mobileBuiltItem">
          <div className="mobileBuiltIcon">🏦</div>
          <h4>AccountPipe</h4>
          <p>Account manager.</p>
        </Link>
        <Link href="/trakpipe" className="mobileBuiltItem">
          <div className="mobileBuiltIcon">🧾</div>
          <h4>TrakPipe</h4>
          <p>Transaction ledger.</p>
        </Link>
      </div>
      <Link href={cards[4].href} className="mobileCta">
        Browse all projects →
      </Link>
    </>
  );
}

const MobileBlades = [
  MobileVoice,
  MobileBlog,
  MobileCreation,
  MobilePerson,
  MobileMade,
];
const BladeAccents = ["#fca311", "#4166f5", "#8b5cf6", "#10b981", "#f97316"];

/* =============================================================
   MAIN PAGE COMPONENT
   ============================================================= */

export default function HomeClient({ blogPosts }: { blogPosts: GhostPost[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollAccum = useRef(0);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  /* Detect mobile breakpoint */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 800);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── DESKTOP: Rolodex positioning ── */
  const RIGHT_STEP = 70;
  const DOWN_STEP = 16;
  const SCALE_STEP = 0.012;
  const OPACITY_STEP = 0.08;

  function positionCard(card: HTMLDivElement | null, distance: number) {
    if (!card) return;
    const isActive = distance === 0;
    const absDist = Math.abs(distance);
    const xOffset = distance * RIGHT_STEP;
    const yOffset = absDist * DOWN_STEP;
    const scale = 1 - absDist * SCALE_STEP;
    const opacity = 1 - absDist * OPACITY_STEP;
    card.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px) scale(${scale})`;
    card.style.opacity = String(Math.max(opacity, 0.4));
    card.style.zIndex = String(50 - absDist);
    card.classList.toggle("active", isActive);
  }

  useEffect(() => {
    if (isMobile) return;
    const cardEls = document.querySelectorAll(
      `.card`,
    ) as NodeListOf<HTMLDivElement>;
    cardEls.forEach((card, i) => {
      let dist = i - activeIndex;
      if (dist < -2) dist += TOTAL_CARDS;
      if (dist > 2) dist -= TOTAL_CARDS;
      positionCard(card, dist);
    });
  }, [activeIndex, isMobile]);

  /* ── Keyboard ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isMobile) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % TOTAL_CARDS);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + TOTAL_CARDS) % TOTAL_CARDS);
      } else if (e.key >= "1" && e.key <= "5") {
        const idx = parseInt(e.key) - 1;
        if (idx < TOTAL_CARDS) setActiveIndex(idx);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile]);

  /* ── Scroll wheel ── */
  useEffect(() => {
    if (isMobile) return;
    const THRESH = 50;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      scrollAccum.current += e.deltaY;
      if (Math.abs(scrollAccum.current) > THRESH) {
        if (scrollAccum.current > 0) {
          setActiveIndex((i) => (i + 1) % TOTAL_CARDS);
        } else {
          setActiveIndex((i) => (i - 1 + TOTAL_CARDS) % TOTAL_CARDS);
        }
        scrollAccum.current = 0;
      }
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isMobile]);

  /* ── Mobile dots + intersection observer ── */
  const [mobileActive, setMobileActive] = useState(0);
  useEffect(() => {
    if (!isMobile) return;
    const blades = document.querySelectorAll(`.mobileBlade`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(blades).indexOf(entry.target);
            setMobileActive(idx);
          }
        });
      },
      { threshold: 0.5 },
    );
    blades.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, [isMobile]);

  /* ── Render ── */
  return (
    <div className="homeBody">
      <div className="bgGlow" />

      {/* Header */}
      <header className="siteHeader">
        <div className="brandBlock">
          <Image
            src="/images/Mascot.png"
            alt="Gitchegumi Mascot"
            width={isMobile ? 40 : 48}
            height={isMobile ? 40 : 48}
            className="brandLogo"
            priority
          />
          <div>
            <div className="brandLabel">Gitchegumi Media</div>
            <div className="brandName">Army Vet · Technologist · Creator</div>
            {!isMobile && (
              <div className="brandTagline">One page. Five doors.</div>
            )}
          </div>
        </div>
        <Link href="/blog" className="headerCta">
          Start here
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </Link>
      </header>

      {/* ── DESKTOP ROLLODEX ── */}
      <div className="rolodexStage">
        <div className="rolodex">
          {cards.map((card, i) => {
            const Content = CardContents[i];
            return (
              <div
                key={card.id}
                className={`card ${i === activeIndex ? "active" : ""}`}
                id={`card-${i}`}
                data-order={i}
                style={{ "--tab-color": card.tabColor } as React.CSSProperties}
                onClick={(e) => {
                  if (
                    i !== activeIndex &&
                    !(e.target as HTMLElement).closest(`.cardTab`)
                  ) {
                    setActiveIndex(i);
                  }
                }}
              >
                <div className="cardContent">
                  {i === 1 ? <Content posts={blogPosts} /> : <Content />}
                </div>
                <div className="cardHint">
                  <span className="hintLabel">{card.label}</span>
                  <h2>{card.title}</h2>
                </div>
                <div
                  className="cardTab"
                  data-target={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                >
                  <span className="tabName">{card.tab}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {i === 0 && <polygon points="5 3 19 12 5 21 5 3" />}
                    {i === 1 && (
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    )}
                    {i === 2 && <path d="M15 14l-4-4-6 6M20 4l-4 4-4-4" />}
                    {i === 3 && (
                      <>
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </>
                    )}
                    {i === 4 && (
                      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                    )}
                  </svg>
                  <span className="tabNum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard hint (desktop only) */}
      <div className="kbHint">
        <kbd>1-5</kbd> jump
        <span style={{ opacity: 0.25 }}>|</span>
        <kbd>↑↓</kbd> shuffle
      </div>

      {/* ── MOBILE BLADES ── */}
      <div className="mobileScrollContainer" ref={mobileContainerRef}>
        {MobileBlades.map((Blade, i) => (
          <section
            key={i}
            className="mobileBlade"
            id={`mob-${i}`}
            style={{ "--blade-accent": BladeAccents[i] } as React.CSSProperties}
          >
            {i === 1 ? <Blade posts={blogPosts} /> : <Blade />}
          </section>
        ))}
      </div>

      {/* Mobile dot nav */}
      <div className="mobileDots">
        {MobileBlades.map((_, i) => (
          <div
            key={i}
            className={`mobileDot ${i === mobileActive ? "active" : ""}`}
            onClick={() => {
              document
                .getElementById(`mob-${i}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="homeFooter">
        <div className="homeFooterInner">
          <div className="footerLinks">
            <Link href="/blog">Blog</Link>
            <Link href="/voice-over">Voice Over</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/about">Portfolio</Link>
            <Link href="/budget">Store</Link>
            <a
              href="https://github.com/Gitchegumi"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
          <div className="footerSocial">
            <a
              href="https://twitter.com/Gitchegumi"
              target="_blank"
              rel="noopener noreferrer"
              className="socialLink"
              title="Twitter"
            >
              𝕏
            </a>
            <a
              href="https://github.com/Gitchegumi"
              target="_blank"
              rel="noopener noreferrer"
              className="socialLink"
              title="GitHub"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://discord.gg/gitchegumi"
              target="_blank"
              rel="noopener noreferrer"
              className="socialLink"
              title="Discord"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a
              href="https://ko-fi.com/gitchegumi"
              target="_blank"
              rel="noopener noreferrer"
              className="socialLink"
              title="Ko-fi"
            >
              ☕
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
