import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Voice Over", href: "/voice-over" },
  { label: "Tools", href: "/tools" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
];

const SOCIAL_LINKS = [
  { label: "X / Twitter", href: "https://twitter.com/GitchegumiGames", display: "𝕏" },
  { label: "GitHub", href: "https://github.com/Gitchegumi", display: "GH" },
  { label: "Discord", href: "https://discord.gg/0ivCrUa3GMaqtjkH", display: "DC" },
  { label: "Ko-fi", href: "https://ko-fi.com/gitchegumi", display: "Ko" },
];

const circleStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.14)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Oswald, sans-serif",
  fontWeight: 600,
  fontSize: "0.62rem",
  color: "#CCDBDC",
  textDecoration: "none",
  flexShrink: 0,
};

export default function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "26px 40px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        flexWrap: "wrap",
        gap: "1rem",
        background: "#0a0a0a",
      }}
    >
      <div style={{ display: "flex", gap: "26px", flexWrap: "wrap" }}>
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: "Oswald, sans-serif",
              fontWeight: 500,
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#9aa3a6",
              textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            style={circleStyle}
          >
            {s.display}
          </a>
        ))}
      </div>
    </footer>
  );
}
