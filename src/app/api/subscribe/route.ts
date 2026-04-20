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

    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          {
            success: true,
            message: "Email already subscribed",
          },
          { status: 200 }
        );
      }

      if (error.message.includes("Listmonk API error")) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to process subscription. Please try again later.",
          },
          { status: 503 }
        );
      }
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
