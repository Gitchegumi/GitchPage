"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./home.css";

/* =============================================================
   DESKTOP + MOBILE ROLLODEX HOMEPAGE
   ============================================================= */

const TOTAL_CARDS = 5;

/* Card data — tabs link internally, content links out */
const cards = [
  {
    id: 0,
    label: "Featured Studio",
    title: "Voice Over",
    tab: "Voice",
    tabColor: "linear-gradient(to bottom, #fca311, #e07c00)",
    href: "/voice-over",
  },
  {
    id: 1,
    label: "Writing Desk",
    title: "The Blog",
    tab: "Blog",
    tabColor: "linear-gradient(to bottom, #4166f5, #1e3a8a)",
    href: "/blog",
  },
  {
    id: 2,
    label: "Creative Lab",
    title: "The Creation",
    tab: "Create",
    tabColor: "linear-gradient(to bottom, #8b5cf6, #312e81)",
    href: "https://www.youtube.com/@Gitchegumi",
    external: true,
  },
  {
    id: 3,
    label: "About Mat",
    title: "The Person",
    tab: "Person",
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

/* Waveform bar component */
function Waveform({ count = 28 }: { count?: number }) {
  const [bars, setBars] = useState(() =>
    Array.from({ length: count }, () => Math.random() * 60 + 20)
  );
  useEffect(() => {
    const id = setInterval(() => {
      setBars(Array.from({ length: count }, () => Math.random() * 65 + 15));
    }, 200);
    return () => clearInterval(id);
  }, [count]);
  return (
    <div className={"waveform"}>
      {bars.map((h, i) => (
        <span key={i} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

/* Mobile waveform */
function MobileWaveform({ count = 20 }: { count?: number }) {
  const [bars, setBars] = useState(() =>
    Array.from({ length: count }, () => Math.random() * 60 + 20)
  );
  useEffect(() => {
    const id = setInterval(() => {
      setBars(Array.from({ length: count }, () => Math.random() * 65 + 15));
    }, 220);
    return () => clearInterval(id);
  }, [count]);
  return (
    <div className={"mobileWaveform"}>
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
  const cls = secondary
    ? `${"ctaBtn"} ${"ctaBtnSecondary"}`
    : "ctaBtn";
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
  return (
    <>
      <div className={"cardHeader"}>
        <div>
          <p className={"cardEyebrow"}>Featured Studio</p>
          <h2 className={"cardTitle"}>Voice Over</h2>
        </div>
        <CtaLink href="/voice-over">Explore demos →</CtaLink>
      </div>
      <div className={"voiceLayout"}>
        <div className={"voicePlayer"}>
          <div className={"playerTop"}>
            <button className={"playBtnLg"}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M8 5v14l11-7z" fill="#161616" />
              </svg>
            </button>
            <div className={"playerMeta"}>
              <p>Featured reel</p>
              <h4>Commercial / Narrative Demo</h4>
            </div>
          </div>
          <p className={"voiceDesc"}>
            Warm narration, grounded character work, and practical audio for
            brands, games, explainers, and story-driven projects.
          </p>
          <Waveform />
          <div className={"progressTrack"}>
            <div className={"progressFill"} />
          </div>
        </div>
        <div className={"demoCards"}>
          <Link href="/voice-over" className={"demoCard"}>
            <div className={"demoCardHeader"}>
              <h4>Demo Option One</h4>
              <span className={"miniPlay"}>
                <svg viewBox="0 0 24 24" width="10" height="10">
                  <path d="M8 5v14l11-7z" fill="#161616" />
                </svg>
              </span>
            </div>
            <p>Warm commercial read for lifestyle brands.</p>
          </Link>
          <Link href="/voice-over" className={"demoCard"}>
            <div className={"demoCardHeader"}>
              <h4>Demo Option Two</h4>
              <span className={"miniPlay"}>
                <svg viewBox="0 0 24 24" width="10" height="10">
                  <path d="M8 5v14l11-7z" fill="#161616" />
                </svg>
              </span>
            </div>
            <p>Character narration and documentary storytelling.</p>
          </Link>
        </div>
      </div>
    </>
  );
}

function BlogContent() {
  return (
    <>
      <div className={"cardHeader"}>
        <div>
          <p className={"cardEyebrow"}>Writing Desk</p>
          <h2 className={"cardTitle"}>The Blog</h2>
        </div>
        <CtaLink href="/blog">Read more →</CtaLink>
      </div>
      <div className={"contentGrid"}>
        <div className={"contentCard"}>
          <div className={"iconBox"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <p className={"contentEyebrow"}>Latest Posts</p>
          <h3>Words &amp; Worlds</h3>
        </div>
        <div className={"detailCard"}>
          <div className={"blogGrid"}>
            <Link href="/blog" className={"blogCard"}>
              <span className={"blogTag"} style={{ background: "rgba(65,102,245,0.18)", color: "#4166f5" }}>
                Latest
              </span>
              <h4>The Quiet Power of Narrative Voice</h4>
              <p>How the unsung craft shapes our imagination.</p>
            </Link>
            <Link href="/blog" className={"blogCard"}>
              <span className={"blogTag"} style={{ background: "rgba(175,224,206,0.18)", color: "#afe0ce" }}>
                GM Tips
              </span>
              <h4>Believable Worlds in Five Minutes</h4>
              <p>Improvise lore that feels ancient.</p>
            </Link>
            <Link href="/blog" className={"blogCard"}>
              <span className={"blogTag"} style={{ background: "rgba(252,163,17,0.18)", color: "#fca311" }}>
                Process
              </span>
              <h4>From Script to Sound</h4>
              <p>The ritual of talking to an empty room.</p>
            </Link>
            <Link href="/blog" className={"blogCard"}>
              <span className={"blogTag"} style={{ background: "rgba(204,219,220,0.18)", color: "#CCDBDC" }}>
                Tech
              </span>
              <h4>Self-Hosting for Creators</h4>
              <p>Why I moved everything off the cloud.</p>
            </Link>
          </div>
          <CtaLink href="/blog">
            Read the latest
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </CtaLink>
        </div>
      </div>
    </>
  );
}

function CreationContent() {
  return (
    <>
      <div className={"cardHeader"}>
        <div>
          <p className={"cardEyebrow"}>Creative Lab</p>
          <h2 className={"cardTitle"}>The Creation</h2>
        </div>
        <CtaLink href="https://www.youtube.com/@Gitchegumi" external>Watch →</CtaLink>
      </div>
      <div className={"contentGrid"}>
        <div className={"contentCard"}>
          <div className={"iconBox"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 14l-4-4-6 6M20 4l-4 4-4-4" />
            </svg>
          </div>
          <p className={"contentEyebrow"}>Creative Output</p>
          <h3>Stories, Streamed</h3>
        </div>
        <div className={"detailCard"}>
          <p>
            TTRPG actual plays, worldbuilding deep-dives, music experiments, and
            behind-the-scenes content. A mix of polished edited series and live
            unfiltered chaos. No corporate gloss — just real creative work.
          </p>
          <div className={"platforms"}>
            <a
              href="https://www.youtube.com/@Gitchegumi"
              target="_blank"
              rel="noopener noreferrer"
              className={"platform"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z" />
              </svg>
              YouTube
            </a>
            <a
              href="https://www.twitch.tv/gitchegumi"
              target="_blank"
              rel="noopener noreferrer"
              className={"platform"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              Twitch
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function PersonContent() {
  return (
    <>
      <div className={"cardHeader"}>
        <div>
          <p className={"cardEyebrow"}>About Mat</p>
          <h2 className={"cardTitle"}>The Person</h2>
        </div>
        <CtaLink href="/portfolio">Full story →</CtaLink>
      </div>
      <div className={"aboutLayout"}>
        <div className={"aboutAvatar"}>
          <Image
            src="/images/beach-selfie.jpg"
            alt="Mat at the beach"
            width={130}
            height={130}
            className="rounded-full object-cover"
          />
        </div>
        <div className={"aboutText"}>
          <p className={"lead"}>I write the words, speak the lines, and roll the dice.</p>
          <p>
            Army veteran turned technologist, blending discipline and creativity
            to build scalable solutions. Experienced in cloud infrastructure,
            DevOps, web development, and AI integrations.
          </p>
          <p>I built this site myself — every line of code, every word, every audio clip.</p>
          <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.5rem" }}>
            <CtaLink href="mailto:mat@gitchegumi.com">Say Hello →</CtaLink>
            <CtaLink href="/about" secondary>View Resume →</CtaLink>
          </div>
        </div>
      </div>
    </>
  );
}

function MadeContent() {
  return (
    <>
      <div className={"cardHeader"}>
        <div>
          <p className={"cardEyebrow"}>Build Log</p>
          <h2 className={"cardTitle"}>I Made This</h2>
        </div>
        <CtaLink href="/tools">All tools →</CtaLink>
      </div>
      <div className={"builtGrid"}>
        <Link href="/debtpipe" className={"builtItem"}>
          <div className={"builtIcon"}>💰</div>
          <h4>DebtPipe</h4>
          <p>Snowball calculator with PDF exports.</p>
        </Link>
        <Link href="/budget" className={"builtItem"}>
          <div className={"builtIcon"}>📊</div>
          <h4>SpendPipe</h4>
          <p>Monthly budgeting &amp; cash flow.</p>
        </Link>
        <Link href="/accountpipe" className={"builtItem"}>
          <div className={"builtIcon"}>🏦</div>
          <h4>AccountPipe</h4>
          <p>All your accounts in one place.</p>
        </Link>
        <Link href="/trakpipe" className={"builtItem"}>
          <div className={"builtIcon"}>🧾</div>
          <h4>TrakPipe</h4>
          <p>Transaction ledger &amp; import.</p>
        </Link>
      </div>
      <CtaLink href="/tools" secondary>
        Browse all projects
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </CtaLink>
    </>
  );
}

const CardContents = [VoiceContent, BlogContent, CreationContent, PersonContent, MadeContent];

/* =============================================================
   MOBILE BLADE CONTENT
   ============================================================= */

function MobileVoice() {
  return (
    <>
      <span className={"bladeLabel"}>Featured Studio</span>
      <h2 className={"bladeTitle"}>Voice Over</h2>
      <div className={"mobileVoicePlayer"}>
        <div className={"playerTop"}>
          <button className={"playBtnLg"}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M8 5v14l11-7z" fill="#161616" />
            </svg>
          </button>
          <div className={"playerMeta"}>
            <p>Featured reel</p>
            <h4>Commercial / Narrative Demo</h4>
          </div>
        </div>
        <p className={"voiceDesc"}>
          Warm narration, grounded character work, and practical audio for
          brands, games, explainers, and story-driven projects.
        </p>
        <MobileWaveform />
        <div className={"progressTrack"}>
          <div className={"progressFill"} />
        </div>
      </div>
      <Link href="/voice-over" className={"mobileCta"}>Explore demos →</Link>
    </>
  );
}

function MobileBlog() {
  return (
    <>
      <span className={"bladeLabel"}>Writing Desk</span>
      <h2 className={"bladeTitle"}>The Blog</h2>
      <div className={"mobileBlogGrid"}>
        <Link href="/blog" className={"mobileBlogCard"}>
          <span className={"mobileBlogTag"} style={{ background: "rgba(65,102,245,0.18)", color: "#4166f5" }}>Latest</span>
          <h4>The Quiet Power of Narrative Voice</h4>
          <p>How the unsung craft shapes our imagination.</p>
        </Link>
        <Link href="/blog" className={"mobileBlogCard"}>
          <span className={"mobileBlogTag"} style={{ background: "rgba(175,224,206,0.18)", color: "#afe0ce" }}>GM Tips</span>
          <h4>Believable Worlds in Five Minutes</h4>
          <p>Improvise lore that feels ancient.</p>
        </Link>
        <Link href="/blog" className={"mobileBlogCard"}>
          <span className={"mobileBlogTag"} style={{ background: "rgba(252,163,17,0.18)", color: "#fca311" }}>Process</span>
          <h4>From Script to Sound</h4>
          <p>The ritual of talking to an empty room.</p>
        </Link>
        <Link href="/blog" className={"mobileBlogCard"}>
          <span className={"mobileBlogTag"} style={{ background: "rgba(204,219,220,0.18)", color: "#CCDBDC" }}>Tech</span>
          <h4>Self-Hosting for Creators</h4>
          <p>Why I moved everything off the cloud.</p>
        </Link>
      </div>
    </>
  );
}

function MobileCreation() {
  return (
    <>
      <span className={"bladeLabel"}>Creative Lab</span>
      <h2 className={"bladeTitle"}>The Creation</h2>
      <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(240,240,240,0.6)", marginBottom: "1rem" }}>
        TTRPG actual plays, worldbuilding deep-dives, music experiments, and
        behind-the-scenes content. A mix of polished edited series and live
        unfiltered chaos.
      </p>
      <div className={"mobilePlatforms"}>
        <a href="https://www.youtube.com/@Gitchegumi" target="_blank" rel="noopener noreferrer" className={"mobilePlatform"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z" />
          </svg>
          YouTube
        </a>
        <a href="https://www.twitch.tv/gitchegumi" target="_blank" rel="noopener noreferrer" className={"mobilePlatform"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          Twitch
        </a>
      </div>
    </>
  );
}

function MobilePerson() {
  return (
    <>
      <span className={"bladeLabel"}>About Mat</span>
      <h2 className={"bladeTitle"}>The Person</h2>
      <div className={"mobileAboutAvatar"}>
        <Image src="/images/beach-selfie.jpg" alt="Mat" width={100} height={100} className="rounded-full object-cover" />
      </div>
      <div className={"mobileAboutText"}>
        <p className={"lead"}>I write the words, speak the lines, and roll the dice.</p>
        <p>Army veteran turned technologist. Cloud, DevOps, web dev, AI.</p>
        <p>I built this site myself — every line of code, every word.</p>
        <div className={"mobileContactBtns"}>
          <Link href="mailto:mat@gitchegumi.com" className={"mobileCta"}>Say Hello</Link>
          <Link href="/about" className={`${"mobileCta"} ${"mobileCtaSecondary"}`}>View Resume</Link>
        </div>
      </div>
    </>
  );
}

function MobileMade() {
  return (
    <>
      <span className={"bladeLabel"}>Build Log</span>
      <h2 className={"bladeTitle"}>I Made This</h2>
      <div className={"mobileBuiltGrid"}>
        <Link href="/debtpipe" className={"mobileBuiltItem"}>
          <div className={"mobileBuiltIcon"}>💰</div>
          <h4>DebtPipe</h4>
          <p>Snowball calculator.</p>
        </Link>
        <Link href="/budget" className={"mobileBuiltItem"}>
          <div className={"mobileBuiltIcon"}>📊</div>
          <h4>SpendPipe</h4>
          <p>Budget tracker.</p>
        </Link>
        <Link href="/accountpipe" className={"mobileBuiltItem"}>
          <div className={"mobileBuiltIcon"}>🏦</div>
          <h4>AccountPipe</h4>
          <p>Account manager.</p>
        </Link>
        <Link href="/trakpipe" className={"mobileBuiltItem"}>
          <div className={"mobileBuiltIcon"}>🧾</div>
          <h4>TrakPipe</h4>
          <p>Transaction ledger.</p>
        </Link>
      </div>
      <Link href="/tools" className={"mobileCta"}>Browse all projects →</Link>
    </>
  );
}

const MobileBlades = [MobileVoice, MobileBlog, MobileCreation, MobilePerson, MobileMade];
const BladeAccents = ["#fca311", "#4166f5", "#8b5cf6", "#10b981", "#f97316"];

/* =============================================================
   MAIN PAGE COMPONENT
   ============================================================= */

export default function HomePage() {
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
    const cardEls = document.querySelectorAll(`.${"card"}`) as NodeListOf<HTMLDivElement>;
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
    const blades = document.querySelectorAll(`.${"mobileBlade"}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(blades).indexOf(entry.target);
            setMobileActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    blades.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, [isMobile]);

  /* ── Render ── */
  return (
    <div className={"homeBody"}>
      <div className={"bgGlow"} />

      {/* Header */}
      <header className={"siteHeader"}>
        <div className={"brandBlock"}>
          <Image
            src="/images/Mascot.png"
            alt="Gitchegumi Mascot"
            width={isMobile ? 40 : 48}
            height={isMobile ? 40 : 48}
            className={"brandLogo"}
            priority
          />
          <div>
            <div className={"brandLabel"}>Gitchegumi Media</div>
            <div className={"brandName"}>Army Vet · Technologist · Creator</div>
            {!isMobile && (
              <div className={"brandTagline"}>One page. Five doors.</div>
            )}
          </div>
        </div>
        <Link href="/portfolio" className={"headerCta"}>
          Start here
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </Link>
      </header>

      {/* ── DESKTOP ROLLODEX ── */}
      <div className={"rolodexStage"}>
        <div className={"rolodex"}>
          {cards.map((card, i) => {
            const Content = CardContents[i];
            return (
              <div
                key={card.id}
                className={`${"card"} ${i === activeIndex ? "active" : ""}`}
                id={`card-${i}`}
                data-order={i}
                style={{ "--tab-color": card.tabColor } as React.CSSProperties}
                onClick={(e) => {
                  if (i !== activeIndex && !(e.target as HTMLElement).closest(`.${"cardTab"}`)) {
                    setActiveIndex(i);
                  }
                }}
              >
                <div className={"cardContent"}>
                  <Content />
                </div>
                <div className={"cardHint"}>
                  <span className={"hintLabel"}>{card.label}</span>
                  <h2>{card.title}</h2>
                </div>
                <div
                  className={"cardTab"}
                  data-target={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                >
                  <span className={"tabName"}>{card.tab}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {i === 0 && <polygon points="5 3 19 12 5 21 5 3" />}
                    {i === 1 && <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />}
                    {i === 2 && <path d="M15 14l-4-4-6 6M20 4l-4 4-4-4" />}
                    {i === 3 && (
                      <>
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </>
                    )}
                    {i === 4 && <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />}
                  </svg>
                  <span className={"tabNum"}>{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard hint (desktop only) */}
      <div className={"kbHint"}>
        <kbd>1-5</kbd> jump
        <span style={{ opacity: 0.25 }}>|</span>
        <kbd>↑↓</kbd> shuffle
      </div>

      {/* ── MOBILE BLADES ── */}
      <div className={"mobileScrollContainer"} ref={mobileContainerRef}>
        {MobileBlades.map((Blade, i) => (
          <section
            key={i}
            className={"mobileBlade"}
            id={`mob-${i}`}
            style={{ "--blade-accent": BladeAccents[i] } as React.CSSProperties}
          >
            <Blade />
          </section>
        ))}
      </div>

      {/* Mobile dot nav */}
      <div className={"mobileDots"}>
        {MobileBlades.map((_, i) => (
          <div
            key={i}
            className={`${"mobileDot"} ${i === mobileActive ? "active" : ""}`}
            onClick={() => {
              document.getElementById(`mob-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className={"homeFooter"}>
        <div className={"homeFooterInner"}>
          <div className={"footerLinks"}>
            <Link href="/blog">Blog</Link>
            <Link href="/voice-over">Voice Over</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/about">Portfolio</Link>
            <Link href="/budget">Store</Link>
            <a href="https://github.com/Gitchegumi" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <div className={"footerSocial"}>
            <a href="https://twitter.com/Gitchegumi" target="_blank" rel="noopener noreferrer" className={"socialLink"} title="Twitter">𝕏</a>
            <a href="https://github.com/Gitchegumi" target="_blank" rel="noopener noreferrer" className={"socialLink"} title="GitHub">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="https://discord.gg/gitchegumi" target="_blank" rel="noopener noreferrer" className={"socialLink"} title="Discord">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a href="https://ko-fi.com/gitchegumi" target="_blank" rel="noopener noreferrer" className={"socialLink"} title="Ko-fi">☕</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
