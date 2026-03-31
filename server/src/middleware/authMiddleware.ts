import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  console.log(authHeader, "is therer token ")

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "No token provided yeeeahhhhhh"  });
  }

  const token = authHeader.split(" ")[1];

  console.log(process.env.JWT_SECRET, 'lemme see this ')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // { id: "...", iat, exp }
    next();
  } catch (err) {
    console.log(err, "lemme see the error logs")
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default authMiddleware;
