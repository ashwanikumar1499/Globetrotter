import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// Define the mongoose connection cache type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Create a type-safe reference to the global cache
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;

// Initialize the cache if it doesn't exist
if (!globalAny.mongooseCache) {
  globalAny.mongooseCache = {
    conn: null,
    promise: null,
  };
}

// Use a type-safe reference to the cache
const cached = globalAny.mongooseCache as MongooseCache;

export const connectDB = async () => {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log(
      `Connecting to MongoDB at ${MONGODB_URI.replace(
        /\/\/([^:]+):([^@]+)@/,
        "//***:***@"
      )}`
    );

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("New MongoDB connection established");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        cached.promise = null;
        throw new Error(`MongoDB connection failed: ${error.message}`);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Failed to establish MongoDB connection:", error);
    throw error;
  }

  return cached.conn;
};
