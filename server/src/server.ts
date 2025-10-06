import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js"; // Using main app with full functionality

dotenv.config({ path: "./.env" });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Database connection
if (process.env.DATABASE) {
  const DB = process.env.DATABASE.replace(
    "<db_password>",
    process.env.DATABASE_PASSWORD || ""
  );

  mongoose
    .connect(DB)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err: any) => {
      console.error("❌ MongoDB connection failed:", err.message);
      console.log("⚠️  Continuing without database...");
    });
} else {
  console.log(
    "⚠️  No DATABASE environment variable found. Starting without database connection."
  );
}

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.error("UNHANDLED REJECTION 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
