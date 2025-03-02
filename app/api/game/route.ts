import Destination from "@/app/lib/models/Destination";
import { connectDB } from "@/app/lib/utils/db";
import { NextResponse } from "next/server";
import { shuffle } from "@/app/lib/utils/shuffle";

export async function GET() {
  try {
    await connectDB();

    // Check if there are any destinations in the database
    const count = await Destination.countDocuments();

    if (count === 0) {
      return NextResponse.json(
        {
          error:
            "No destinations found in database. Please run the data generation script first.",
        },
        { status: 404 }
      );
    }

    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);

    // Check if destination exists
    if (!destination) {
      return NextResponse.json(
        { error: "No destinations found in database" },
        { status: 404 }
      );
    }

    // Get 3 other random cities
    const otherCities = await Destination.aggregate([
      { $match: { _id: { $ne: destination._id } } },
      { $sample: { size: 3 } },
      { $project: { city: 1 } },
    ]);

    // Create options array with correct city and 3 random cities
    const options = shuffle([
      destination.city,
      ...otherCities.map((city) => city.city),
    ]);

    // Get 3 random clues
    const clues = shuffle([...destination.clues]).slice(0, 3);

    return NextResponse.json({
      clues,
      options,
      correctCountry: destination.country,
    });
  } catch (error) {
    console.error("Error generating question:", error);

    // More detailed error message
    const errorMessage =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to generate question", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { city, country } = await request.json();
    await connectDB();

    const destination = await Destination.findOne({ city });

    // Check if destination exists
    if (!destination) {
      return NextResponse.json(
        { correct: false, fact: "City not found in our database." },
        { status: 404 }
      );
    }

    const correct = destination.country === country;

    return NextResponse.json({
      correct,
      fact: correct ? destination.fun_fact[0] : destination.trivia[0],
    });
  } catch (error) {
    console.error("Error validating guess:", error);

    // More detailed error message
    const errorMessage =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to validate guess", details: errorMessage },
      { status: 500 }
    );
  }
}
