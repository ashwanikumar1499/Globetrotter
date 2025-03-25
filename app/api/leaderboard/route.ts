import User from "@/app/lib/models/User";
import { connectDB } from "@/app/lib/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    await connectDB();

    // Calculate pagination values
    const skip = (page - 1) * limit;
    const total = await User.countDocuments();
    const pages = Math.ceil(total / limit);

    // Get users sorted by score (descending)
    const users = await User.find()
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
