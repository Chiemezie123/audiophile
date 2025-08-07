import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

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

// app.get('/api/v1/tours',getAllTours)

// app.get('/api/v1/tours/:id',getTour)

// app.post('/api/v1/tours',createTour )

// app.patch('/api/v1/tours/:id' , updateTour )


export default app;
