/**
 * Listmonk API Client
 * Handles email subscription and campaign management for GitchPage blog
 */

const LISTMONK_URL = process.env.LISTMONK_URL || "https://monk.gitchegumi.com";
const LISTMONK_API_USER = process.env.LISTMONK_API_USER || "";
const LISTMONK_API_KEY = process.env.LISTMONK_API_KEY || "";

interface ListmonkList {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface ListmonkSubscriber {
  id: string;
  email: string;
  name: string;
  status: string;
  lists: string[];
}

interface ListmonkCampaign {
  id: string;
  name: string;
  subject: string;
  status: string;
}

interface ApiError {
  message: string;
  code?: string;
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
  const LIST_ID = 2; // Blog Subscribers list ID

  try {
    // Check if subscriber already exists
    const existingSubscribers = await listmonkRequest<{ data: ListmonkSubscriber[] }>(
      `/subscribers?query=subscribers.email='${encodeURIComponent(email)}'`
    );

    if (existingSubscribers.data.length > 0) {
      const subscriber = existingSubscribers.data[0];
      // Add to list if not already subscribed
      if (!subscriber.lists.includes(String(LIST_ID))) {
        await listmonkRequest<ListmonkSubscriber>(`/subscribers/${subscriber.id}/lists`, {
          method: "POST",
          body: JSON.stringify({
            action: "add",
            list_ids: [LIST_ID],
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
  const truncatedExcerpt =
    excerpt.length > 200 ? excerpt.substring(0, 200) + "..." : excerpt;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .post-title {
      font-size: 22px;
      margin-bottom: 15px;
    }
    .post-title a {
      color: #667eea;
      text-decoration: none;
    }
    .post-title a:hover {
      text-decoration: underline;
    }
    .excerpt {
      color: #666;
      margin-bottom: 25px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
    }
    .button:hover {
      opacity: 0.9;
    }
    .footer {
      background: #f0f0f0;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #888;
      border-radius: 0 0 8px 8px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .footer a {
      color: #667eea;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>New Post on GitchPage</h1>
  </div>
  <div class="content">
    <h2 class="post-title">
      <a href="${url}">${title}</a>
    </h2>
    <p class="excerpt">${truncatedExcerpt}</p>
    <p>
      <a href="${url}" class="button">Read Full Post</a>
    </p>
  </div>
  <div class="footer">
    <p>You received this email because you subscribed to GitchPage blog updates.</p>
    <p><a href="{{ .UnsubscribeURL }}">Unsubscribe</a></p>
    <p>&copy; ${new Date().getFullYear()} Gitchegumi Media</p>
  </div>
</body>
</html>
  `.trim();
}
