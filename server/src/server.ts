import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js"; // add `.js` if using ES modules

dotenv.config({ path: ".env" });

// Replace password placeholder in connection string
if (!process.env.DATABASE) {
  throw new Error("DATABASE environment variable is not defined");
}
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD || ""
);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed");
    console.error(err);
    process.exit(1);
  });

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
