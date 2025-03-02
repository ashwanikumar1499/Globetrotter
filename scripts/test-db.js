// Test MongoDB connection
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

console.log(
  `Attempting to connect to MongoDB at ${MONGODB_URI.replace(
    /\/\/([^:]+):([^@]+)@/,
    "//***:***@"
  )}`
);

mongoose
  .connect(MONGODB_URI, {
    bufferCommands: false,
  })
  .then(() => {
    console.log("MongoDB connection successful!");

    // Create a simple test schema and model
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now },
    });

    const Test = mongoose.models.Test || mongoose.model("Test", TestSchema);

    // Try to create a document
    return Test.create({ name: "Test " + Date.now() })
      .then((doc) => {
        console.log("Successfully created test document:", doc);
        return Test.findById(doc._id);
      })
      .then((doc) => {
        console.log("Successfully retrieved test document:", doc);
        return mongoose.connection.close();
      });
  })
  .then(() => {
    console.log("Connection closed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
