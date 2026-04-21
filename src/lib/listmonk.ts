/**
 * Listmonk API Client
 * Handles email subscription and campaign management for GitchPage blog
 */

const LISTMONK_URL = process.env.LISTMONK_URL || "https://monk.gitchegumi.com";
const LISTMONK_API_USER = process.env.LISTMONK_API_USER || "";
const LISTMONK_API_KEY = process.env.LISTMONK_API_KEY || "";
const LISTMONK_BLOG_LIST_ID = parseInt(process.env.LISTMONK_BLOG_LIST_ID || "3", 10);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function safeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("Invalid URL scheme");
    }
    return parsed.href;
  } catch {
    return "#";
  }
}

interface ListmonkList {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface ListmonkSubscriber {
  id: number;
  email: string;
  name: string;
  status: string;
  lists: Array<{ id: number; name: string; subscription_status: string }>;
}

interface ListmonkCampaign {
  id: string;
  name: string;
  subject: string;
  status: string;
}


/**
 * Make authenticated request to Listmonk API
 */
async function listmonkRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${LISTMONK_URL}/api${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `token ${LISTMONK_API_USER}:${LISTMONK_API_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Listmonk API error: ${response.status} ${response.statusText} - ${errorData.message || "Unknown error"}`
    );
  }

  return response.json();
}

/**
 * Get list by ID
 */
export async function getListById(listId: number): Promise<ListmonkList | null> {
  try {
    const data = await listmonkRequest<{ data: ListmonkList }>(`/lists/${listId}`);
    return data.data;
  } catch (error) {
    console.error("Failed to get list by ID:", error);
    return null;
  }
}

/**
 * Subscribe an email to the blog subscribers list
 */
export async function subscribeEmail(email: string): Promise<ListmonkSubscriber> {
  const LIST_ID = LISTMONK_BLOG_LIST_ID;

  try {
    // Check if subscriber already exists
    const existingSubscribers = await listmonkRequest<{ data: { results: ListmonkSubscriber[] } }>(
      `/subscribers?query=${encodeURIComponent(`subscribers.email='${email}'`)}`
    );

    const results = existingSubscribers.data?.results ?? [];
    if (results.length > 0) {
      const subscriber = results[0];
      const alreadyOnList = subscriber.lists.some((l) => l.id === LIST_ID);
      if (!alreadyOnList) {
        await listmonkRequest<void>("/subscribers/lists", {
          method: "PUT",
          body: JSON.stringify({
            ids: [subscriber.id],
            action: "add",
            target_list_ids: [LIST_ID],
            status: "confirmed",
          }),
        });
      }
      return subscriber;
    }

    // Create new subscriber
    const data = await listmonkRequest<{ data: ListmonkSubscriber }>("/subscribers", {
      method: "POST",
      body: JSON.stringify({
        email,
        name: "",
        status: "enabled",
        lists: [LIST_ID],
        preconfirm_subscriptions: true,
      }),
    });

    return data.data;
  } catch (error) {
    console.error("Failed to subscribe email:", error);
    throw error;
  }
}

/**
 * Get campaign by ID
 */
export async function getCampaign(campaignId: string): Promise<ListmonkCampaign | null> {
  try {
    const data = await listmonkRequest<{ data: ListmonkCampaign }>(`/campaigns/${campaignId}`);
    return data.data;
  } catch (error) {
    console.error("Failed to get campaign:", error);
    return null;
  }
}

/**
 * Update campaign content and subject
 */
export async function updateCampaign(
  campaignId: string,
  subject: string,
  content: string
): Promise<ListmonkCampaign> {
  try {
    const data = await listmonkRequest<{ data: ListmonkCampaign }>(`/campaigns/${campaignId}`, {
      method: "PUT",
      body: JSON.stringify({
        subject,
        body: content,
      }),
    });

    return data.data;
  } catch (error) {
    console.error("Failed to update campaign:", error);
    throw error;
  }
}

/**
 * Clone a template campaign then update its subject and body
 */
export async function cloneCampaign(
  templateId: number,
  name: string,
  subject: string,
  body: string
): Promise<ListmonkCampaign> {
  const cloned = await listmonkRequest<{ data: ListmonkCampaign }>(
    `/campaigns/${templateId}/clone`,
    { method: "POST" }
  );
  const id = cloned.data.id;
  const updated = await listmonkRequest<{ data: ListmonkCampaign }>(`/campaigns/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, subject, body, content_type: "html" }),
  });
  return updated.data;
}

/**
 * Send a campaign
 */
export async function sendCampaign(campaignId: string): Promise<ListmonkCampaign> {
  try {
    const data = await listmonkRequest<{ data: ListmonkCampaign }>(
      `/campaigns/${campaignId}/status`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "running",
        }),
      }
    );

    return data.data;
  } catch (error) {
    console.error("Failed to send campaign:", error);
    throw error;
  }
}

/**
 * Generate email template for new blog post
 */
export function generatePostEmailTemplate(
  title: string,
  excerpt: string,
  url: string
): string {
  const safeTitle = escapeHtml(title);
  const safeExcerpt = escapeHtml(
    excerpt.length > 200 ? excerpt.substring(0, 200) + "..." : excerpt
  );
  const safePostUrl = escapeHtml(safeUrl(url));

  return `
<h2 style="font-size:22px;margin-bottom:12px;">
  <a href="${safePostUrl}" style="color:#667eea;text-decoration:none;">${safeTitle}</a>
</h2>
<p style="color:#666;line-height:1.6;margin-bottom:24px;">${safeExcerpt}</p>
<p>
  <a href="${safePostUrl}"
     style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
            color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:600;">
    Read Full Post
  </a>
</p>
  `.trim();
}
