import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/utils/db";
import User from "@/app/lib/models/User";
import Challenge from "@/app/lib/models/Challenge";

export async function POST(request: Request) {
  try {
    const { username, score } = await request.json();

    if (!username || username.trim() === "") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    try {
      // Get or create user - using the correct field name 'username' instead of 'userName'
      const user = await User.findOneAndUpdate(
        { username: trimmedUsername }, // Use the correct field name that matches the schema
        {
          // If score is provided and it's higher than the current score, update it
          ...(typeof score === "number"
            ? { $max: { score } }
            : { $setOnInsert: { score: 0 } }),
        },
        { upsert: true, new: true }
      );

      // Create challenge with the user's current score
      const challenge = await Challenge.create({
        inviterUsername: trimmedUsername,
        inviterScore: user.score,
      });

      return NextResponse.json({
        code: challenge.code,
        shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/challenge/${challenge.code}`,
        username: trimmedUsername,
        score: user.score,
      });
    } catch (dbError: unknown) {
      console.error("Database error:", dbError);

      // Handle duplicate key error specifically
      if (
        dbError &&
        typeof dbError === "object" &&
        "code" in dbError &&
        dbError.code === 11000
      ) {
        return NextResponse.json(
          {
            error: "Username already exists. Please try a different username.",
          },
          { status: 409 }
        );
      }

      throw dbError; // Re-throw for general error handling
    }
  } catch (error) {
    console.error("Failed to create challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge. Please try again later." },
      { status: 500 }
    );
  }
}
