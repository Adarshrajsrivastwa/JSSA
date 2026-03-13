import mongoose from "mongoose";

/**
 * Connect to MongoDB Atlas
 */
export async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI || MONGODB_URI.includes("username:password") || MONGODB_URI.includes("xxxxx")) {
      console.warn("⚠️  MongoDB URI not configured or using placeholder");
      console.warn("⚠️  Server will start but database operations will fail");
      console.warn("⚠️  Please update MONGODB_URI in backend/.env file");
      console.warn("⚠️  See backend/QUICK_START.md for setup instructions");
      return false; // Don't throw, let server start
    }

    const options = {
      // Remove deprecated options, use modern defaults
    };

    await mongoose.connect(MONGODB_URI, options);

    console.log("✅ Connected to MongoDB Atlas successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });

    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.warn("⚠️  Server will continue but database operations will fail");
    console.warn("⚠️  Please check your MongoDB connection string");
    return false; // Don't throw, let server start for testing
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error);
    throw error;
  }
}
