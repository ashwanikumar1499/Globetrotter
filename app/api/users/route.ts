import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/utils/db";
import User from "@/app/lib/models/User";

// GET /api/users?username=username
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 200 }
      );
    }

    // Return user data
    return NextResponse.json({
      exists: true,
      username: user.username,
      score: user.score || 0,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, score = 0 } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Create a new user
    const newUser = new User({
      username,
      score,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      username: newUser.username,
      score: newUser.score,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT /api/users
export async function PUT(request: NextRequest) {
  console.log("PUT /api/users - Request received");

  try {
    const { username, score, forceUpdate } = await request.json();

    // Validation logic...

    await connectDB();

    // If forceUpdate is true, use $set instead of $max
    const updateOperation = forceUpdate
      ? { $set: { score } }
      : { $max: { score } };

    const user = await User.findOneAndUpdate({ username }, updateOperation, {
      upsert: true,
      new: true,
    });

    return NextResponse.json(user);
  } catch (error) {
    // Error handling...
  }
}
