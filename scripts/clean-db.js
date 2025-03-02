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

    const usersCollection = mongoose.connection.db.collection("users");

    // Step 1: Find and display all documents
    const allUsers = await usersCollection.find({}).toArray();
    console.log("All users in the collection:", allUsers);

    // Step 2: Remove documents with null userName or username
    try {
      console.log("Removing documents with null username values...");
      const result = await usersCollection.deleteMany({
        $or: [{ userName: null }, { username: null }],
      });
      console.log(
        `Deleted ${result.deletedCount} documents with null username values`
      );
    } catch (error) {
      console.error("Error deleting documents:", error.message);
    }

    // Step 3: Drop the existing incorrect index if it exists
    try {
      console.log("Dropping the existing userName index...");
      await usersCollection.dropIndex("userName_1");
      console.log("Successfully dropped the userName index");
    } catch (error) {
      console.error("Error dropping index:", error.message);
    }

    // Step 4: Create a new index on the correct field
    try {
      console.log("Creating a new index on username field...");
      await usersCollection.createIndex(
        { username: 1 },
        { unique: true, background: true }
      );
      console.log("Successfully created new index on username");
    } catch (error) {
      console.error("Error creating new index:", error.message);
    }

    // Step 5: Update existing documents to move data from userName to username
    try {
      console.log("Updating existing documents...");
      const result = await usersCollection.updateMany(
        { userName: { $exists: true }, username: { $exists: false } },
        [{ $set: { username: "$userName" } }]
      );
      console.log(`Updated ${result.modifiedCount} documents`);
    } catch (error) {
      console.error("Error updating documents:", error.message);
    }

    // Check the final state
    const finalUsers = await usersCollection.find({}).toArray();
    console.log("Final users in the collection:", finalUsers);

    const updatedIndexes = await usersCollection.indexes();
    console.log(
      "Updated indexes on users collection:",
      JSON.stringify(updatedIndexes, null, 2)
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
