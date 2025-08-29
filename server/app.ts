import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { fileURLToPath } from "url";
import { dirname } from "path";
// import userRouter from './routes/userRoutes.js'; // Temporarily commented out

// Simple error classes for now
class AllError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
  }
}

// Simple global error handler
const globalError = (err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.message,
  });
};

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const limiter = rateLimit({
  // number of request we would make from an ip using max
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour, this is the time window this request would take to go,
  message: "too many request, please chill",
});

app.use(cors());
// serving static files
app.use(express.static(path.join(__dirname, "public")));
// data sanitation against noSql query injection
app.use(ExpressMongoSanitize());
// parse the cookie coming from the browser
app.use(cookieParser());

// Apply the rate limiting middleware to all requests.
app.use(limiter);
// set security http headers
app.use(helmet());

// developement logging to console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} yhhh`);
  next();
});

// API ROUTES
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running!",
  });
});

// app.use("/api/v1/users", userRouter); // Temporarily commented out

app.all("*", (req, res, next) => {
  // const err = new Error(`there is no ${req.url} route from the server`);
  // err.statusCode = 404;
  // err.status= 'failed';
  // console.log(`Unhandled route: ${req.method} ${req.url}`);
  const err = new AllError(`there is no ${req.url} route from the server`, 404);

  next(err);
});

app.use(globalError);

export default app;
