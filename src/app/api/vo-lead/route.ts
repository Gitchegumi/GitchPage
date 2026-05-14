import { NextRequest, NextResponse } from "next/server";

/* -------------------------------------------------------------------------- */
/*  Simple in-memory rate limiter                                             */
/*  NOTE: This is process-local. For multi-instance deployments use Redis.    */
/* -------------------------------------------------------------------------- */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}

function hashIP(ip: string): string {
  // Simple non-cryptographic hash for metadata privacy
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = (h << 5) - h + ip.charCodeAt(i);
    h |= 0;
  }
  return `ip-${Math.abs(h).toString(16)}`;
}

function isRateLimited(ip: string): boolean {
  const max = parseInt(
    process.env.VO_FORM_RATE_LIMIT_MAX || "5", 10);
  const windowSeconds = parseInt(
    process.env.VO_FORM_RATE_LIMIT_WINDOW_SECONDS || "3600", 10);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (now - entry.windowStart > windowSeconds * 1000) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > max;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 limit

function isValidEmail(email: string): boolean {
  if (email.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_REGEX.test(email);
}

/* -------------------------------------------------------------------------- */
/*  POST handler                                                              */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const ip = getClientIP(req);

  // Rate limit check
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  // Honeypot: if filled, return generic success but do nothing
  const honeypot = typeof body.honeypot === "string" ? body.honeypot : "";
  if (honeypot.trim().length > 0) {
    return NextResponse.json(
      { message: "Thanks — your inquiry has been received." },
      { status: 200 }
    );
  }

  // Anti-bot timing check
  const loadedAt =
    typeof body.formLoadedAt === "number"
      ? body.formLoadedAt
      : Number.NaN;
  if (!Number.isFinite(loadedAt) || Date.now() - loadedAt < 2000) {
    return NextResponse.json(
      { message: "Request could not be processed. Please try again." },
      { status: 400 }
    );
  }

  // Field validation
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company =
    typeof body.company === "string" ? body.company.trim() : "";
  const projectType =
    typeof body.projectType === "string" ? body.projectType.trim() : "";
  const budgetRange =
    typeof body.budgetRange === "string" ? body.budgetRange.trim() : "";
  const timeline =
    typeof body.timeline === "string" ? body.timeline.trim() : "";
  const message =
    typeof body.message === "string" ? body.message.trim() : "";
  const consent = body.consent === true;

  const errors: string[] = [];
  if (!name) errors.push("Name is required.");
  if (!email) {
    errors.push("Email is required.");
  } else if (!isValidEmail(email)) {
    errors.push("Please provide a valid email address.");
  }
  if (!projectType) errors.push("Project type is required.");
  if (!message) {
    errors.push("Project details are required.");
  } else if (message.length > 3000) {
    errors.push("Project details must be under 3,000 characters.");
  }
  if (!consent) errors.push("Consent is required.");

  if (errors.length > 0) {
    return NextResponse.json(
      { message: errors.join(" ") },
      { status: 400 }
    );
  }

  // Normalize payload for Twenty CRM webhook
  const payload = {
    source: "vo-inquiry-form",
    name,
    email,
    company: company || undefined,
    projectType,
    budgetRange: budgetRange || undefined,
    timeline: timeline || undefined,
    message,
    consent,
    submittedAt: new Date().toISOString(),
    metadata: {
      ipHash: hashIP(ip),
      userAgent: req.headers.get("user-agent") || undefined,
    },
  };

  // Forward to Twenty webhook if configured
  const webhookUrl = process.env.TWENTY_VO_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!webhookRes.ok) {
        console.warn(
          `Twenty webhook returned ${webhookRes.status}: ${await webhookRes.text()}`
        );
      }
    } catch (err) {
      console.warn("Failed to forward to Twenty webhook:", err);
    }
  } else {
    console.info("TWENTY_VO_WEBHOOK_URL not set. Skipping webhook forward.");
  }

  return NextResponse.json(
    { message: "Thanks — your inquiry has been received." },
    { status: 200 }
  );
}
