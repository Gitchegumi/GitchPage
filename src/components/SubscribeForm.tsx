"use client";

import { useState } from "react";
import { MagicCard } from "@/components/magicui/magic-card";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_N8N_SUBSCRIBE_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : { success: true };

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again later.");
      console.error("Subscribe error:", error);
    }
  };

  return (
    <MagicCard
      className="rounded-2xl"
      gradientFrom="#4166f5"
      gradientTo="#afe0ce"
      gradientColor="rgba(65,102,245,0.08)"
      gradientSize={250}
      gradientOpacity={1}
    >
      <div
        className="rounded-2xl px-5 py-5 space-y-4 backdrop-blur-md"
        style={{
          background: "rgba(44,44,44,0.45)",
          border: "1px solid rgba(175,224,206,0.15)",
        }}
      >
        <div>
          <h3 className="font-semibold text-base" style={{ color: "#f0f0f0" }}>
            Stay Updated
          </h3>
          <p className="text-xs mt-1" style={{ color: "#afe0ce" }}>
            Get notified when new posts are published
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
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
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            required
            className="w-full rounded-lg px-3 h-9 text-sm outline-none transition-colors disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(204,219,220,0.25)",
              color: "#f0f0f0",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(65,102,245,0.7)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(204,219,220,0.25)")}
          />

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full h-9 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-60"
            style={{ background: "#fca311", color: "#2c2c2c" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {status === "loading" ? "Subscribing…" : status === "success" ? "Subscribed!" : "Subscribe"}
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
  );
}
