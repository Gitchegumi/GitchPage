import { NextRequest, NextResponse } from "next/server";
import {
  cloneCampaign,
  sendCampaign,
  generatePostEmailTemplate,
} from "@/lib/listmonk";
import { z } from "zod";

const webhookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  url: z.string().url("Invalid URL"),
  publishedAt: z.string().optional(),
});

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
const CAMPAIGN_TEMPLATE_ID = parseInt(process.env.LISTMONK_CAMPAIGN_TEMPLATE_ID || "2", 10);

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!WEBHOOK_SECRET || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = webhookSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0]?.message || "Invalid request",
        },
        { status: 400 }
      );
    }

    const { title, excerpt, url } = validation.data;

    const emailContent = generatePostEmailTemplate(title, excerpt, url);
    const subject = `New Post: ${title}`;

    const campaign = await cloneCampaign(CAMPAIGN_TEMPLATE_ID, subject, subject, emailContent);
    await sendCampaign(campaign.id);

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      message: "Blog alert sent successfully",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
