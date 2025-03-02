const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// Load environment variables
dotenv.config({ path: ".env.local" });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define Destination schema
const DestinationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  country: {
    type: String,
    required: true,
  },
  clues: {
    type: [String],
    validate: [arrayLimit, "Must have at least 2 clues"],
    required: true,
  },
  fun_fact: {
    type: [String],
    validate: [arrayLimit, "Must have at least 2 facts"],
    required: true,
  },
  trivia: {
    type: [String],
    validate: [arrayLimit, "Must have at least 2 trivia items"],
    required: true,
  },
});

function arrayLimit(arr) {
  return arr.length >= 2;
}

// Create model
const Destination =
  mongoose.models.Destination ||
  mongoose.model("Destination", DestinationSchema);

// Comprehensive list of 120 famous cities around the world
const cities = [
  // Europe
  { city: "Paris", country: "France" },
  { city: "London", country: "UK" },
  { city: "Rome", country: "Italy" },
  { city: "Barcelona", country: "Spain" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Berlin", country: "Germany" },
  { city: "Prague", country: "Czech Republic" },
  { city: "Vienna", country: "Austria" },
  { city: "Athens", country: "Greece" },
  { city: "Venice", country: "Italy" },
  { city: "Florence", country: "Italy" },
  { city: "Madrid", country: "Spain" },
  { city: "Dublin", country: "Ireland" },
  { city: "Budapest", country: "Hungary" },
  { city: "Lisbon", country: "Portugal" },
  { city: "Copenhagen", country: "Denmark" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Munich", country: "Germany" },
  { city: "Zurich", country: "Switzerland" },
  { city: "Brussels", country: "Belgium" },
  { city: "Oslo", country: "Norway" },
  { city: "Helsinki", country: "Finland" },
  { city: "Krakow", country: "Poland" },
  { city: "Edinburgh", country: "UK" },

  // North America
  { city: "New York", country: "USA" },
  { city: "Los Angeles", country: "USA" },
  { city: "Chicago", country: "USA" },
  { city: "San Francisco", country: "USA" },
  { city: "Las Vegas", country: "USA" },
  { city: "Miami", country: "USA" },
  { city: "Toronto", country: "Canada" },
  { city: "Vancouver", country: "Canada" },
  { city: "Montreal", country: "Canada" },
  { city: "Mexico City", country: "Mexico" },
  { city: "Havana", country: "Cuba" },
  { city: "Boston", country: "USA" },
  { city: "Washington DC", country: "USA" },
  { city: "Seattle", country: "USA" },
  { city: "New Orleans", country: "USA" },

  // Asia
  { city: "Tokyo", country: "Japan" },
  { city: "Kyoto", country: "Japan" },
  { city: "Beijing", country: "China" },
  { city: "Shanghai", country: "China" },
  { city: "Hong Kong", country: "China" },
  { city: "Singapore", country: "Singapore" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Seoul", country: "South Korea" },
  { city: "Dubai", country: "UAE" },
  { city: "Mumbai", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Jaipur", country: "India" },
  { city: "Hanoi", country: "Vietnam" },
  { city: "Ho Chi Minh City", country: "Vietnam" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "Bali", country: "Indonesia" },
  { city: "Jerusalem", country: "Israel" },
  { city: "Taipei", country: "Taiwan" },
  { city: "Manila", country: "Philippines" },
  { city: "Kathmandu", country: "Nepal" },

  // Africa
  { city: "Cairo", country: "Egypt" },
  { city: "Marrakech", country: "Morocco" },
  { city: "Cape Town", country: "South Africa" },
  { city: "Johannesburg", country: "South Africa" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Casablanca", country: "Morocco" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Tunis", country: "Tunisia" },
  { city: "Addis Ababa", country: "Ethiopia" },
  { city: "Zanzibar City", country: "Tanzania" },

  // South America
  { city: "Rio de Janeiro", country: "Brazil" },
  { city: "Buenos Aires", country: "Argentina" },
  { city: "Lima", country: "Peru" },
  { city: "Santiago", country: "Chile" },
  { city: "Bogota", country: "Colombia" },
  { city: "Cusco", country: "Peru" },
  { city: "Sao Paulo", country: "Brazil" },
  { city: "Cartagena", country: "Colombia" },
  { city: "Quito", country: "Ecuador" },
  { city: "La Paz", country: "Bolivia" },

  // Oceania
  { city: "Sydney", country: "Australia" },
  { city: "Melbourne", country: "Australia" },
  { city: "Auckland", country: "New Zealand" },
  { city: "Wellington", country: "New Zealand" },
  { city: "Brisbane", country: "Australia" },
  { city: "Perth", country: "Australia" },
  { city: "Gold Coast", country: "Australia" },
  { city: "Queenstown", country: "New Zealand" },
  { city: "Christchurch", country: "New Zealand" },
  { city: "Fiji", country: "Fiji" },

  // Middle East
  { city: "Abu Dhabi", country: "UAE" },
  { city: "Doha", country: "Qatar" },
  { city: "Muscat", country: "Oman" },
  { city: "Amman", country: "Jordan" },
  { city: "Beirut", country: "Lebanon" },
  { city: "Tehran", country: "Iran" },
  { city: "Riyadh", country: "Saudi Arabia" },

  // Caribbean
  { city: "San Juan", country: "Puerto Rico" },
  { city: "Nassau", country: "Bahamas" },
  { city: "Kingston", country: "Jamaica" },
  { city: "Bridgetown", country: "Barbados" },

  // Central America
  { city: "Panama City", country: "Panama" },
  { city: "San Jose", country: "Costa Rica" },
  { city: "Belize City", country: "Belize" },
  { city: "Guatemala City", country: "Guatemala" },

  // Eastern Europe
  { city: "Moscow", country: "Russia" },
  { city: "St. Petersburg", country: "Russia" },
  { city: "Kiev", country: "Ukraine" },
  { city: "Warsaw", country: "Poland" },
  { city: "Bucharest", country: "Romania" },
  { city: "Sofia", country: "Bulgaria" },
  { city: "Belgrade", country: "Serbia" },
  { city: "Zagreb", country: "Croatia" },
  { city: "Tallinn", country: "Estonia" },
  { city: "Riga", country: "Latvia" },
  { city: "Vilnius", country: "Lithuania" },
];

// Function to generate clues, facts, and trivia using Google Gemini
async function generateCityData(city, country) {
  const prompt = `
    Generate data for a geography guessing game about ${city}, ${country}.
    Format your response as a JSON object with these fields:
    1. clues: An array of 5 clues about the city (without mentioning the city name directly)
    2. fun_fact: An array of 3 interesting facts about the city
    3. trivia: An array of 3 trivia items about the city that are less known
    
    Make the clues progressively more revealing, but never mention the city name directly.
    Each clue, fact, and trivia item should be a complete sentence.
    
    Example format:
    {
      "clues": [
        "This city is home to a famous tower that sparkles every night.",
        "Known as the 'City of Love' and a hub for fashion and art.",
        "This city has a famous cathedral with gargoyles overlooking the city.",
        "A river divides this city into Left and Right Banks.",
        "This city hosted the 1900 and 1924 Summer Olympics."
      ],
      "fun_fact": [
        "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
        "This city has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules.",
        "The Louvre Museum in this city would take you 100 days to see every piece of art if you spent just 30 seconds on each piece."
      ],
      "trivia": [
        "This city is famous for its croissants and macarons. Bon appétit!",
        "This city was originally a Roman city called Lutetia.",
        "There is a full-size replica of the Statue of Liberty's torch on a bridge in this city."
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from the response");
    }

    const data = JSON.parse(jsonMatch[0]);
    return {
      city,
      country,
      clues: data.clues,
      fun_fact: data.fun_fact,
      trivia: data.trivia,
    };
  } catch (error) {
    console.error(`Error generating data for ${city}:`, error);
    // Fallback data if API fails
    return {
      city,
      country,
      clues: [
        `This city is in ${country}.`,
        `This city is a major tourist destination.`,
        `This city has famous landmarks.`,
        `This city has a rich cultural history.`,
        `This city is known for its unique architecture.`,
      ],
      fun_fact: [
        `${city} is a popular destination for tourists.`,
        `${city} has a rich history dating back centuries.`,
        `${city} is known for its unique cultural attractions.`,
      ],
      trivia: [
        `${city} has an interesting geographical location.`,
        `${city} has a unique climate pattern.`,
        `${city} has some lesser-known historical facts.`,
      ],
    };
  }
}

// Save data to a backup JSON file
async function saveToJsonFile(data) {
  const backupDir = path.join(process.cwd(), "data");
  const backupFile = path.join(backupDir, "destinations.json");

  // Create directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Read existing data if file exists
  let existingData = [];
  if (fs.existsSync(backupFile)) {
    const fileContent = fs.readFileSync(backupFile, "utf8");
    existingData = JSON.parse(fileContent);
  }

  // Add new data
  existingData.push(data);

  // Write to file
  fs.writeFileSync(backupFile, JSON.stringify(existingData, null, 2));
  console.log(`Backed up data for ${data.city} to ${backupFile}`);
}

// Main function to generate and save data
async function generateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB");
    console.log(`Preparing to generate data for ${cities.length} cities...`);

    // Check if there's already data
    const count = await Destination.countDocuments();
    console.log(`Current database has ${count} destinations.`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Generate and save data for each city
    for (const cityData of cities) {
      try {
        // Check if city already exists
        const existing = await Destination.findOne({ city: cityData.city });
        if (existing) {
          console.log(
            `${cityData.city} already exists in the database, skipping...`
          );
          skipCount++;
          continue;
        }

        console.log(
          `Generating data for ${cityData.city}, ${cityData.country}...`
        );
        const data = await generateCityData(cityData.city, cityData.country);

        // Save to MongoDB
        await Destination.create(data);
        console.log(`✅ Saved ${cityData.city} to database`);

        // Backup to JSON file
        await saveToJsonFile(data);

        successCount++;

        // Wait a bit to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (cityError) {
        console.error(`Error processing ${cityData.city}:`, cityError);
        errorCount++;
      }
    }

    console.log("\n=== Data Generation Summary ===");
    console.log(`Total cities processed: ${cities.length}`);
    console.log(`Successfully added: ${successCount}`);
    console.log(`Skipped (already exist): ${skipCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(
      `Total destinations in database: ${await Destination.countDocuments()}`
    );
    console.log("Data generation complete!");
  } catch (error) {
    console.error("Error generating data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
generateData();
