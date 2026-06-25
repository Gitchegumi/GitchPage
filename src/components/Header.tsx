"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Voice Over", href: "/voice-over" },
  { label: "Tools", href: "/tools" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
];

const NAV_BG =
  "radial-gradient(120% 140% at 0% 0%, rgba(65,102,245,0.12), transparent 45%), radial-gradient(120% 140% at 100% 100%, rgba(252,163,17,0.09), transparent 45%), #0a0a0a";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/blog") return pathname === "/blog";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const pillLinkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "Oswald, sans-serif",
    fontWeight: 500,
    fontSize: "0.7rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: active ? "#161616" : "#f0f0f0",
    background: active ? "#fca311" : "transparent",
    textDecoration: "none",
    padding: "7px 16px",
    borderRadius: "9999px",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, padding: "0.75rem 2rem" }}>
      {/* Desktop nav — hidden on mobile */}
      <nav
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "16px 24px",
          borderRadius: "14px",
          background: NAV_BG,
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 20px 50px -10px rgba(0,0,0,0.7)",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
          <Link href="/" aria-label="Gitchegumi Media home">
            <Image
              src="/images/Mascot.png"
              alt="Gitchegumi Media mascot"
              width={42}
              height={42}
              priority
              style={{ borderRadius: "50%", border: "1px solid rgba(255,255,255,0.16)" }}
            />
          </Link>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.12" }}>
            <span
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 700,
                fontSize: "1.02rem",
                color: "#f0f0f0",
              }}
            >
              Gitchegumi Media
            </span>
            <span
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 400,
                fontSize: "0.55rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#CCDBDC",
                opacity: 0.6,
              }}
            >
              Army Vet · Technologist · Creator
            </span>
          </div>
        </div>

        {/* Centered pill nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "9999px",
            padding: "6px 8px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={pillLinkStyle(isActive(link.href))}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right spacer */}
        <div />
      </nav>

      {/* Mobile nav bar */}
      <nav
        className="flex md:hidden"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderRadius: "12px",
          background: NAV_BG,
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Image
            src="/images/Mascot.png"
            alt="Gitchegumi Media"
            width={36}
            height={36}
            priority
            style={{ borderRadius: "50%", border: "1px solid rgba(255,255,255,0.16)" }}
          />
          <span
            style={{
              fontFamily: "Oswald, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#f0f0f0",
            }}
          >
            Gitchegumi Media
          </span>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#f0f0f0", padding: "4px", lineHeight: 0 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            marginTop: "8px",
            padding: "10px",
            borderRadius: "12px",
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: active ? "#161616" : "#f0f0f0",
                  background: active ? "#fca311" : "rgba(255,255,255,0.04)",
                  textDecoration: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
