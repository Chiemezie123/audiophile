// Extend Express Request type to include user property
declare namespace Express {
  interface Request {
    user?: any; // You can make this more specific with your User type
  }
}

