import Certifications from "@/components/utilities/Certifications";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Portfolio | Gitchegumi Media",
  description:
    "Mathew 'Gitchegumi' Lindholm's technical CV and certifications.",
};

const SKILLS = [
  "Over 18 years of military leadership and technical problem-solving experience",
  "Full-stack web development with Next.js, React, TypeScript",
  "Containerization and orchestration using Docker, Docker Compose, Kubernetes",
  "Infrastructure as Code with Ansible and Terraform",
  "Cloud environments including Azure and Oracle Cloud",
  "Continuous Integration & Delivery pipelines (CI/CD)",
  "Data analysis with Python, Power BI, and Excel",
  "AI integrations with OpenAI APIs",
];

const EDUCATION = [
  {
    degree: "Master of Science, Applied Business Analytics",
    school: "American Military University",
    year: "In progress",
    color: "#4166f5",
  },
  {
    degree: "Bachelor of Science, Accounting",
    school: "University of Minnesota Crookston",
    year: "2022",
    color: "#afe0ce",
  },
  {
    degree: "Executive AI Technician Program",
    school: "Carnegie Mellon University",
    year: "2023",
    color: "#fca311",
  },
];

const CONTACT_LINKS = [
  { label: "GitHub Profile", href: "https://github.com/Gitchegumi", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mat-lindholm/", external: true },
  { label: "mat@gitchegumi.com", href: "mailto:mat@gitchegumi.com", external: false },
];

const sectionCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "18px",
  padding: "28px 32px",
};

const eyebrow: React.CSSProperties = {
  fontFamily: "Oswald, sans-serif",
  fontWeight: 600,
  fontSize: "0.64rem",
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  color: "#CCDBDC",
  opacity: 0.7,
  marginBottom: "16px",
};

const sectionHeading: React.CSSProperties = {
  fontFamily: "Oswald, sans-serif",
  fontWeight: 700,
  fontSize: "1.35rem",
  color: "#f0f0f0",
  margin: "0 0 18px",
  letterSpacing: "0.04em",
};

export default function TechnicalPortfolioPage() {
  return (
    <div
      style={{
        background:
          "radial-gradient(120% 140% at 0% 0%, rgba(65,102,245,0.08), transparent 40%), radial-gradient(100% 120% at 100% 100%, rgba(252,163,17,0.06), transparent 40%), #0a0a0a",
        color: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2.5rem" }}>

        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <div style={eyebrow}>Technical CV · Portfolio</div>
          <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.07, color: "#f0f0f0", margin: "0 0 14px", letterSpacing: "-0.01em" }}>
            Mathew "Gitchegumi" Lindholm
          </h1>
          <p style={{ fontFamily: "'Roboto Serif', serif", fontSize: "1rem", lineHeight: 1.66, color: "#9aa3a6", maxWidth: "42rem", margin: 0 }}>
            Army veteran turned technologist — blending discipline and creativity to build scalable solutions. Experienced in cloud infrastructure, DevOps, web development, and AI integrations. Passionate about continuous learning and empowering others through technology.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Experience & Skills */}
          <section style={sectionCard}>
            <div style={eyebrow}>Experience</div>
            <h2 style={sectionHeading}>Skills</h2>
            <ul style={{ margin: 0, padding: "0 0 0 1.3rem", display: "flex", flexDirection: "column", gap: "10px", listStyle: "disc" }}>
              {SKILLS.map((s) => (
                <li key={s} style={{ fontFamily: "'Roboto Serif', serif", fontSize: "0.94rem", lineHeight: 1.6, color: "#cdd2d3" }}>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* Certifications component */}
          <section style={sectionCard}>
            <div style={eyebrow}>Credentials</div>
            <h2 style={sectionHeading}>Certifications</h2>
            <Certifications />
          </section>

          {/* Education */}
          <section style={sectionCard}>
            <div style={eyebrow}>Academic</div>
            <h2 style={sectionHeading}>Education</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {EDUCATION.map((e) => (
                <div key={e.degree} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "3px", borderRadius: "2px", background: e.color, flexShrink: 0, alignSelf: "stretch", minHeight: "40px" }} />
                  <div>
                    <div style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: "0.97rem", color: "#f0f0f0", marginBottom: "2px" }}>
                      {e.degree}
                    </div>
                    <div style={{ fontFamily: "Oswald, sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9aa3a6" }}>
                      {e.school} · <span style={{ color: e.color }}>{e.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section style={sectionCard}>
            <div style={eyebrow}>Get in touch</div>
            <h2 style={sectionHeading}>Contact & Links</h2>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {CONTACT_LINKS.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "transparent", border: "1px solid rgba(255,255,255,0.16)", color: "#f0f0f0", borderRadius: "9999px", padding: "9px 20px", fontFamily: "Oswald, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  {c.label}
                  {c.external && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
