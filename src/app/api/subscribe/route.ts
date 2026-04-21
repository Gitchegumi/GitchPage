import { NextRequest, NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/listmonk";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0]?.message || "Invalid request",
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    await subscribeEmail(email);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to blog updates",
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process subscription. Please try again later." },
      { status: 503 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
