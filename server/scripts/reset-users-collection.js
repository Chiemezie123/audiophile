// Simple script to reset users collection
// WARNING: This will delete all user data!

import mongoose from "mongoose";

const MONGODB_URI =
  process.env.DATABASE_URI || "mongodb://localhost:27017/audiophile";

async function resetUsersCollection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Drop the entire users collection (WARNING: Deletes all data!)
    await mongoose.connection.db.collection("users").drop();
    console.log("✅ Users collection dropped successfully");

    console.log("✅ You can now restart your server and try signup again");
  } catch (error) {
    if (error.message.includes("ns not found")) {
      console.log("ℹ️  Users collection does not exist (already clean)");
    } else {
      console.error("❌ Error:", error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
  }
}

resetUsersCollection().catch(console.error);
