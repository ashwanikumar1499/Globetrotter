import User from "@/app/lib/models/User";
import { connectDB } from "@/app/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit)
      .select("username score -_id");

    const totalUser = await User.countDocuments();

    return NextResponse.json({
      users,
      pagination: {
        total: totalUser,
        page,
        limit,
        pages: Math.ceil(totalUser / limit),
      },
    });
  } catch (error) {
    {
      console.error("Error fetching leaderboard:", error);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }
  }
}
