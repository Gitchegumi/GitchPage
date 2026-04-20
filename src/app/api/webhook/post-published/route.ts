import { NextRequest, NextResponse } from "next/server";
import {
  getListByName,
  createCampaign,
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

    // Get the blog subscribers list
    const list = await getListByName(
      process.env.LISTMONK_BLOG_LIST_NAME || "Blog Subscribers"
    );

    if (!list) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog Subscribers list not found",
        },
        { status: 500 }
      );
    }

    // Generate email content
    const emailContent = generatePostEmailTemplate(title, excerpt, url);

    // Create campaign
    const campaign = await createCampaign(
      list.id,
      `New Post: ${title}`,
      emailContent
    );

    // Send campaign
    await sendCampaign(campaign.id);

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      message: "Campaign created and sent successfully",
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
