"use client";

import { useState } from "react";
import { MagicCard } from "@/components/magicui/magic-card";

type Tier = "blog" | "all";

const TIERS: {
  id: Tier;
  label: string;
  description: string;
}[] = [
  {
    id: "blog",
    label: "Blog only",
    description: "New posts, nothing else.",
  },
  {
    id: "all",
    label: "Tell me everything",
    description: "Posts, shop launches, and announcements.",
  },
];

export function TieredSubscribeForm() {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<Tier | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isSubmittable =
    tier !== null && email.trim().length > 0 && status !== "loading" && status !== "success";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tier) return;
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_N8N_SUBSCRIBE_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier, honeypot }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : { success: true };

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "You're in! Check your inbox for a confirmation.");
        setEmail("");
        setTier(null);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="absolute bottom-4 right-6 flex flex-col items-end gap-2">
      {/* Expanded form — floats above the pill */}
      {expanded && (
        <MagicCard
          className="rounded-2xl w-72"
          gradientFrom="#4166f5"
          gradientTo="#afe0ce"
          gradientColor="rgba(65,102,245,0.08)"
          gradientSize={250}
          gradientOpacity={1}
        >
          <div
            className="rounded-2xl px-5 py-5 space-y-4 backdrop-blur-md"
            style={{
              background: "rgba(30,30,30,0.95)",
              border: "1px solid rgba(175,224,206,0.15)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-base" style={{ color: "#f0f0f0" }}>
                  Stay in the loop
                </h3>
                <p className="text-xs mt-1" style={{ color: "#afe0ce" }}>
                  Choose what you&apos;d like to hear about:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="ml-3 mt-0.5 text-xs opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: "#f0f0f0" }}
                aria-label="Close subscribe form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Honeypot — hidden from real users, bots fill it in */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: "none" }}
              />

              {/* Tier selection */}
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Subscription type">
                {TIERS.map((t) => {
                  const selected = tier === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTier(t.id)}
                      disabled={status === "success"}
                      aria-pressed={selected}
                      className="rounded-lg px-3 py-2.5 text-left transition-all disabled:opacity-50"
                      style={{
                        background: selected
                          ? "rgba(65,102,245,0.18)"
                          : "rgba(255,255,255,0.04)",
                        border: selected
                          ? "1px solid rgba(65,102,245,0.7)"
                          : "1px solid rgba(204,219,220,0.2)",
                        boxShadow: selected
                          ? "0 0 0 1px rgba(65,102,245,0.3)"
                          : "none",
                      }}
                    >
                      <span
                        className="block text-xs font-semibold"
                        style={{ color: selected ? "#a0b4ff" : "#f0f0f0" }}
                      >
                        {t.label}
                      </span>
                      <span
                        className="block text-xs mt-0.5 leading-snug"
                        style={{ color: "#afe0ce" }}
                      >
                        {t.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Email input */}
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                required
                aria-label="Email address"
                className="w-full rounded-lg px-3 h-9 text-sm outline-none transition-colors disabled:opacity-50"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(204,219,220,0.25)",
                  color: "#f0f0f0",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(65,102,245,0.7)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(204,219,220,0.25)")}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={!isSubmittable}
                className="w-full h-9 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-40"
                style={{ background: "#fca311", color: "#2c2c2c" }}
                onMouseEnter={(e) => {
                  if (isSubmittable) e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {status === "loading"
                  ? "Subscribing…"
                  : status === "success"
                    ? "Subscribed!"
                    : "Subscribe"}
              </button>

              {message && (
                <p
                  className="text-xs text-center"
                  style={{ color: status === "success" ? "#afe0ce" : "#fca311" }}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </MagicCard>
      )}

      {/* Collapsed pill — always visible when form is closed */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            background: "rgba(30,30,30,0.92)",
            border: "1px solid rgba(175,224,206,0.35)",
            color: status === "success" ? "#afe0ce" : "#f0f0f0",
            backdropFilter: "blur(8px)",
          }}
          aria-label={status === "success" ? "Subscribed" : "Open subscribe form"}
        >
          <span aria-hidden="true">{status === "success" ? "✓" : "✉"}</span>
          <span>{status === "success" ? "Subscribed!" : "Subscribe"}</span>
        </button>
      )}
    </div>
  );
}
