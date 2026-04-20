import { NextRequest, NextResponse } from "next/server";
import {
  getCampaign,
  updateCampaign,
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

// Pre-configured campaign for blog alerts
const BLOG_CAMPAIGN_ID = "98aad89d-6ee8-46eb-bbc1-7f609ee48e0b";

export async function POST(request: NextRequest) {
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

    // Verify campaign exists
    const campaign = await getCampaign(BLOG_CAMPAIGN_ID);

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog campaign not found",
        },
        { status: 500 }
      );
    }

    // Generate email content
    const emailContent = generatePostEmailTemplate(title, excerpt, url);

    // Update campaign with new post content
    await updateCampaign(
      BLOG_CAMPAIGN_ID,
      `New Post: ${title}`,
      emailContent
    );

    // Send campaign
    await sendCampaign(BLOG_CAMPAIGN_ID);

    return NextResponse.json({
      success: true,
      campaignId: BLOG_CAMPAIGN_ID,
      message: "Blog alert sent successfully",
    });
  } catch (error) {
    console.error("Webhook error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
