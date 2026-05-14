"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const PROJECT_TYPES = [
  { value: "", label: "Select a project type" },
  { value: "Commercial", label: "Commercial" },
  { value: "E-learning", label: "E-learning" },
  { value: "Narration", label: "Narration" },
  { value: "Audiobook", label: "Audiobook" },
  { value: "Video Game", label: "Video Game" },
  { value: "Animation", label: "Animation" },
  { value: "Podcast/Intro", label: "Podcast / Intro" },
  { value: "Other", label: "Other" },
];

const BUDGET_RANGES = [
  { value: "", label: "Select a budget range (optional)" },
  { value: "Under $250", label: "Under $250" },
  { value: "$250-$500", label: "$250 – $500" },
  { value: "$500-$1,000", label: "$500 – $1,000" },
  { value: "$1,000-$2,500", label: "$1,000 – $2,500" },
  { value: "$2,500+", label: "$2,500+" },
  { value: "Not sure yet", label: "Not sure yet" },
];

const TIMELINES = [
  { value: "", label: "Select a timeline (optional)" },
  { value: "ASAP", label: "ASAP" },
  { value: "Within 1 week", label: "Within 1 week" },
  { value: "2-4 weeks", label: "2 – 4 weeks" },
  { value: "1-2 months", label: "1 – 2 months" },
  { value: "Flexible", label: "Flexible" },
];

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
  consent?: string;
  _form?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function VoInquiryForm() {
  const loadedAtRef = useRef<number>(Date.now());
  const honeypotId = useId();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budgetRange: "",
    timeline: "",
    message: "",
    consent: false,
  });

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next: FormErrors = { ...prev };
        delete (next as Record<string, string | undefined>)[field];
        delete next._form;
        return next;
      });
    },
    []
  );

  const validate = useCallback((): FormErrors | null => {
    const e: FormErrors = {};
    if (!data.name.trim()) e.name = "Name is required.";
    if (!data.email.trim()) {
      e.email = "Email is required.";
    } else if (!isValidEmail(data.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!data.projectType) e.projectType = "Please select a project type.";
    if (!data.message.trim()) {
      e.message = "Please describe your project.";
    } else if (data.message.length > 3000) {
      e.message = "Message must be under 3,000 characters.";
    }
    if (!data.consent) e.consent = "You must agree to be contacted.";
    return Object.keys(e).length ? e : null;
  }, [data]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("submitting");

      const validation = validate();
      if (validation) {
        setErrors(validation);
        setStatus("idle");
        return;
      }

      const honeypot = (
        e.currentTarget.elements.namedItem("website") as HTMLInputElement | null
      )?.value;

      const payload = {
        ...data,
        honeypot: honeypot || undefined,
        formLoadedAt: loadedAtRef.current,
      };

      try {
        const res = await fetch("/api/vo-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setStatus("success");
          setData({
            name: "",
            email: "",
            company: "",
            projectType: "",
            budgetRange: "",
            timeline: "",
            message: "",
            consent: false,
          });
          loadedAtRef.current = Date.now();
        } else {
          const body = await res.json().catch(() => ({}));
          setErrors({ _form: body.message || "Something went wrong. Please try again." });
          setStatus("error");
        }
      } catch {
        setErrors({ _form: "Network error. Please check your connection and try again." });
        setStatus("error");
      }
    },
    [data, validate]
  );

  if (status === "success") {
    return (
      <div
        className="mx-auto w-full max-w-lg rounded-2xl p-8 text-center backdrop-blur-xl"
        style={{
          background: "rgba(44,44,44,0.45)",
          border: "1px solid rgba(175,224,206,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <h3 className="mb-2 text-2xl font-semibold text-[#f0f0f0]">Thanks — message sent!</h3>
        <p className="text-[#f0f0f0]/80">
          I&apos;ll review your inquiry and get back to you shortly.
        </p>
        <Button
          variant="outline"
          className="mt-6 border-[rgba(175,224,206,0.25)] text-[#f0f0f0] hover:bg-[rgba(255,255,255,0.08)]"
          onClick={() => {
            setStatus("idle");
            setErrors({});
          }}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <div
      className="mx-auto w-full max-w-lg rounded-2xl p-6 backdrop-blur-xl md:p-8"
      style={{
        background: "rgba(44,44,44,0.45)",
        border: "1px solid rgba(175,224,206,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <h2 className="mb-2 text-3xl font-bold text-center text-[#f0f0f0]">
        Start a Voiceover Project
      </h2>
      <p className="mb-6 text-center text-sm text-[#f0f0f0]/70">
        Tell me what you&apos;re working on and I&apos;ll get back to you with next steps and a quote.
      </p>

      {errors._form && (
        <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errors._form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            id={honeypotId}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value=""
            readOnly
            onChange={() => {}}
          />
        </div>

        <div>
          <Label htmlFor="vo-name" className="text-[#f0f0f0]">
            Name <span className="text-[#fca311]">*</span>
          </Label>
          <Input
            id="vo-name"
            name="name"
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className="mt-1 border-[rgba(204,219,220,0.35)] bg-[rgba(44,44,44,0.8)] text-[#f0f0f0] placeholder:text-[rgba(240,240,240,0.45)] focus:border-[rgba(65,102,245,0.8)] focus:ring-[rgba(65,102,245,0.8)]"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="vo-email" className="text-[#f0f0f0]">
            Email <span className="text-[#fca311]">*</span>
          </Label>
          <Input
            id="vo-email"
            name="email"
            type="email"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="mt-1 border-[rgba(204,219,220,0.35)] bg-[rgba(44,44,44,0.8)] text-[#f0f0f0] placeholder:text-[rgba(240,240,240,0.45)] focus:border-[rgba(65,102,245,0.8)] focus:ring-[rgba(65,102,245,0.8)]"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="vo-company" className="text-[#f0f0f0]">
            Company / Organization
          </Label>
          <Input
            id="vo-company"
            name="company"
            value={data.company}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="Optional"
            className="mt-1 border-[rgba(204,219,220,0.35)] bg-[rgba(44,44,44,0.8)] text-[#f0f0f0] placeholder:text-[rgba(240,240,240,0.45)] focus:border-[rgba(65,102,245,0.8)] focus:ring-[rgba(65,102,245,0.8)]"
          />
        </div>

        <Select
          label="Project Type"
          name="projectType"
          value={data.projectType}
          onChange={(e) => updateField("projectType", e.target.value)}
          required
          error={errors.projectType}
        >
          {PROJECT_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select
          label="Budget Range"
          name="budgetRange"
          value={data.budgetRange}
          onChange={(e) => updateField("budgetRange", e.target.value)}
        >
          {BUDGET_RANGES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select
          label="Timeline"
          name="timeline"
          value={data.timeline}
          onChange={(e) => updateField("timeline", e.target.value)}
        >
          {TIMELINES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <div>
          <Label htmlFor="vo-message" className="text-[#f0f0f0]">
            Project Details <span className="text-[#fca311]">*</span>
          </Label>
          <Textarea
            id="vo-message"
            name="message"
            value={data.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Describe your project, audience, tone, and anything else that helps..."
            rows={5}
            maxLength={3000}
            aria-invalid={!!errors.message}
            className="mt-1 border-[rgba(204,219,220,0.35)] bg-[rgba(44,44,44,0.8)] text-[#f0f0f0] placeholder:text-[rgba(240,240,240,0.45)] focus:border-[rgba(65,102,245,0.8)] focus:ring-[rgba(65,102,245,0.8)]"
          />
          <div className="mt-1 flex justify-between">
            {errors.message ? (
              <p className="text-xs text-red-400">{errors.message}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-[rgba(240,240,240,0.45)]">
              {data.message.length}/3000
            </span>
          </div>
        </div>

        <Checkbox
          name="consent"
          checked={data.consent}
          onChange={(e) => updateField("consent", e.target.checked)}
          label={
            <>
              I agree to be contacted about this project{" "}
              <span className="text-[#fca311]">*</span>
            </>
          }
          error={errors.consent}
        />

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="mt-2 w-full bg-[#fca311] text-[#2c2c2c] font-semibold hover:bg-[#fca311]/90 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send Voiceover Inquiry"}
        </Button>
      </form>
    </div>
  );
}
