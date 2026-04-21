#!/usr/bin/env node
/**
 * Reads a newly added blog MDX file, extracts its metadata,
 * and creates + sends a Listmonk campaign to Blog Subscribers.
 *
 * Usage: node scripts/notify-new-post.mjs <path-to-mdx-file>
 *
 * Required env vars:
 *   LISTMONK_URL, LISTMONK_API_USER, LISTMONK_API_KEY
 * Optional:
 *   NEXT_PUBLIC_SITE_URL  (defaults to https://www.gitchegumi.com)
 *   LISTMONK_BLOG_LIST_ID (defaults to 3)
 */

import { readFileSync } from "fs";

const mdxPath = process.argv[2];
if (!mdxPath) {
  console.error("Usage: node scripts/notify-new-post.mjs <path-to-mdx>");
  process.exit(1);
}

const LISTMONK_URL = process.env.LISTMONK_URL || "https://monk.gitchegumi.com";
const LISTMONK_API_USER = process.env.LISTMONK_API_USER || "";
const LISTMONK_API_KEY = process.env.LISTMONK_API_KEY || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gitchegumi.com";
const TEMPLATE_ID = parseInt(process.env.LISTMONK_CAMPAIGN_TEMPLATE_ID || "2", 10);

if (!LISTMONK_API_USER || !LISTMONK_API_KEY) {
  console.error("Missing LISTMONK_API_USER or LISTMONK_API_KEY");
  process.exit(1);
}

// Extract metadata from MDX — finds the metadata object by counting braces
// to correctly handle nested objects inside the metadata block
function extractMetadata(content) {
  const start = content.search(/export\s+const\s+metadata\s*=\s*\{/);
  if (start === -1) return null;

  const braceStart = content.indexOf("{", start);
  let depth = 0;
  let end = -1;
  for (let i = braceStart; i < content.length; i++) {
    if (content[i] === "{") depth++;
    else if (content[i] === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return null;

  const block = content.slice(braceStart, end + 1);
  const get = (key) => {
    const m = block.match(new RegExp(`${key}\\s*:\\s*["'\`]([^"'\`\\n]+)["'\`]`));
    return m ? m[1] : null;
  };

  return {
    title: get("title"),
    description: get("description") || get("excerpt"),
  };
}

// Derive the public URL from the file path
// e.g. src/app/blog/tech/my-post.mdx -> /blog/tech/my-post
function deriveUrl(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  const match = normalized.match(/src\/app\/(blog\/[^/]+\/[^/]+)\.mdx$/);
  if (!match) throw new Error(`Cannot derive URL from path: ${filePath}`);
  return `${SITE_URL}/${match[1]}`;
}

async function listmonkRequest(endpoint, options = {}) {
  const url = `${LISTMONK_URL}/api${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${LISTMONK_API_USER}:${LISTMONK_API_KEY}`,
      ...options.headers,
    },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Listmonk ${response.status}: ${err.message || response.statusText}`);
  }
  return response.json();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function safeUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "#";
    return parsed.href;
  } catch {
    return "#";
  }
}

function buildEmailHtml(title, excerpt, url) {
  const safeTitle = escapeHtml(title);
  const safeExcerpt = escapeHtml(excerpt.length > 200 ? excerpt.slice(0, 200) + "..." : excerpt);
  const safePostUrl = escapeHtml(safeUrl(url));
  return `<h2 style="font-size:22px;margin-bottom:12px;">
  <a href="${safePostUrl}" style="color:#667eea;text-decoration:none;">${safeTitle}</a>
</h2>
<p style="color:#666;line-height:1.6;margin-bottom:24px;">${safeExcerpt}</p>
<p>
  <a href="${safePostUrl}"
     style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
            color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:600;">
    Read Full Post
  </a>
</p>`;
}

async function main() {
  const content = readFileSync(mdxPath, "utf-8");
  const meta = extractMetadata(content);

  if (!meta?.title) {
    console.error(`No metadata.title found in ${mdxPath} — skipping`);
    process.exit(0);
  }

  const excerpt = meta.description || "";
  const postUrl = deriveUrl(mdxPath);

  console.log(`Notifying subscribers about: "${meta.title}"`);
  console.log(`  URL: ${postUrl}`);

  const subject = `New Post: ${meta.title}`;
  const body = buildEmailHtml(meta.title, excerpt, postUrl);

  const { data: cloned } = await listmonkRequest(`/campaigns/${TEMPLATE_ID}/clone`, {
    method: "POST",
  });

  const { data: campaign } = await listmonkRequest(`/campaigns/${cloned.id}`, {
    method: "PUT",
    body: JSON.stringify({ name: subject, subject, body, content_type: "html" }),
  });

  console.log(`  Cloned campaign ID: ${campaign.id}`);

  await listmonkRequest(`/campaigns/${campaign.id}/status`, {
    method: "POST",
    body: JSON.stringify({ status: "running" }),
  });

  console.log("  Campaign sent successfully.");
}

main().catch((err) => {
  console.error("Failed to notify subscribers:", err.message);
  process.exit(1);
});
