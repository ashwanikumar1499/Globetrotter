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
    // Parse the request body
    const body = await request.json();
    console.log("Request body:", body);

    const { username, score } = body;

    // Validate username
    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length < 3
    ) {
      console.log("Invalid username:", username);
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Normalize username and score
    const normalizedUsername = username.trim();
    const normalizedScore =
      typeof score === "number" && !isNaN(score) ? score : 0;

    console.log(
      `Processing user: ${normalizedUsername}, score: ${normalizedScore}`
    );

    // Connect to database
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connection successful");

    // Find or create user
    let user = await User.findOne({ username: normalizedUsername });

    if (user) {
      console.log(`User found: ${user.username}, current score: ${user.score}`);

      // Only update score if new score is higher
      if (normalizedScore > user.score) {
        console.log(`Updating score from ${user.score} to ${normalizedScore}`);
        user.score = normalizedScore;
        await user.save();
        console.log("Score updated successfully");
      } else {
        console.log("New score not higher, keeping existing score");
      }
    } else {
      console.log(`User not found, creating new user: ${normalizedUsername}`);
      user = new User({
        username: normalizedUsername,
        score: normalizedScore,
      });
      await user.save();
      console.log("New user created successfully");
    }

    // Return success response
    console.log("Returning success response");
    return NextResponse.json({
      success: true,
      username: user.username,
      score: user.score,
    });
  } catch (error) {
    // Log the full error
    console.error("Error in PUT /api/users:", error);

    // Return a more detailed error response
    return NextResponse.json(
      {
        error: "Failed to update user data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
