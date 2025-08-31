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
import userRouter from "./routes/userRoutes.js";
import { AllError } from "./Errors/errorUtils.js";
// Global error handler
const globalError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";
    res.status(statusCode).json({
        status,
        message: `${err.message} this is it is for global error handling`,
    });
};
// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour, this is the time window this request would take to go,
    message: "too many request, please chill",
});
app.use(cors());
// IMPORTANT: Parse JSON request bodies (this was missing!)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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
    console.log(`${req.method} ${req.url} - Body:`, JSON.stringify(req.body));
    next();
});
app.use("/api/v1/users", userRouter);
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
