import express, { Request, Response } from "express";

const app = express();

// Basic middleware
app.use(express.json());

// Add logging middleware to debug
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Simple test routes
app.get("/", (req: Request, res: Response) => {
  console.log("Root endpoint hit!");
  res.status(200).json({
    status: "success",
    message: "Root endpoint working!",
  });
});

app.get("/api/v1/health", (req: Request, res: Response) => {
  console.log("Health endpoint hit!");
  res.status(200).json({
    status: "success",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Catch all other routes
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found ohhhh`,
  });
});

export default app;
