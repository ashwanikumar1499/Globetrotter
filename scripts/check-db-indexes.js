require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

console.log(
  `Connecting to MongoDB at ${MONGODB_URI.replace(
    /\/\/([^:]+):([^@]+)@/,
    "//***:***@"
  )}`
);

mongoose
  .connect(MONGODB_URI, {
    bufferCommands: false,
  })
  .then(async () => {
    console.log("MongoDB connection successful!");

    // Get all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections in database:",
      collections.map((c) => c.name)
    );

    // Check indexes on the users collection
    const userIndexes = await mongoose.connection.db
      .collection("users")
      .indexes();
    console.log(
      "Indexes on users collection:",
      JSON.stringify(userIndexes, null, 2)
    );

    return mongoose.connection.close();
  })
  .then(() => {
    console.log("Connection closed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
