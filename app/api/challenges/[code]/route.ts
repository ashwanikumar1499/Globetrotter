import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/utils/db";
import Challenge from "@/app/lib/models/Challenge";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    // Access the code directly from the params object
    // This is the correct way to access dynamic route parameters in Next.js App Router
    const code = params.code;

    // Validate the code parameter
    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Invalid challenge code" },
        { status: 400 }
      );
    }

    await connectDB();

    const challenge = await Challenge.findOne({
      code: code,
      expiresAt: { $gt: new Date() },
    });

    if (!challenge) {
      return NextResponse.json(
        { valid: false, message: "Challenge not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      inviterUsername: challenge.inviterUsername,
      inviterScore: challenge.inviterScore,
      valid: true,
    });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}
